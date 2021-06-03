import os
import pickle
import torch
import tqdm
from sentence_transformers import SentenceTransformer
from sklearn.manifold import TSNE
from sklearn.decomposition import PCA
from util import *


def extract_topk_papers(user_input, K):

    topk_papers = []

    # load metadata
    with open('data/arxiv-metadata-final.pickle', 'rb') as f:
        metadata = pickle.load(f)
    print(f'metadata len: {len(metadata)}')

    ##### TF-IDF #####
    # with open('data/arxiv-table.pickle', 'rb') as f:
    #     table = pickle.load(f)

    # tfidf_recommend = table.similarities(user_input.split()) # query provided by interaction
    # tfidf_recommend = list(dict(sorted(tfidf_recommend.items(), key=lambda item: item[1], reverse=True)).items())[:K]
    # print(tfidf_recommend)

    ##### Sentence-BERT #####
    model = SentenceTransformer('cache/nli-roberta-large/')   # on deploy, use local cache folder for loading model
    # model = SentenceTransformer('nli-roberta-large')
    with open('data/arxiv-embeddings.pickle', 'rb') as f:
        sentence_embeddings = pickle.load(f)

    # l2 normalize embedded vectors
    sentence_embeddings = l2_norm(sentence_embeddings)
    query = torch.tensor(model.encode(user_input)).unsqueeze(0) # query provided by interaction
    query = l2_norm(query)

    # compute cosine similarities between query and all sentence embeddings and get top K similarities
    cos_sim = (sentence_embeddings * query).sum(dim=1)
    _, topk_indices = torch.topk(cos_sim, k=K)

    # reduce dimensions using PCA to plot on x,y-coordinates
    pca = PCA(n_components=2, random_state=3)
    all_embeddings = torch.cat((sentence_embeddings, query), dim=0)
    all_coordinates = pca.fit_transform(all_embeddings.detach().cpu().numpy())
    # topk_coordinates = torch.index_select(torch.tensor(all_coordinates), dim=0, index=topk_indices)
    
    # pass coordinates of query vector as well
    query_coordinates = {
        "x" : str(all_coordinates[-1][0]),
        "y" : str(all_coordinates[-1][1]),
        "embedding": query.squeeze(0).detach().cpu().tolist(),
        "text": user_input,
    }

    for i in topk_indices:
        topk_papers.append({
            "pid": metadata[i.item()][0],
            "authors": metadata[i.item()][1],
            "title": metadata[i.item()][2],
            "categories": metadata[i.item()][3],
            "date": metadata[i.item()][4],
            "x": str(all_coordinates[i.item()][0]),
            "y": str(all_coordinates[i.item()][1]),
            "embedding": all_embeddings[i.item()].detach().cpu().tolist(),
        })

    return query_coordinates, topk_papers
