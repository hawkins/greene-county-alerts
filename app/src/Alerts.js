import React from "react";
import { StyleSheet, Linking } from "react-native";
import gql from "graphql-tag";
import { graphql } from "react-apollo";
import { Body, Card, CardItem, Text, View, Button, Icon } from "native-base";

import { appColor } from "./theme";

const styles = StyleSheet.create({
  meta: {
    color: "#7f8c8d"
  },
  alert: {
    paddingTop: 10
  },
  cardTitle: {
    color: "#000",
    fontWeight: "bold"
  }
});

const Alert = ({ alert }) => (
  <Card style={styles.alert}>
    <CardItem header>
      <Icon name="alert" />
      <Text style={styles.cardTitle}>{alert.title}</Text>
    </CardItem>
    <CardItem>
      <Text style={styles.meta}>Posted on {alert.pubDate}</Text>
    </CardItem>
    <CardItem>
      <Body>
        <Text>{alert.description}</Text>
      </Body>
    </CardItem>
    <CardItem footer>
      <Button transparent info onPress={() => Linking.openURL(alert.link)}>
        <Text>View in Alert Center</Text>
      </Button>
    </CardItem>
  </Card>
);

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

const RefreshButton = ({ refetch }) => (
  <Button transparent info onPress={() => refetch()}>
    <Text>Refresh</Text>
  </Button>
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
        <Text>{data.error.message}</Text>
        <RefreshButton refetch={data.refetch} />
      </View>
    );
  }

  if (props.data.alerts.length === 0) {
    return (
      <View>
        <Card>
          <CardItem header>
            <Icon name="partly-sunny" />
            <Text style={styles.cardTitle}>No alerts active at this time</Text>
          </CardItem>
          <CardItem>
            <Body>
              <Text>
                There are currently no alerts placed for Greene County. If
                you're concerned about anything, it's best to contact the local
                authorities and double check just to be safe.
              </Text>
            </Body>
          </CardItem>
          <CardItem footer>
            <Button
              transparent
              info
              onPress={() =>
                Linking.openURL("https://www.co.greene.oh.us/directory.aspx")}
            >
              <Text>Contact county services</Text>
            </Button>
          </CardItem>
        </Card>
        <RefreshButton refetch={data.refetch} />
      </View>
    );
  }

  return props.data.alerts
    .map(alert => <Alert key={alert.title + alert.pubDate} alert={alert} />)
    .append(<RefreshButton key="refresh" refetch={data.refetch} />);
});

export default Alerts;
