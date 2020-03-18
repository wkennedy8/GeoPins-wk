const { ApolloServer } = require("apollo-server")
const typeDefs = require("./typeDefs")
const resolvers = require("./resolvers")
const mongoose = require("mongoose")
require("dotenv").config()
const { findOrCreateUser } = require("./controllers/userController")
mongoose
	.connect(process.env.MONGO_URI, { useNewUrlParser: true })
	.then(() => console.log("DB Connected"))
	.catch(err => console.error(err))

const server = new ApolloServer({
	typeDefs,
	resolvers,
	introspection: true,
    cors: {
      origin: "*",
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
      preflightContinue: false,
      optionsSuccessStatus: 204,
      credentials: true
    },
	context: async ({ req }) => {
		let authToken = null
		let currentUser = null
		try {
			authToken = req.headers.authorization
			if (authToken) {
				//find user in db or create user in db
				currentUser = await findOrCreateUser(authToken)
			}
		} catch (error) {
			console.error(`Unable to authenticate user with token ${authToken}`)
		}
		return { currentUser }
	}
})

server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
	console.log(`Server is listening on ${url}`)
})
