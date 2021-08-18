# ![Node/Express/Mongoose Example App](project-logo.png)

[![Build Status](https://travis-ci.org/anishkny/node-express-realworld-example-app.svg?branch=master)](https://travis-ci.org/anishkny/node-express-realworld-example-app)

> ### NestJS codebase containing real world examples (CRUD, auth, advanced patterns, etc) that adheres to the [RealWorld](https://github.com/gothinkster/realworld-example-apps) API spec.


----------

# Getting started

## Installation

Clone the repository

    git clone git@github.com:smartassskeleton/nestjs-realworld-example-app.git

Switch to the repo folder

    cd nestjs-realworld-example-app
    
Install dependencies
    
    npm install
    
----------

##### Prisma

----------

To run the example with Prisma checkout branch `prisma`, remove the node_modules and run `npm install`

Create a new mysql database with the name `nestjsrealworld-prisma` (or the name you specified in `prisma/.env`)

Copy prisma config example file for database settings

    cp prisma/.env.example prisma/.env

Set mysql database settings in prisma/.env

    DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE"

To create all tables in the new database and seed them, run the database migration from the prisma schema defined in prisma/schema.prisma

    npx prisma migrate dev reset

Now generate the prisma client from the migrated database with the following command

    npx prisma generate

The database tables are now set up and the prisma client is generated. For more information see the docs:

- https://www.prisma.io/docs/getting-started/setup-prisma/add-to-existing-project-typescript-mysql


----------

## NPM scripts

- `npm start` - Start application
- `npm run start:watch` - Start application in watch mode
- `npm run test` - run Jest test runner 
- `npm run start:prod` - Build application

----------

## Local development using Docker

The project is ready for local development using Docker and Docker-Compose. To facilitate local development use the [Makefile](Makefile).

For a list of commands

    make help

The Makefile requires 2 files to run, `config.env` and `deploy.env`. Make a copy of them based on the example files and fill in your information.

    cp deploy.env.example deploy.env && cp config.env.example config.env

The repository contains 2 Docker images. One for local developmen called [Dockerfile](Dockerfile) and the 2nd is for Production purposes called [Dockerfile.prod](Dockerfile.prod). The Docker-Compose file uses the local development Docker file.

**note**
The docker-compose file doesn't contain a volume. This means that ones you destroy your database container all the data in it will be lost. To add a volume uncomment the lines in the [docker-compose.yml](docker-compose.yml) file.

---------- 

## Terraform

The project contains 

----------

## API Specification

This application adheres to the api specifications set by the [Thinkster](https://github.com/gothinkster) team. This helps mix and match any backend with any other frontend without conflicts.

> [Full API Spec](https://github.com/gothinkster/realworld/tree/master/api)

More information regarding the project can be found here https://github.com/gothinkster/realworld

----------

## Start application

- `npm start`
- Test api with `http://localhost:3000/api/articles` in your favourite browser

----------

# Authentication
 
This applications uses JSON Web Token (JWT) to handle authentication. The token is passed with each request using the `Authorization` header with `Token` scheme. The JWT authentication middleware handles the validation and authentication of the token. Please check the following sources to learn more about JWT.

----------
 
# Swagger API docs

This example repo uses the NestJS swagger module for API documentation. [NestJS Swagger](https://github.com/nestjs/swagger) - [www.swagger.io](https://swagger.io/)        