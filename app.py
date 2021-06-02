from flask import Flask, request, send_from_directory, abort
from flask_cors import CORS
from werkzeug.utils import secure_filename
import logging
import secrets
import torch
import tqdm
import json
import pickle
import time

# from transformers import BertTokenizer, BertModel
from sklearn.manifold import TSNE
from sklearn.decomposition import PCA
from util import *

data_root= '/home/nas1_userA/minseokchoi20/coursework/2021spring/cs492e/data'
k=5

# load abstract and metadata
with open(f'{data_root}/arxiv-abstract-final.pickle', 'rb') as f:
    abstract = pickle.load(f)
with open(f'{data_root}/arxiv-metadata-final.pickle', 'rb') as f:
    metadata = pickle.load(f)
print(f'abstract len: {len(abstract)}')

##### TF-IDF #####
with open(f'{data_root}/arxiv-table.pickle', 'rb') as f:
    table = pickle.load(f)
# query = 'Several studies tried to tackle urban scene segmentation'
query = 'long tailed classification'
tfidf_recommend = table.similarities(query.split(' ')) # query provided by interaction
tfidf_recommend = list(dict(sorted(tfidf_recommend.items(), key=lambda item: item[1], reverse=True)).items())[:k]
print("******* TF-IDF Recommendation *******")
print(tfidf_recommend)

##### Sentence-BERT  #####
from sentence_transformers import SentenceTransformer
model = SentenceTransformer('nli-roberta-large')
with open(f'{data_root}/arxiv-embeddings.pickle', 'rb') as f:
    sentence_embeddings = pickle.load(f)

# l2 normalize embedded vectors
sentence_embeddings = l2_norm(sentence_embeddings)
before_time = time.time()
query = torch.tensor(model.encode(query)).unsqueeze(0) # query provided by interaction
query = l2_norm(query)
cos_sim = (sentence_embeddings * query).sum(dim=1)
sim, index = torch.topk(cos_sim, k)

print("******* Sentence BERT Recommendation *******")
recommend_metadata= []
for i in index:
    recommend_metadata.append(metadata[i.item()])
after_time = time.time()
print(f'sbert time consumed: {after_time - before_time}')

before_time = time.time()
pca = PCA(n_components=2, random_state=3)
embedding = torch.cat((sentence_embeddings, query), dim=0)
coordinate = pca.fit_transform(embedding.detach().cpu().numpy())
after_time = time.time()
print(f'pca time consumed: {after_time - before_time}')
recommend_coordinate = torch.index_select(torch.tensor(coordinate), 0, index)
print('xy coordinate:')
print(recommend_coordinate)

# UI STARTS HERE
# Create a custom logger
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

# Create handlers for logging to stream(console) and file
stream_handler = logging.StreamHandler()
file_handler = logging.FileHandler('server.log')

stream_formatter = logging.Formatter('%(name)s - %(levelname)s - %(message)s')
file_formatter = logging.Formatter('%(asctime)s : %(levelname)s : %(name)s : %(message)s')

stream_handler.setFormatter(stream_formatter)
file_handler.setFormatter(file_formatter)

logger.addHandler(stream_handler)
logger.addHandler(file_handler)

# Initiate Flask
app = Flask(__name__, static_url_path='', static_folder='web/build')
app.secret_key = secrets.token_bytes(32)
CORS(app)     # turn this off in production.

@app.route('/ping')
def ping():
    logger.info("ping success")
    return {'success': "Success!"}

# might need this in production
# @app.route('/', defaults={'path':''})
# def serve(path):
#     print("HI!")
#     return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    logger.info('Starting Flask API Server.')
    app.run(host="0.0.0.0", port=8080, debug=True)
