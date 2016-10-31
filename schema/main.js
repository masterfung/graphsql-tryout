const {
     GraphQLSchema,
     GraphQLObjectType,
     GraphQLString,
     GraphQLInt,
     GraphQLList
} = require('graphql');

const roll = () => Math.floor(6 * Math.random()) + 1;
   
const queryType = new GraphQLObjectType({
     name: 'RootQuery',
     fields: {
       hello: {
         type: GraphQLString,
         resolve: () => 'world'
		},
        diceRoll: {
         type: new GraphQLList(GraphQLInt), // defining the type
         args: {
            count: { 
                type: GraphQLInt,
                defaultValue: 3
             }
         },
         resolve: (_, args) => {
            let rolls = [];
            for (let i = 0; i < args.count; i++) {
                rolls.push(roll());
            }
            return rolls;
         } // two random numbers
        } 
	}
});

const mySchema = new GraphQLSchema({
     query: queryType
});

module.exports = mySchema;