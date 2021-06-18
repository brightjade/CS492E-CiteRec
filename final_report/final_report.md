# Final Report

## Quality Arguments

> 

## Evaluation

>

## Discussion

> We designed ICARUS such that it supports a number of human-AI interactions in an effective and intuitive manner; however, we believe that it can be much improved to make the user experience better. First, ICARUS is an AI-advised decision-making system where the user has a flexible control over AI. The user can refine the results by adding and blacklisting recommended papers, as well as performing the “Refined Search” feature. Nevertheless, we realize that grasping the mental model of our system is difficult because random papers are very often recommended. As for the interpretability of the model, we had thought that displaying the cosine similarity score could explain the model decisions, but it lacked demonstrating the process of the model making decisions. To enhance the interpretability, we could perhaps highlight specific parts of the paper abstract that contributed the most on the similarity score. Alternatively, we could create a more complex yet interpretable scoring function than cosine similarity. A cosine similarity score ranks papers based on semantic similarity, but this might not be what the user actually wants. We could utilize additional data, such as the number of connected citations, user preferences, or even a past session history of the user, to build a more comprehensive and explainable recommendation engine.

> In terms of metrics, we had no methods of evaluating the model performance quantitatively. Paper recommendation does not really have a clear answer, as the standards for “good” recommendation differ subjectively. We could have done an A/B testing over users to build an optimized recommendation algorithm, but the amount of time and resources would be beyond the scope of a class project. In such a case, automatic evaluation metrics such as Mean Average Precision at K (MAP@K), one of the metrics for evaluating recommendation systems, could be considered.

> As for the fairness, ethics, and privacy issues, we believe that ICARUS does not cause any serious problem. It is perfectly fair in that the papers are recommended solely based on abstracts and not biased in any way, since author names, university/corporate names, or any other metadata that could hint at the identities of the papers were not given at all. However, we cannot be sure of this, as we had not run any test to check this. Moreover, such a perfectly unbiased decision-making system might not be wanted by the users because according to one of the comments from the user study, users might actually want to see popular papers or papers from well-known authors/companies first. We could perhaps add a filtering feature in which the users could select.

> Lastly, we believe that the 2-D scatterplot was simple yet clear enough to visualize well of the embedding space of the papers. But as opposed to our initial belief, the cartesian distance did not reflect the actual similarity score. Therefore, instead of visualizing the distance in the cartesian plane, we could increase the size of scatter dots by their similarity score and create an interactive graph with the dots.


## Individual Reflection

### Seokhun Jeong

>

### Jungsoo Lee

>

### Minseok Choi

> Personally, I had one of the best team experiences with our team because everyone was good at different things yet shared the same picture of the final product. Seokhun was an expert at handling the frontend with React, bootstrapping with Nextjs and managing component states with MobX (which I completely had no idea and learned another level of React programming). Jungsoo had an experience with building a platform in the HCI field, so he knew well of the user needs for the backend AI model and understood how the user studies and interviews proceed. Finally, I had an experience with deploying a React-Flask application from scratch, so it was very comfortable combining the best of the two teammates. One thing we could have done better, however, is planning the AI design process more effectively. Although the project put a heavy emphasis on the human-AI interactions, we failed to think through how much time and effort would be required for implementing the interactions. Therefore, most of the workload was focused on the frontend before each deadline, so I, who knew React, communicated with Seokhun consistently and helped implementing React components. Moreover, Jungsoo finished building our AI model early, so he helped making slides and report, as well as conducting the user studies. Due to everyone’s efforts, we were able to pull through, but for the next time, we would need a much more careful planning before designing our human-AI interactive application.

> Through designing a human-AI application as a team, I learned to think in a user-centered perspective. Before implementing each component or interaction, I would think twice whether the user would find it convenient or unintuitive. Furthermore, I did not consider the explainability or interpretability of the AI model as important, but putting myself in their shoes, I realized that the individual AI performance is not everything and that demonstrating the reason for the AI decisions is crucial. It would not only help building the mental model of AI, but it would also assist in the human-AI team collaboration performance. Lastly, by developing a web-based platform, I felt firsthand that the fast inference speed is really important for good user experience. I learned to appreciate lightweight models, especially in class projects, and would think more about the computation speed and resources in my future research and beyond.
