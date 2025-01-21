# Anime Manager CLI Documentation

## Display the list of anime
To display the entire list of anime, use the command:
```
node index.js anime-manager -f ./anime.json list
```

## Filter anime by status
To filter completed anime:
```
node index.js anime-manager -f ./anime.json filter --finished
```

To filter incomplete anime:
```
node index.js anime-manager -f ./anime.json filter --unfinished
```

## Search for anime
Search by name:
```
node index.js anime-manager -f ./anime.json search --name "Anime name"
```

Search by ID:
```
node index.js anime-manager -f ./anime.json search --id 1
```

## Update anime information
Update episode count:
```
node index.js anime-manager -f ./anime.json update --id 1 --episode 10
```

Mark anime as completed:
```
node index.js anime-manager -f ./anime.json update --id 1 --finished true
```
