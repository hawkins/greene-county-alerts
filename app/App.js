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
      <ApolloWrapper>
        <Container>
          <Header />
          <Content padder>
            <Alerts />
            <Footer />
          </Content>
        </Container>
      </ApolloWrapper>
    );
  }
}
