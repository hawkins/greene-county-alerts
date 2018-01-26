import React from "react";
import { StyleSheet } from "react-native";
import {
  Header as NativeBaseHeader,
  Body,
  Title,
  Right,
  Icon
} from "native-base";
import { appColor } from "./theme";
import Refresh from "./Refresh";
import PropTypes from "prop-types";

const styles = StyleSheet.create({
  header: {
    width: "100%",
    backgroundColor: appColor
  }
});

class Header extends React.Component {
  static propTypes = {
    refetch: PropTypes.func.isRequired
  };

  refresh = async () => {
    await this.props.refetch();
  };

  render() {
    return (
      <NativeBaseHeader key="header" style={styles.header}>
        <Body>
          <Title>Greene County Alerts</Title>
        </Body>
        <Right>
          <Refresh refetch={this.refresh} />
        </Right>
      </NativeBaseHeader>
    );
  }
}

export default Header;
