const { graphql } = require('graphql');
const readline = require('readline');
const { MongoClient } = require('mongodb');
const assert = require('assert');

const MONGO_URL = process.env.MONGO_URL;
const mySchema = require('./schema/main');

MongoClient.connect(MONGO_URL, (err, db) => {
	assert.equal(null, err);
	console.log('You are connected to MongoDB server');

	const rli = readline.createInterface({
		input: process.stdin,
		output: process.stdout
	});

	rli.question('Client Request: ', inputQuery => {
		graphql(mySchema, inputQuery, {}, { db }).then(res => {

			console.log('Server Answer: ', res.data);
			db.collection('users').count()
     		  .then(usersCount => console.log(usersCount));

			db.close(() => rli.close());
		});

	});
});

