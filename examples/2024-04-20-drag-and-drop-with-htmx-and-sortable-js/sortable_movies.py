#!/usr/bin/env -S uv run --python 3.12
# /// script
# dependencies = ["nanodjango"]
# ///

from nanodjango import Django
from django.shortcuts import render

app = Django()

movies = [
    "The Shawshank Redemption",
    "Inception",
    "The Godfather",
    "Pulp Fiction",
    "Forrest Gump",
    "The Matrix",
    "Parasite",
    "Back to the Future",
    "The Dark Knight",
    "Avatar",
]

@app.route("/")
def index(request):
    return render(request, "index.html", {"movies": movies})

@app.route("/sort/")
def sort(request):
    global movies

    if request.method != 'POST':
        return "Method not allowed", 405

    new_order = request.POST.getlist("movie")
    new_list = [movies[int(i)] for i in new_order]
    movies = new_list
    return render(request, "_movies.html", {"movies": movies})

if __name__ == "__main__":
    print("🚀 Starting sortable movies app...")
    print("📱 Open http://localhost:8000 in your browser")
    print("🎬 Drag and drop movies to reorder them!")
    app.run()
