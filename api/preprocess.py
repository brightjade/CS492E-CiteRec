import json


def read_data(data_path):
    abstracts = []
    with open(data_path, "r") as f:
        for line in f:
            js_obj = json.loads(line)
            abstract = js_obj['abstract']
            abstracts.append(abstract)

    return abstracts

