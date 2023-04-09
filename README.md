<div align="center">
  <h1>🧤 Henna Server 🧤</h1>
</div>

# Table of Contents

- [Project Structure](#project-structure)
- [MongoDB Setup](#mongodb-setup)
- [Possible Errors]()

## Project Structure

```sh
- src/
  - controllers/
    - appointment.js
    - auth.js
    - user.js
  - models/
    - appointment.js
    - portfolio.js
    - rating.js
    - review.js
    - user.js
  - routes/
    - appointment.js
    - auth.js
    - user.js
  - utils/
    - jwt.js
  - app.js
  - config.js
  - server.js
```

## MongoDB Setup

### Running mongo via docker(manual)

If you want to persist the data on your local machine, you can mount a volume using the -v argument.

```sh
# create mongodb_data directory with writable permission by docker process
mkdir -m 777 mongodb_data
export MONGODB_VERSION=6.0-ubi8
docker run --name mongodb -d -p 27017:27017 -v $(pwd)/data:/data/db mongodb/mongodb-community-server:$MONGODB_VERSION
```

Using this method, you will be able to connect to your MongoDB instance on `mongodb://localhost:27017`. You can try it with [Compass](https://www.mongodb.com/products/compass), MongoDB’s GUI to visualize and analyze your data.

Any data created as part of the lifecycle of that container will be destroyed once the container is deleted. You can do that with the Docker stop and rm commands.

```sh
docker stop mongodb && docker rm mongodb
```

### Running mongo via docker-compose

```yaml
# docker-compose.yaml
version: "3"
services:
  myapplication:
    image: mongodb/mongodb-community-server:6.0-ubi8
    environment:
      - CONN_STR=mongodb://user:pass@mongodb
    command: '/bin/bash -c "sleep 5; mongosh $$CONN_STR --eval \"show dbs;\""'
    depends_on:
      - mongodb
  mongodb:
    image: mongodb/mongodb-community-server:6.0-ubi8
    environment:
      - MONGO_INITDB_ROOT_USERNAME=user
      - MONGO_INITDB_ROOT_PASSWORD=pass
    volumes:
      - type: bind
        source: ./data
        target: /data/db
```

## Possible Errors

Mongoose couldn't connect to the mongodb as I had a volume which didn't have root user. That's why I had to remove my volume to connect mongodb successfully.

```sh
docker-compose stop
docker-compose rm
docker volume rm <your-volume>
docker-compose up --build -d
```
