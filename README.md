# CS492E-CiteRec

## ICARUS (Interactive CitAtion Recommendation with User-centered System)

The project structure is as follows:

- __web/__ : contains all of frontend files
  - _components/_ : contains all React components
    - Input.tsx : an input box for the user query
    - InteractiveChart.js : an interactive scatterplot displaying query and recommended papers
    - PaperList.tsx : a interactive recommendation list
  - _pages/_ : contains all webpages
    - index.tsx : the first and main page
  - _stores/_ : contains and maintains states used in the React application
    - PaperStore.tsx : states regarding papers
    - UIStore.tsx : states regarding the general UI

- __api/__ : contains all of backend logic
  - _recommen<span>d.</span>py_ : Given a query from the user input and the user-selected K, it embeds the query using [Sentence-BERT (Reimers et al.)](https://arxiv.org/abs/1908.10084) and compute cosine similarities against paper embeddings from the [arXiv dataset](https://www.kaggle.com/Cornell-University/arxiv). Then, it outputs top K most similar papers for recommendation.
  - (more API calls to be added)

- __app&#46;py__ : declares all implemented APIs and runs the Flask application.
