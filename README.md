[![Build Status](https://travis-ci.org/ptorn/bth-mongodb-crud.svg?branch=master)](https://travis-ci.org/ptorn/bth-mongodb-crud)
[![Scrutinizer Code Quality](https://scrutinizer-ci.com/g/ptorn/bth-mongodb-crud/badges/quality-score.png?b=master)](https://scrutinizer-ci.com/g/ptorn/bth-mongodb-crud/?branch=master)
[![Build Status](https://scrutinizer-ci.com/g/ptorn/bth-mongodb-crud/badges/build.png?b=master)](https://scrutinizer-ci.com/g/ptorn/bth-mongodb-crud/build-status/master)
[![Code Coverage](https://scrutinizer-ci.com/g/ptorn/bth-mongodb-crud/badges/coverage.png?b=master)](https://scrutinizer-ci.com/g/ptorn/bth-mongodb-crud/?branch=master)
[![codecov](https://codecov.io/gh/ptorn/bth-mongodb-crud/branch/master/graph/badge.svg)](https://codecov.io/gh/ptorn/bth-mongodb-crud)

BTH-Ramverk2 MongoDB CRUD
=====================

This is a module to handle the basic CRUD methods for a MongoDB database.

## Installation

The port for the database object to communicate to the database is determined  by the environment variable **process.env.DBWEBB_DSN**.
It will default to **mongodb://127.0.0.1:27017/**

1. Installation
`npm install bth-mongodb-crud --save`

2. Initialize
```
const dbObj = require(bth-mongodb-crud)('name of database')
```

3. Usage

#### Create object
```
Ex:
let collection = 'users';
let object = { username: 'John Smith' };

dbObj.insert(collection, object);  // returns a promise

```

#### Delete object
```
dbObj.delete(collection, key, value);

Ex:
let collection = 'users';
let key = '_id';
let value = '1234567';

dbObj.delete(collection, key, value);  // returns a promise
```

#### Update object
```
let collection = 'users';
let key = '_id';
let value = '1234567';

dbObj.update(collection, key, value, {username: 'John Doe'});  // returns a promise
```

#### Find objects
```
let collection = 'users';
let criteria = {};
let projection = {};
let limit = 0; // 0 for getting all objects found.

dbObj.findInCollection(collection, criteria, projection, limit);  // returns a promise
```

## Test

Run tests with mocha, eslint and mongodb in a docker container.

`npm -run docker-mongodb`

`npm run test`

That's it now you are all set.

**Enjoy!**
