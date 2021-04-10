require('dotenv').config()
const express = require('express')
const { graphqlHTTP } = require('express-graphql')
const mongoose = require('mongoose')

const { MONGO_URL, MONGO_DB_NAME } = require('./config')
const graphQlResolvers = require('./graphql/resolvers')
const graphQlSchema = require('./graphql/schema')


const app = express()
// app.use(express.json())

app.use('/graphql', graphqlHTTP({
    schema: graphQlSchema,
    rootValue: graphQlResolvers,
    graphiql: true
}))


mongoose.connect(
    `${MONGO_URL}/${MONGO_DB_NAME}`,
    { useNewUrlParser: true, useUnifiedTopology: true}
  ).then(() => {
    // eslint-disable-next-line no-console
    console.log('MongoDB connection Successful')
  }).catch(err => {
    // eslint-disable-next-line no-console
    console.log('MongoDB connection error: ',err)
  })

app.listen(4000)
