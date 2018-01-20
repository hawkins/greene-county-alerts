import React from "react";
import { StyleSheet, Linking } from "react-native";
import { ApolloProvider, graphql } from "react-apollo";
import { ApolloClient } from "apollo-client";
import { HttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import gql from "graphql-tag";
import Expo from "expo";
import {
  Header,
  Body,
  Title,
  Card,
  CardItem,
  Text,
  View,
  Content,
  Button,
  Container,
  Left,
  Icon
} from "native-base";

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

const appColor = "#e67e22";
const styles = StyleSheet.create({
  header: {
    width: "100%",
    backgroundColor: appColor
  },
  button: {
    backgroundColor: appColor,
    marginTop: 10
  },
  alertCenterLink: {
    color: "#fff"
  },
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
        <Text>Tap here to view in Alert Center</Text>
      </Button>
    </CardItem>
  </Card>
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
      </View>
    );
  }

  // DEBUG
  if (data.alerts.length === 0) {
    data.alerts = [
      {
        title: "Level Two Snow Emergency Alert Issued",
        pubDate: "Sat, 13 Jan 2018 10:58:58 -0500",
        description:
          "The Greene County Sheriff's Office has issued a Level Two Snow Emergency.",
        link: "http://www.co.greene.oh.us/AlertCenter.aspx?AID=8"
      },
      {
        title: "Emergency Snow Alert - Level 2",
        pubDate: "Friday, January 12 at 10:30 PM",
        description:
          "Roadways are hazardous with blowing and drifting snow. Only those who feel it is necessary to drive should be out on the roadways. Contact your employer to see if you should report to work. ",
        link: "http://www.co.greene.oh.us/AlertCenter.aspx?AID=8"
      },
      {
        title: "Emergency Snow Alert - Level 3",
        pubDate: "Friday, January 12 at 8:30 PM",
        description:
          "Roadways are hazardous with blowing and drifting snow. Only those who feel it is necessary to drive should be out on the roadways. Contact your employer to see if you should report to work. ",
        link: "http://www.co.greene.oh.us/AlertCenter.aspx?AID=8"
      }
    ];
  }

  return props.data.alerts.map(alert => (
    <Alert key={alert.title + alert.pubDate} alert={alert} />
  ));
});

export default class App extends React.Component {
  state = {
    ready: false
  };

  async componentWillMount() {
    await Expo.Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf")
    });
    this.setState({ ready: true });
  }

  render() {
    if (!this.state.ready) {
      return <Expo.AppLoading />;
    }

    return (
      <ApolloProvider client={client}>
        <Container>
          <Header key="header" style={styles.header}>
            <Body>
              <Title>Greene County Alerts</Title>
            </Body>
          </Header>
          <Content padder>
            <Alerts />
            <Button
              block
              style={styles.button}
              onPress={() =>
                Linking.openURL("http://www.co.greene.oh.us/AlertCenter.aspx")
              }
            >
              <Text style={styles.alertCenterLink}>
                Tap here to open the Alert Center website
              </Text>
            </Button>
          </Content>
        </Container>
      </ApolloProvider>
    );
  }
}
