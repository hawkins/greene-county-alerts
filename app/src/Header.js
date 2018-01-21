import React from "react";
import { StyleSheet } from "react-native";
import {
  Header as NativeBaseHeader,
  Body,
  Title,
  Right,
  Button,
  Icon
} from "native-base";
import { appColor } from "./theme";

const styles = StyleSheet.create({
  header: {
    width: "100%",
    backgroundColor: appColor
  }
});

const Header = ({ refetch }) => (
  <NativeBaseHeader key="header" style={styles.header}>
    <Body>
      <Title>Greene County Alerts</Title>
    </Body>
    <Right>
      <Button iconLeft transparent dark onPress={refetch}>
        <Icon name="refresh" />
      </Button>
    </Right>
  </NativeBaseHeader>
);

export default Header;
