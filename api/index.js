const app = require('express')();
const graphqlHTTP = require('express-graphql');
const {buildSchema} = require('graphql');
const request = require('request');
const {parseString} = require('xml2js');

const URLS = {
  Greene: 'http://www.co.greene.oh.us/RSSFeed.aspx?ModID=63&CID=All-0',
  Montgomery: 'https://www.daytonohio.gov/RSSFeed.aspx?ModID=63&CID=All-0',
};

/* Data */
let data;
const getAlerts = () => {
  // Reset data
  data = {};

  // Aggregate county data
  Object.keys(URLS).map(county => {
    try {
      request(URLS[county], (err, res, body) => {
        if (err) throw err;

        parseString(body, {explicitArray: false}, (parserErr, json) => {
          if (parserErr) throw err;

          data[county] = json.rss.channel;
          data[county].date = data[county].lastBuildDate;
          if (data[county].item !== undefined) {
            if (typeof data[county].item === 'object')
              data[county].alerts = [data[county].item];
            else if (typeof data[county].item === 'array')
              data[county].alerts = data[county].item.slice();
          }
          if (data[county].alerts === undefined) data[county].alerts = [];
          delete data[county].item;

          console.log(
            `Updated data for ${county} county. There are currently ${
              data[county].alerts.length
            } alerts in effect.`,
          );
        });
      });
    } catch (err) {
      console.error(`Failed to register new alert data for ${county} county:`);
      console.error(err);
    }
  });
};
setInterval(getAlerts, 900000); // Every 15 mins
getAlerts();

/* GraphQL */
const schema = buildSchema(`
  type Channel{
    title : String
    link : String
    date : String
    description : String
    language : String
    alerts : [Alert]
  }

  type Alert{
    pubDate : String
    title : String
    link : String
    description : String
  }

  type Query {
    alerts(county: String): [Alert]
    channel(county: String) : Channel
  }
`);
const rootValue = {
  channel: ({county}) => data[county],
  alerts: ({county}) => {
    // TODO: Proper error?
    if (county !== undefined && data[county] === undefined) return [];

    if (county !== undefined) return data[county].alerts;

    return [].concat.apply(
      [],
      Object.keys(data).map(county => data[county].alerts),
    );
  },
};

app.use('/', graphqlHTTP({schema, rootValue, graphiql: true}));

const port = process.env.NODE_ENV === 'production' ? 80 : 3000;
app.listen(port, () => console.log('Listening on port ' + port));
