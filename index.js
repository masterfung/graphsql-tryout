const { MongoClient } = require('mongodb');
const assert = require('assert');
const graphqlHTTP = require('express-graphql');
const express = require('express');

const app = express();

const MONGO_URL = process.env.MONGO_URL;
const mySchema = require('./schema/main');

MongoClient.connect(MONGO_URL, (err, db) => {
	assert.equal(null, err);
	console.log('You are connected to MongoDB server');

	app.use('/graphql', graphqlHTTP({
		schema: mySchema,
		context: { db },
		graphiql: true
	}));

	app.listen(3000, () =>
		console.log('Express is running on localhost port 3000')
	);

});



