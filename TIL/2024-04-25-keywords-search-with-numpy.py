import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import CountVectorizer

data = [
  {"url": "https://djangoexamples.com/modern-forms", "tags": ["forms", "views"]},
  {"url": "https://djangosecurityhub.net/secure-coding-practices", "tags": ["security", "views"]},
  {"url": "https://djangorestframeworktutorial.org/api-design-guide", "tags": ["REST", "views"]},
  {"url": "https://djangomigrationsguide.com/advanced-patterns", "tags": ["migrations", "databases"]},
  {"url": "https://djangoformshandbook.com/custom-widgets", "tags": ["forms", "Frontend"]},
  {"url": "https://djangostaticfiles.com/efficient-management", "tags": ["statics", "caching"]},
  {"url": "https://djangomediahandling.com/upload-strategies", "tags": ["media", "databases"]},
  {"url": "https://djangodatabasesoptimization.com/indexing-tips", "tags": ["databases", "performance"]},
  {"url": "https://djangocachepatterns.com/strategies-for-scaling", "tags": ["caching", "performance"]},
  {"url": "https://djangofrontendintegration.com/css-frameworks", "tags": ["Frontend", "statics"]},
  {"url": "https://djangosecuritychecklist.com/xss-prevention", "tags": ["security", "Frontend"]},
  {"url": "https://djangorestbestpractices.com/token-authentication", "tags": ["REST", "security"]},
  {"url": "https://djangoquickmigrations.com/zero-downtime", "tags": ["migrations", "databases"]},
  {"url": "https://djangocleancodeprinciples.com/refactoring-techniques", "tags": ["views", "refactoring"]},
  {"url": "https://djangostaticassetmanagement.com/cdn-integration", "tags": ["statics", "caching"]},
  {"url": "https://djangomediaoptimization.com/compression-techniques", "tags": ["media", "performance"]},
  {"url": "https://djangodatabasearchitectures.com/replication", "tags": ["databases", "caching"]},
  {"url": "https://djangocacheoptimization.com/memoization", "tags": ["caching", "views"]},
  {"url": "https://djangofrontendpatterns.com/react-integration", "tags": ["Frontend", "REST"]},
  {"url": "https://djangosecuredeployment.com/https-configurations", "tags": ["security", "deployment"]}
]


def tokenizer(text):
    return text.split(", ")


if __name__ == '__main__':
    df = pd.DataFrame(data)
    corpus = df['tags'].apply(lambda x: ", ".join(x)).tolist()

    # corpus = ['forms, clean code', 'security, clean code', 'REST API, clean code', 'migrations, databases', 'forms, Frontend', 'statics, caching', 'media, databases', 'databases, performance', 'caching, performance', 'Frontend, static files', 'security, Frontend', 'REST API, security', 'migrations, databases', 'clean code, refactoring', 'static files, caching', 'media files, performance', 'databases, caching', 'caching, clean code', 'Frontend, REST API', 'security, deployment']


    # warum nicht gleich df['tags'].tolist()?
    count_vectorizer = CountVectorizer(binary=True, tokenizer=tokenizer, token_pattern=None)  # todo: token_pattern=None kann auch statt der tokenizer-Funktion verwendet werden
    count_vectorizer.fit(corpus)
    feature_names = count_vectorizer.get_feature_names_out()
    # copilot generated: matrix = count_vectorizer.transform(corpus).toarray()
    # matrix = count_vectorizer.transform(df['tags'])
    matrix = count_vectorizer.transform(df['tags'].apply(lambda x: ", ".join(x)))
    tokens = sorted(count_vectorizer.vocabulary_.keys(), key=lambda token: count_vectorizer.vocabulary_[token])
    fit = pd.DataFrame(matrix.toarray(), columns=tokens)
    fit["url"] = df["url"]
    fit.set_index("url", inplace=True)

    query_vector = count_vectorizer.transform(["caching, frontend"])

    a = matrix.dot(query_vector.T).todense()
    number_of_query_tokens = query_vector.sum()
    # a[a<number_of_query_tokens] = 0
    # a[a >= number_of_query_tokens] = 1

    fit["score"] = a.sum(axis=1)
    print(fit.sort_values("score", ascending=False))
