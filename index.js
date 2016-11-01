const { graphql } = require('graphql');
const readline = require('readline');
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

	app.use('graphql', graphqlHTTP({
		schema: mySchema,
		context: { db }
	}));

	app.listen(3000, () =>
		console.log('Express is running on port 3000')
	);

	const rli = readline.createInterface({
		input: process.stdin,
		output: process.stdout
	});

	rli.question('Client Request: ', inputQuery => {
		graphql(mySchema, inputQuery, {}, { db }).then(res => {

			console.log('Server Answer: ', res.data);

			db.close(() => rli.close());
		});

	});
});



