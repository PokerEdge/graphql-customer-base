const axios = require('axios');

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull,
} = require('graphql');

// // Hard coded data (where db query could be)
// const customers = [
//     { id: '1', name: 'Reid Young', email: 'reid@gmail.com', age: 33 },
//     { id: '2', name: 'Shalee Woody', email: 'shalee@gmail.com', age: 28 },
//     { id: '3', name: 'Jon Schneider', email: 'jon@gmail.com', age: 32 },
// ];

// Customer Type
const CustomerType = new GraphQLObjectType({
    name: 'Customer',
    fields: () => ({
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        age: { type: GraphQLInt}
    })
});

// Root Query
// Can create as many types as you like, for instance customers might have products
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        customer: {
            type: CustomerType,
            args: {
                id: { type: GraphQLString },
            },
            resolve(parentValue, args) {
                // // Find and return searched for customer by id. Later done by get request
                // for(let i = 0; i < customers.length; i++){
                //     if(customers[i].id == args.id) return customers[i];
                // }

                return axios.get(`http://localhost:3000/customers/${args.id}`)
                    .then(res => res.data);
            }
        },
        customers: {
            type: new GraphQLList(CustomerType),
            resolve(parentValue, args) {
                return axios.get(`http://localhost:3000/customers/`)
                    .then(res => res.data);
            }
        }
    }
});

// Mutations
const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addCustomer: {
            type: CustomerType,
            args: {
                name: {
                    type: new GraphQLNonNull(GraphQLString),
                },
                email: {
                    type: new GraphQLNonNull(GraphQLString),
                },
                age: {
                    type: new GraphQLNonNull(GraphQLInt),
                },
            },
            resolve(parentValue, args) {
                return axios.post(`http://localhost:3000/customers`, {
                    name: args.name,
                    email: args.email,
                    age: args.age
                })
                .then(res => res.data);
            }
        },
        deleteCustomer: {
            type: CustomerType,
            args: {
                id: {
                    type: new GraphQLNonNull(GraphQLString),
                }
            },
            resolve(parentValue, args) {
                return axios.delete(`http://localhost:3000/customers/${args.id}`)
                    .then(res => res.data);
            }
        },
        updateCustomer: {
            type: CustomerType,
            args: {
                id: {
                    type: new GraphQLNonNull(GraphQLString),
                },
                name: {
                    type: GraphQLString,
                },
                email: {
                    type: GraphQLString,
                },
                age: {
                    type: GraphQLInt,
                },
            },
            resolve(parentValue, args) {
                return axios.patch(`http://localhost:3000/customers/${args.id}`, args)
                    .then(res => res.data);
            }
        },
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation
});