# CS492E-CiteRec

## ICARUS (Interactive CitAtion Recommender with User-centered System)

### Project Summary
When writing a research paper, it is labor-intensive to find the necessary previous papers to cite or refer to them. 
In order to address such an issue, we propose ICARUS (Interactive CitAtion Recommender with User-centered System) which recommends previous papers that might be helpful for researchers (users) to refer to.
The unique approach of ICARUS is that users can interactively explore the previous papers via 2D projection of them and revise the recommendations based on their own tastes. 

### Instruction
1. Users type in the sentence that they need papers for recommendation in the left text box
2. Based on the query sentence, ICARUS recommends papers to read based on Tf-Idf and Sentence BERT.
3. While displaying the papers, ICARUS also shows the 2D projection of the papers on the right.
4. Users can explore the papers while checking the relationships among them.
5. Users can also add or reject the paper (noted as blacklist in ICARUS).