# social-network

## Project Overview

# Get Involved
- copy .env.example .env 
- copy .env.development.example .env.development

## Create Postgres Database
- create a new Postgres database
- update the database connection string in `.env`

```bash
npm install
```
## Prisma migrations
```bash
npx prisma migrate dev --name init
```
## Generate Keys for JWT
```bash
node lib/generateKeyPair.js
```
move generated keys to root folder

