const app = require("express")();
const graphqlHTTP = require("express-graphql");
const { buildSchema } = require("graphql");
const request = require("request");
const { parseString } = require("xml2js");

const URL = "http://www.co.greene.oh.us/RSSFeed.aspx?ModID=63&CID=All-0";

/* Data */
let data;
const getAlerts = () => {
  try {
    request(URL, (err, res, body) => {
      if (err) throw err;

      parseString(body, { explicitArray: false }, (parseErr, json) => {
        if (parseErr) throw err;

        data = json.rss.channel;
        data.date = data.lastBuildDate;
        data.alerts = data.item ? data.item.slice() : [];
        delete data.item;

        console.log(
          "Updated data. There are currently " +
            data.alerts.length +
            " alerts in effect."
        );
      });
    });
  } catch (err) {
    console.error("Failed to register new alert data:");
    console.error(err);
  }
};
setInterval(getAlerts, 900000); // Every 15 mins
getAlerts();

/* GraphQL */
const schema = buildSchema(`
type Channel {
  title: String
  link: String
  date: String
  description: String
  language: String
  alerts: [Alert]
}

type Alert {
  pubDate: String
  title: String
  link: String
  description: String
}

type Query {
  alerts: [Alert]
  channel: Channel
}
`);
const rootValue = { channel: () => data, alerts: () => data.alerts };

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
