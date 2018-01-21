import React from "react";
import Expo from "expo";
import { Content, Container } from "native-base";

import ApolloWrapper from "./src/ApolloWrapper";
import { appColor } from "./src/theme";
import Header from "./src/Header";
import Alerts from "./src/Alerts";
import Footer from "./src/Footer";

export default class App extends React.Component {
  state = {
    ready: false,
    refetch: () => null
  };

  constructor() {
    super();

    this.setRefetch = this.setRefetch.bind(this);
    this.refetch = this.refetch.bind(this);
  }

  async componentWillMount() {
    await Expo.Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf")
    });
    this.setState({ ready: true });
  }

  setRefetch(refetch) {
    this.setState({ refetch });
  }

  refetch() {
    console.log("Refreshing...");
    this.state.refetch();
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.ready) return false;
    return true;
  }

  render() {
    if (!this.state.ready) {
      return <Expo.AppLoading />;
    }

    return (
      <ApolloWrapper>
        <Container>
          <Header refetch={this.refetch} />
          <Content padder>
            <Alerts setRefetch={this.setRefetch} />
            <Footer />
          </Content>
        </Container>
      </ApolloWrapper>
    );
  }
}
