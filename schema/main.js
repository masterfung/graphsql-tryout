const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLEnumType,
    GraphQLString,
    GraphQLInt,
    GraphQLBoolean,
    GraphQLList
} = require('graphql');
const fs = require('fs');

const roll = () => Math.floor(6 * Math.random()) + 1;

const exEmployee = {
    firstName: 'joseph',
    lastName: 'mitch'
};

// Title casing function for the name usages
const toTitleCase = str => {
    return str.replace(/\w\S*/g, txt => 
        txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
};

const appendLinePromise = (path, line) => {
    return new Promise((resolve, reject) => {
        fs.appendFile(path, line, err => {
            if (err) {throw reject(err)};
            resolve(line + '\n');
        });
    });
};

const readLastLinePromise = path => {
    return new Promise((resolve, reject) => {
        fs.readFile(path, (err, data) => {
            if (err) {throw reject(err)};
            resolve(data.toString().trim().split('\n').slice(-1)[0]);
        });
    });
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
                description: 'Displays a static name back',
                resolve: () => exEmployee
            },
            lastQuote: {
                type: GraphQLString,
                description: 'Pulls from the quotes.txt file from data and displays the last line',
                resolve: () => readLastLinePromise('data/quotes.txt')
            }
        })
});

const mutationType = new GraphQLObjectType({
    name: 'RootMutation',
    fields: {
        addQuote: {
            type: GraphQLString,
            description: 'Add string text that gets appended to quotes.txt file',
            args: {
                body: { type: GraphQLString }
            },
            resolve: (_, args) => appendLinePromise('data/quotes.txt', args.body)
        }
    }
});

const mySchema = new GraphQLSchema({
    query: queryType,
    mutation: mutationType
});

module.exports = mySchema;
