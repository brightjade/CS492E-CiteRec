from flask import Flask, request, send_from_directory, abort
from flask_cors import CORS
from werkzeug.utils import secure_filename
import logging
import secrets
import torch
import tqdm
import json
import pickle

# from transformers import BertTokenizer, BertModel
from sklearn.manifold import TSNE
from util import *

# load abstract and metadata
with open('/home/nas1_userA/minseokchoi20/coursework/2021spring/cs492e/data/arxiv-abstract-final.pickle', 'rb') as f:
    abstract = pickle.load(f)
with open('/home/nas1_userA/minseokchoi20/coursework/2021spring/cs492e/data/arxiv-metadata-final.pickle', 'rb') as f:
    metadata = pickle.load(f)
print(f'abstract len: {len(abstract)}')

##### TF-IDF #####
with open('/home/nas1_userA/minseokchoi20/coursework/2021spring/cs492e/data/arxiv-table.pickle', 'rb') as f:
    table = pickle.load(f)
tfidf_recommend = table.similarities(["image", "translation"]) # query provided by interaction
k=5
tfidf_recommend = list(dict(sorted(tfidf_recommend.items(), key=lambda item: item[1], reverse=True)).items())[:k]

##### Sentence-BERT  #####
from sentence_transformers import SentenceTransformer
model = SentenceTransformer('nli-roberta-large')
with open('/home/nas1_userA/minseokchoi20/coursework/2021spring/cs492e/data/arxiv-embeddings.pickle', 'rb') as f:
    sentence_embeddings = pickle.load(f)

# l2 normalize embedded vectors
sentence_embeddings = l2_norm(sentence_embeddings)
query = torch.tensor(model.encode('urban scene segmentation')).unsqueeze(0) # query provided by interaction
query = l2_norm(query)
cos_sim = (sentence_embeddings * query).sum(dim=1)
k=5
sim, index = torch.topk(cos_sim, k)
for i in index:
    print(metadata[i.item()])

import pdb; pdb.set_trace()

# tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')
# model = BertModel.from_pretrained('bert-base-uncased')
# inputs = tokenizer("Hello, my dog is cute. Hello, my dog is cute. Hello, my dog is cute. Hello, my dog is cute.", return_tensors="pt")
# outputs = model(**inputs)
# last_hidden_states = outputs.last_hidden_state

tsne = TSNE(n_components=2, perplexity=10, n_iter=300)

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
