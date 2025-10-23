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

[BRD](https://gist.github.com/d3hiring/4d1415d445033d316c36a56f0953f4ef)