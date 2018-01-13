const app = require("express")();
const graphqlHTTP = require("express-graphql");
const { buildSchema } = require("graphql");
const request = require("request");
const { parseString } = require("xml2js");

const URL = "http://www.co.greene.oh.us/RSSFeed.aspx?ModID=63&CID=All-0";

/* Data */
let data;
const getAlerts = () => {
  request(URL, (err, res, body) => {
    parseString(body, { explicitArray: false }, (parseErr, json) => {
      data = json.rss.channel;
      console.log(
        "Updated data. There are currently " +
          data.item.length +
          " alerts in effect."
      );
    });
  });
};
setInterval(getAlerts, 900000); // Every 15 mins
getAlerts();

/* GraphQL */
const schema = buildSchema(`
type Item {
  pubDate: String
  title: String
  link: String
  description: String

}

type Query {
  alerts: [Item]
}
`);
const rootValue = { alerts: () => data.item };

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
