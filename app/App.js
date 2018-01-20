import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { ApolloProvider, graphql } from "react-apollo";
import { ApolloClient } from "apollo-client";
import { HttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import gql from "graphql-tag";

const client = new ApolloClient({
  link: new HttpLink({ uri: "https://greene-co-alerts.now.sh" }),
  cache: new InMemoryCache()
});

const alertsQuery = gql`
  query {
    alerts {
      pubDate
      title
      link
      description
    }
  }
`;
const channelQuery = gql`
  query {
    channel {
      title
      link
      date
      description
    }
  }
`;

const Alert = ({ alert }) => (
  <View>
    <Text>{alert.title}</Text>
    <Text>Posted on {alert.pubDate}</Text>
    <Text>{alert.description}</Text>
    <Text>Read more: {alert.link}</Text>
  </View>
);

const Channel = ({ channel }) => (
  <View>
    <Text>{channel.title}</Text>
    <Text>Last updated on {channel.date}</Text>
    <Text>{channel.description}</Text>
    <Text>{channel.link}</Text>
  </View>
);

const Alerts = graphql(alertsQuery)(props => {
  const { data } = props;

  if (data.loading) {
    return (
      <View>
        <Text>Loading alerts...</Text>
      </View>
    );
  }

  if (data.error) {
    data.refetch();
    return (
      <View>
        <Text>{data.error}</Text>
      </View>
    );
  }

  // DEBUG
  if (data.alerts.length === 0) {
    data.alerts = [
      {
        title: "Test 1",
        pubDate: "A time",
        description:
          "Long descriptionnnnnnnnnnnnnn nnnnnnnnnn nnnnnnnnnnnn ffffffffff ggggggggg hhhhh",
        link: "https://josh.hawkins.is"
      },
      {
        title: "Test 2",
        pubDate: "A time",
        description:
          "Long descriptionnnnnnnnnnnnnn nnnnnnnnnn nnnnnnnnnnnn ffffffffff ggggggggg hhhhh",
        link: "https://josh.hawkins.is"
      }
    ];
  }

  return props.data.alerts.map(alert => (
    <Alert key={alert.title + alert.pubDate} alert={alert} />
  ));
});
const ChannelInfo = graphql(channelQuery)(props => {
  const { data } = props;

  if (data.loading) {
    return (
      <Channel
        channel={{
          title: "Greene County, OH - Alert Center",
          link: "http://www.co.greene.oh.us/AlertCenter.aspx",
          date: "Sat, 20 Jan 2018 15:36:19 -0500",
          description: "Greene County, OH - Get the latest alerts"
        }}
      />
    );
  }

  if (data.error) {
    data.refetch();
    return (
      <View>
        <Text>{data.error}</Text>
      </View>
    );
  }

  return <Channel channel={props.data.channel} />;
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});

export default class App extends React.Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <View style={styles.container}>
          <ChannelInfo />
          <Alerts />
        </View>
      </ApolloProvider>
    );
  }
}
