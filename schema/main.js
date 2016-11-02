const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLEnumType,
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

// Custom functions
const toTitleCase = str => {
    return str.replace(/\w\S*/g, txt => 
        txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
};

const EmployeeType = new GraphQLObjectType({
    name: 'Employee',
    fields: () => ({
        name: {
            type: GraphQLString,
            args: {
                upperCase: { type: GraphQLBoolean },
            },
            resolve: (obj, args) => {
                    let fullName = `${obj.firstName} ${obj.lastName}`;
                    return args.upperCase ? fullName.toUpperCase() : fullName;
            }
        },
        casingName: {
            type: GraphQLString,
            args: {
                letterCase: { type: LetterCaseType }
            },
            resolve: (obj, args) => {
                let fullName = `${obj.firstName} ${obj.lastName}`;
                switch (args.letterCase) {
                    case 'lower':
                        return fullName.toLowerCase();
                    case 'upper':
                        return fullName.toUpperCase();
                    case 'title':
                        return toTitleCase(fullName);
                    default:
                        return fullName;
                }
            }
        },
        boss: { type: EmployeeType }
    })
});

const LetterCaseType = new GraphQLEnumType({
    name: 'LetterCase',
    values: {
        TITLE: { value: 'title' },
        LOWER: { value: 'lower' },
        UPPER: { value: 'upper' }
    }
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
            },
            exEmployee: {
                type: EmployeeType,
                resolve: () => exEmployee
            }
        })
});

const mySchema = new GraphQLSchema({
    query: queryType
});

module.exports = mySchema;
