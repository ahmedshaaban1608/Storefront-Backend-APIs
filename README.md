# Storefront backend api

 ## Table of contents

 * [Overview](#overview)
 * [Requirments](#requirments)
 * [How to use](#how-to-use)
 * [Copyright](#copyright) 

 ## Overview
The storefront backend API project is built using Node.js to cover RESTful APIs which be used by front-end developers to access the store database.

[back to top](#table-of-contents)

 ## Requirments
 
#### 1- prettier
#### 2- ESlint
#### 3- Typescript
#### 4- Jasmine
#### 5- Express
#### 6- Cors
#### 7- JWT
#### 8- Supertest
#### 9- Bcrypt
#### 10- db-migrate
#### 11- Postgres
#### 12- dotenv
#### 13- tsc-watch

[back to top](#table-of-contents)


## How to use
#### 1- download the project
#### 2- install all required packages
`npm install`
#### 3- create a development database using Postgres
#### 4- create a testing database using Postgres
#### 5- create a user and grant all privileges to the two databases
#### 6- create a dotenv file and add the following code inside it.
```
# Postgres Databases
POSTGRES_HOST = 
POSTGRES_DB = 
POSTGRES_TEST_DB = 
POSTGRES_USER = 
POSTGRES_PASSWORD = 
ENV = dev

# Bcrypt details
BCRYPT_PASSWORD = 
SALT_ROUNDS = 10

# JWT details
TOKEN_SECRET= 
```
#### 7- add the details of your database inside the dotenv file
#### 8- add your own BCRYPT_PASSWORD and TOKEN_SECRET values for hashing and secret token
#### 9- run prettier script
`npm run prettier`
#### 10- run ESlin script
`npm run lint`
#### 11- run test script
`npm run test`
#### 12- start the server
`npm run start`
#### 13- visit homepage endpoint
`http://localhost:3200`
#### 14- for endpoints visit [REQUIRMENTS.md](REQUIREMENTS.md) file
#### 15- the Postgres database is running on port 5432

[back to top](#table-of-contents)

## Copyright
coded by [Ahmed Shaaban Ahmed](https://www.linkedin.com/in/ahmed-shaaban2210/)

[back to top](#table-of-contents)
