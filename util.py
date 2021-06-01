import sys
import os
import torch

class TfIdf:
    def __init__(self):
        self.weighted = False
        self.documents = []
        self.corpus_dict = {}

    def add_document(self, doc_name, list_of_words):
        # building a dictionary
        doc_dict = {}
        for w in list_of_words:
            doc_dict[w] = doc_dict.get(w, 0.) + 1.0
            self.corpus_dict[w] = self.corpus_dict.get(w, 0.0) + 1.0

        # normalizing the dictionary
        length = float(len(list_of_words))
        for k in doc_dict:
            doc_dict[k] = doc_dict[k] / length

        # add the normalized document to the corpus
        self.documents.append([doc_name, doc_dict])

    def similarities(self, list_of_words):
        """Returns a list of all the [docname, similarity_score] pairs relative to a
list of words.
        """

        # building the query dictionary
        query_dict = {}
        for w in list_of_words:
            query_dict[w] = query_dict.get(w, 0.0) + 1.0

        # normalizing the query
        length = float(len(list_of_words))
        for k in query_dict:
            query_dict[k] = query_dict[k] / length

        # computing the list of similarities
        sims = {}
        for doc in self.documents:
            score = 0.0
            doc_dict = doc[1]
            for k in query_dict:
                if k in doc_dict:
                    score += (query_dict[k] / self.corpus_dict[k]) + (
                      doc_dict[k] / self.corpus_dict[k])
            # sims.append([doc[0], score])
            sims[doc[0]] = score

        return sims

def l2_norm(input, axis=1):
    norm = torch.norm(input,2,axis,True)
    output = torch.div(input, norm)
    return output

########## PREPROCESS CODES ###############
#
# text_dir = '/home/nas1_userA/minseokchoi20/coursework/2021spring/cs492e/data/arxiv-metadata-oai-snapshot.json'
# # text_dir = '/Users/ijeongsu/Downloads/arxiv-metadata-oai-snapshot.json'
# data = []
# for line in open(text_dir, 'r'):
#     data.append(json.loads(line))

# categories = set()
# abstract = {}
# years = set()
# meta_data = {}
# idx = 0
# for datum in tqdm.tqdm(data):
#     # if 'physics' not in datum['categories'] and 'cs' in datum['categories'] and int(datum['versions'][0]['created'].split(' ')[3]) >= 2011:
#     if ('cs.CV' in datum['categories'] or 'cs.AI' in datum['categories'] or 'stat.ML' in datum['categories']) and int(datum['versions'][0]['created'].split(' ')[3]) >= 2011:
#         abstract[idx] = datum['abstract'].replace('\n', ' ')
#         meta_data[idx] = [datum['id'], datum['authors'], datum['title'], datum['categories'], datum['update_date']]
#         idx += 1
#         categories.add(datum['categories'])
#
#
# with open('/home/nas1_userA/minseokchoi20/coursework/2021spring/cs492e/data/arxiv-abstract-final.pickle', 'wb') as f:
#     pickle.dump(abstract, f)
#
# with open('/home/nas1_userA/minseokchoi20/coursework/2021spring/cs492e/data/arxiv-metadata-final.pickle', 'wb') as f:
#     pickle.dump(meta_data, f)

# ##### TF-IDF #####
# table = TfIdf()
# for i, sentence in enumerate(tqdm.tqdm(abstract)):
#     words = abstract[i].split(' ')
#     words = [word.strip("()").strip(",").strip("{}").strip(").").strip(".").lower() for word in words if word]
#     table.add_document(metadata[i][2].strip("\n"), words)
#
# with open('/home/nas1_userA/minseokchoi20/coursework/2021spring/cs492e/data/arxiv-table.pickle', 'wb') as f:
#     pickle.dump(table, f)
#

# ##### Sentence-BERT  #####
# from sentence_transformers import SentenceTransformer
# model = SentenceTransformer('nli-roberta-large')
# # sentence_embeddings = []
# # for i, sentences in enumerate(tqdm.tqdm(abstract)):
# #     sentence_embeddings.append(torch.tensor(model.encode(abstract[i])))
# # import pdb; pdb.set_trace()
# # sentence_embeddings = torch.stack(sentence_embeddings)
# # print("Sentence embeddings:")
# # with open('/home/nas1_userA/minseokchoi20/coursework/2021spring/cs492e/data/arxiv-embeddings.pickle', 'wb') as f:
# #     pickle.dump(sentence_embeddings, f)