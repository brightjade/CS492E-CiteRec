import os
# import pickle
import torch
from sentence_transformers import SentenceTransformer, util
from sklearn.decomposition import PCA
from util import *


def extract_topk_papers(user_input, category, K):

    topk_papers = []

    # Load metadata and abstract
    metadata = torch.load(os.path.join("data", f"metadata_{category}.pt"))
    abstracts = torch.load(os.path.join("data", f"abstracts_{category}.pt"))

    ##### TF-IDF #####
    # with open('data/arxiv-table.pickle', 'rb') as f:
    #     table = pickle.load(f)

    # tfidf_recommend = table.similarities(user_input.split()) # query provided by interaction
    # tfidf_recommend = list(dict(sorted(tfidf_recommend.items(), key=lambda item: item[1], reverse=True)).items())[:K]
    # print(tfidf_recommend)

    ##### Sentence-BERT #####
    model = SentenceTransformer('cache/paraphrase-MiniLM-L6-v2/')   # on deploy, use local cache folder for loading model
    # model = SentenceTransformer('paraphrase-MiniLM-L6-v2')
    sbert_embeddings = torch.load(os.path.join("data", f"sbert_embeddings_{category}.pt"))

    query_embedding = model.encode(user_input, convert_to_tensor=True)
    cos_similarities = util.pytorch_cos_sim(query_embedding, sbert_embeddings)
    topk_scores, topk_indices = torch.topk(cos_similarities, k=K)
    topk_scores = topk_scores.squeeze(0)
    topk_indices = topk_indices.squeeze(0)

    # l2 normalize embedded vectors
    # sbert_embeddings = l2_norm(sbert_embeddings)
    # query = torch.tensor(model.encode(user_input)).unsqueeze(0) # query provided by interaction
    # query = l2_norm(query)

    # compute cosine similarities between query and all sentence embeddings and get top K similarities
    # cos_sim = (sentence_embeddings * query).sum(dim=1)
    # _, topk_indices = torch.topk(cos_sim, k=K)

    # reduce dimensions using PCA to plot on x,y-coordinates
    pca = PCA(n_components=2, random_state=42)
    all_embeddings = torch.cat((sbert_embeddings, query_embedding.unsqueeze(0)), dim=0)
    all_coordinates = pca.fit_transform(all_embeddings.detach().cpu().numpy())
    # topk_coordinates = torch.index_select(torch.tensor(all_coordinates), dim=0, index=topk_indices)
    
    # pass coordinates of query vector as well
    query_data = {
        "x" : str(all_coordinates[-1][0]),
        "y" : str(all_coordinates[-1][1]),
        "text": user_input,
        "embedding": query_embedding.detach().cpu().tolist(),
    }

    for idx, i in enumerate(topk_indices):
        topk_papers.append({
            "pid": metadata[i.item()]['id'],
            "authors": metadata[i.item()]['authors'],
            "title": metadata[i.item()]['title'],
            "categories": ', '.join(metadata[i.item()]['categories']),
            "date": metadata[i.item()]['date'],
            "x": str(all_coordinates[i.item()][0]),
            "y": str(all_coordinates[i.item()][1]),
            "simscore": "{:.4f}".format(topk_scores[idx].item()),
            "embedding": all_embeddings[i.item()].detach().cpu().tolist(),
            "abstract": abstracts[i.item()],
        })

    return query_data, topk_papers


def extract_topk_papers_with_added_vectors(added_vectors, category, K):
    topk_papers = []

    # Load metadata and abstract and embeddings
    metadata = torch.load(os.path.join("data", f"metadata_{category}.pt"))
    abstracts = torch.load(os.path.join("data", f"abstracts_{category}.pt"))
    sbert_embeddings = torch.load(os.path.join("data", f"sbert_embeddings_{category}.pt"))

    # Embed query and compute cosine similarities against each paper embedding in given category
    query_embedding = torch.stack([torch.tensor(l) for l in added_vectors]).mean(dim=0)
    cos_similarities = util.pytorch_cos_sim(query_embedding, sbert_embeddings)
    topk_scores, topk_indices = torch.topk(cos_similarities, k=K)
    topk_scores = topk_scores.squeeze(0)
    topk_indices = topk_indices.squeeze(0)

    # reduce dimensions using PCA to plot on x,y-coordinates
    pca = PCA(n_components=2, random_state=42)
    all_embeddings = torch.cat((sbert_embeddings, query_embedding.unsqueeze(0)), dim=0)
    all_coordinates = pca.fit_transform(all_embeddings.detach().cpu().numpy())

    # pass coordinates of query vector as well
    query_data = {
        "x" : str(all_coordinates[-1][0]),
        "y" : str(all_coordinates[-1][1]),
        "text": "",
        "embedding": query_embedding.detach().cpu().tolist(),
    }

    for idx, i in enumerate(topk_indices):
        topk_papers.append({
            "pid": metadata[i.item()]['id'],
            "authors": metadata[i.item()]['authors'],
            "title": metadata[i.item()]['title'],
            "categories": ', '.join(metadata[i.item()]['categories']),
            "date": metadata[i.item()]['date'],
            "x": str(all_coordinates[i.item()][0]),
            "y": str(all_coordinates[i.item()][1]),
            "simscore": "{:.4f}".format(topk_scores[idx].item()),
            "embedding": all_embeddings[i.item()].detach().cpu().tolist(),
            "abstract": abstracts[i.item()],
        })

    return query_data, topk_papers
