const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLBoolean,
    GraphQLList
} = require('graphql');

const roll = () => Math.floor(6 * Math.random()) + 1;

const exEmployee = {
    firstName: 'joseph',
    lastName: 'mitch'
};

const EmployeeType = new GraphQLObjectType({
    name: 'Employee',
    fields: () => ({
        name: {
            type: GraphQLString,
            args: {
                upperCase: { type: GraphQLBoolean },
                resolve: (obj, args) => {
                    let fullName = `${obj.firstName} ${obj.lastName}`;
                    return args.upperCase ? fullName.toUpperCase() : fullName;
                }
            },
            boss: { type: EmployeeType }
        }
    })
});

const queryType = new GraphQLObjectType({
    name: 'RootQuery',
    fields: () => ({
            hello: {
                description: 'Resolves the str world',
                type: GraphQLString,
                resolve: () => 'world'
            },
            diceRoll: {
                description: '**Simulate** a dice roll determined by count input',
                type: new GraphQLList(GraphQLInt),
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
                }
            },
            usersCount: {
                description: 'Shows the total users in the MongoDB',
                type: GraphQLInt,
                resolve: (_, args, { db }) =>
                    db.collection('users').count()
            }
        })
});

const mySchema = new GraphQLSchema({
    query: queryType
});

module.exports = mySchema;
