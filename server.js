const express = require('express');
const expressGraphQL = require('express-graphql');
const schema = require('./schema');
const app = express();
const port = process.env.PORT || 3000;

app.use('/graphql', expressGraphQL({
    schema: schema,
    graphiql: true
}));

// app.get('/', (req, res) => {
//     res.sendStatus(200);
// });

app.listen(port, () => {
    console.log(`Server running at port ${port}`);
});

