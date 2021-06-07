import os
import json
import urllib.request
from typing import List
from collections import defaultdict
from bs4 import BeautifulSoup

import numpy as np
import torch
from transformers import (
    AutoConfig,
    AutoTokenizer,
    AutoModel,
)
from sentence_transformers import SentenceTransformer
from tqdm import tqdm


CS_CATEGORIES = {'cs.CG', 'cs.GR', 'cs.DB', 'cs.FL', 'cs.CC', 'cs.SC', 'cs.MM', 'cs.PF',
                 'cs.SE', 'cs.MS', 'cs.IT', 'cs.MA', 'cs.OH', 'cs.NA', 'cs.PL', 'cs.HC',
                 'cs.RO', 'cs.DS', 'cs.CL', 'cs.AR', 'cs.ET', 'cs.NE', 'cs.CV', 'cs.CY',
                 'cs.CE', 'cs.NI', 'cs.DM', 'cs.OS', 'cs.IR', 'cs.DC', 'cs.SD', 'cs.CR',
                 'cs.LG', 'cs.GT', 'cs.LO', 'cs.SI', 'cs.DL', 'cs.GL', 'cs.SY', 'cs.AI'}


def load_and_cache_examples(data_path):

    cached_examples_file = os.path.join("data", "cached_examples.pt")
    abstracts_file = os.path.join("data", "abstracts.pt")

    if os.path.exists(cached_examples_file):
        print("Loading examples")
        examples = torch.load(cached_examples_file)
        abstracts = torch.load(abstracts_file)
    else:
        print("Creating examples")
        max_seq_len = 512
        config = AutoConfig.from_pretrained('albert-base-v2', cache_dir='cache/')
        tokenizer = AutoTokenizer.from_pretrained('albert-base-v2', cache_dir='cache/', use_fast=True)
        model = AutoModel.from_pretrained('albert-base-v2', cache_dir='cache/', config=config)
        sbert_model = SentenceTransformer('paraphrase-MiniLM-L6-v2')
        sbert_model.max_seq_length = max_seq_len
        examples, abstracts = [], []

        with open(data_path, "r", encoding="utf-8") as f:
            for line in tqdm(f, desc="Reading data"):
                json_obj = json.loads(line)
                categories = json_obj['categories'].split()
                cs_categories = []
                for c in categories:
                    if c[:2] == 'cs':   # only grab CS papers
                        cs_categories.append(c)
                
                if len(cs_categories) > 0:

                    # Preprocess abstract text
                    abstract = json_obj['abstract'].replace('\n', ' ').strip()
                    # TODO: MORE PREPROCESSING: lowercase? remove punctuation? remove stop words?

                    # SBERT Embedding
                    sbert_embedding = sbert_model.encode(abstract)

                    # BERT Embedding
                    tokens = tokenizer.tokenize(abstract)[:max_seq_len-2]
                    tokens = ['[CLS]'] + tokens + ['[SEP]']
                    input_ids = tokenizer.convert_tokens_to_ids(tokens)
                    input_ids = torch.tensor(input_ids).unsqueeze(0)
                    
                    outputs = model(input_ids=input_ids)
                    albert_embedding = outputs.pooler_output.detach().cpu().numpy()

                    examples.append({
                        "id": json_obj['id'],
                        "authors": json_obj['authors'],
                        "title": json_obj['title'],
                        "date": json_obj['update_date'],
                        "categories": cs_categories,
                        "albert_embedding": albert_embedding,
                        "sbert_embedding": sbert_embedding,
                    })
                    abstracts.append(abstract)

        torch.save(examples, cached_examples_file)
        torch.save(abstracts, abstracts_file)
    
    return examples, abstracts


def categorize_embeddings(examples, abstracts):

    sbert_embeddings_dict = defaultdict(list)
    albert_embeddings_dict = defaultdict(list)
    metadata_dict = defaultdict(list)
    abstracts_dict = defaultdict(list)

    for example, abstract in tqdm(zip(examples, abstracts), desc="Categorizing examples"):
        for category in example['categories']:
            sbert_embeddings_dict[category].append(torch.tensor(example['sbert_embedding']))        # sbert_embedding of shape (D,)
            albert_embeddings_dict[category].append(torch.tensor(example['albert_embedding']))      # albert_embedding of shape (1, D,)

            # [DEPRECATED: TOO SLOW] web scrape citation info
            # url = f"http://export.arxiv.org/api/query?id_list={example['id']}"
            # url = f"https://arxiv2bibtex.org/?q={example['id']}&format=bibtex"
            # with urllib.request.urlopen(url) as response:
            #     html = response.read()
            # soup = BeautifulSoup(html, 'html.parser')
            # textarea = soup.find_all('textarea')
            # bibtex = textarea[0].string.strip()

            metadata_dict[category].append({
                "id": example['id'],
                "authors": example['authors'],
                "title": example['title'],
                "date": example['date'],
                "categories": example['categories'],
            })
            abstracts_dict[category].append(abstract)

    sbert_stacked_embeddings_dict = {}
    albert_stacked_embeddings_dict = {}

    for category in CS_CATEGORIES:
        sbert_stacked_embeddings_dict[category] = torch.stack(sbert_embeddings_dict[category])      # stack == concat along a new dim
        albert_stacked_embeddings_dict[category] = torch.cat(albert_embeddings_dict[category])      # cat == concat along a given dim

        print(category)
        print(len(sbert_embeddings_dict[category]))
        print(len(albert_embeddings_dict[category]))
        print(len(metadata_dict[category]))
        print(len(abstracts_dict[category]))
        print()

        torch.save(sbert_stacked_embeddings_dict[category], os.path.join("data", f"sbert_embeddings_{category[3:]}.pt"))
        torch.save(albert_stacked_embeddings_dict[category], os.path.join("data", f"albert_embeddings_{category[3:]}.pt"))
        torch.save(metadata_dict[category], os.path.join("data", f"metadata_{category[3:]}.pt"))
        torch.save(abstracts_dict[category], os.path.join("data", f"abstracts_{category[3:]}.pt"))


if __name__ == "__main__":
    data_path = '../arxiv-metadata-oai-snapshot.json'

    examples, abstracts = load_and_cache_examples(data_path)
    print(len(abstracts))

    categorize_embeddings(examples, abstracts)
