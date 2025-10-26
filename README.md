# teachers-portal-mysql
teachers-portal-mysql

```bash
# Build Container
docker compose up -d --build
# Explore Container
docker compose exec teachers-portal-app sh
```

```bash
# TLDR: Run these commands in Docker Container
# Create new migrations from the schema.prisma changes
npx prisma migrate dev
# To seed new data in the container
npm run seed
```

### Helper Commands

If you notice file change detection issues, add the `--poll` flag to your dev script:

```bash
"dev": "ts-node-dev --respawn --transpile-only --poll --require tsconfig-paths/register src/index.ts"
```
This ensures the file watcher works even through Docker’s mounted volumes.


Run a migration if schema changed. Otherwise npm will show some error

```bash
npx prisma migrate dev
```

### Docker Deployment
```bash
# To publish the image in the docker hub
docker tag <local-image>:<tag> <dockerhub-username>/<repo-name>:<tag>

GIT_SHA=$(git rev-parse --short HEAD)

docker tag teachers-portal-app:$GIT_SHA akshayhere/teachers-portal-app:$GIT_SHA

docker push johndoe/express-app:latest

# Local build with Git hash
docker build -t akshayhere/teachers-portal-app:$GIT_SHA --build-arg GIT_SHA=$GIT_SHA .

# Build and push in one go
docker build -t akshayhere/teachers-portal-app:$GIT_SHA .
docker push akshayhere/teachers-portal-app:$GIT_SHA

GIT_SHA=$(git rev-parse --short HEAD)
docker build -t akshayhere/teachers-portal-app:$GIT_SHA --build-arg GIT_SHA=$GIT_SHA .
docker push akshayhereteachers-portal-app:$GIT_SHA
docker tag akshayhere/teachers-portal-app:$GIT_SHA akshayhere/teachers-portal-app:latest
docker push akshayhere/teachers-portal-app:latest

```

[BRD](https://gist.github.com/d3hiring/4d1415d445033d316c36a56f0953f4ef)

```bash
# GIT_SHA=$(git rev-parse --short HEAD)
GIT_SHA=$(date +%Y%m%d-%H%M%S)
docker build -t teachers-portal-app:$GIT_SHA .
docker tag teachers-portal-app:$GIT_SHA akshayhere/teachers-portal-app:$GIT_SHA
docker push akshayhere/teachers-portal-app:$GIT_SHA
docker tag akshayhere/teachers-portal-app:$GIT_SHA akshayhere/teachers-portal-app:latest
docker push akshayhere/teachers-portal-app:latest
```