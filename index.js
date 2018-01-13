const app = require("express")();
const graphqlHTTP = require("express-graphql");
const { buildSchema } = require("graphql");

const schema = buildSchema(`
type Query {
  hello: String
}
`);
const rootValue = { hello: () => "Hello world!" };

app.use(
  "/",
  graphqlHTTP({
    schema,
    rootValue,
    graphiql: true
  })
);

const port = process.env.NODE_ENV === "production" ? 80 : 3000;
app.listen(port, () => console.log("Listening on port " + port));
