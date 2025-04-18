import requests

url = "https://api.themoviedb.org/3/account/21952048/watchlist/tv?language=en-US&page=1&sort_by=created_at.asc"

headers = {
    "accept": "application/json",
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4M2E5OTZlZTdlZTM2OGIyNGQ3Zjk2N2U2MWZiYjhlZiIsIm5iZiI6MTc0NDc5NzQ2My4zMDQ5OTk4LCJzdWIiOiI2N2ZmN2YxNzgzYzZlNTY3YzdkOTJkZjYiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.Wcig5CTEjOilBGKqm09Od-H-liibMD0f6x1vqWykwN4"
}

response = requests.get(url, headers=headers)

print(response.text)