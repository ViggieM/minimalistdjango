---
title: Document Search with Scikit-Learn
pubDate: 2024-04-25
shortDescription: Implementing keyword search on documents using scikit-learn's binary CountVectorizer for text analysis
tags:
  - Backend
keywords: machine learning, text search, scikit-learn, nlp, document retrieval, vector search
---

Build a keyword search engine using scikit-learn's text vectorization to find relevant documents.
An [equivalent Jupiter Notebook](https://github.com/ViggieM/minimalistdjango/blob/main/TIL/2024-04-25-search-documents-with-scikit-learn.ipynb) can be found in the GitHub repository.

## Setup

```bash
pip install scikit-learn pandas numpy
```

```python
import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer
```

Import the necessary libraries for text processing and data manipulation.

## Sample Documents

```python
documents = [
  {"id": 1, "text": "Programming requires logical thinking and problem-solving skills."},
  {"id": 2, "text": "Learning to code improves problem-solving and logical thinking abilities."},
  {"id": 3, "text": "Logical thinking is essential for writing efficient code."},
  {"id": 4, "text": "Effective programming involves solving complex problems logically."},
  {"id": 5, "text": "Developing software enhances problem-solving and logical thinking."}
]

df = pd.DataFrame(documents)
```

Create a collection of text documents that we want to search through. Each document has an ID and text content.

## Vectorize Documents

```python
# Create binary count vectorizer
count_vectorizer = CountVectorizer(binary=True)
count_vectorizer.fit(df["text"].tolist())

# Get feature names (vocabulary)
count_vectorizer.get_feature_names_out()
# Output: ['abilities', 'and', 'code', 'complex', 'developing', ...]
```

The vectorizer learns the vocabulary from all documents and creates a binary representation (word present = 1, absent = 0).

## Create Document Matrix

```python
corpus = df['text'].tolist()
matrix = count_vectorizer.transform(corpus)

# Convert to DataFrame for visualization
tokens = sorted(count_vectorizer.vocabulary_.keys(),
                key=lambda token: count_vectorizer.vocabulary_[token])
fit = pd.DataFrame(matrix.toarray(), columns=tokens)
fit["text"] = df["text"]
fit.set_index("text", inplace=True)
```

Transform all documents into a matrix where each row is a document and each column represents a word from the vocabulary.

## Search Implementation

```python
# Transform query to same vector space
query_vector = count_vectorizer.transform(["logical thinking"])

# Calculate similarity scores (dot product)
scores = matrix.dot(query_vector.T).todense()
fit["score"] = scores.sum(axis=1)

# Sort by relevance
results = fit.sort_values("score", ascending=False)
```

Convert the search query into the same vector space, then calculate how many query words each document contains using matrix multiplication.

## Results

Documents ranked by similarity to "logical thinking":
- Score 2: Contains both "logical" and "thinking"
- Score 0: Contains neither term

This creates a foundation for text search using vector space models.
For more sophisticated ranking, consider using `TfidfVectorizer` instead of binary counts to weight terms by their frequency and rarity across documents.
