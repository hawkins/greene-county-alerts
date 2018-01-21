import React from "react";
import { StyleSheet } from "react-native";
import { Header as NativeBaseHeader, Body, Title } from "native-base";
import { appColor } from "./theme";

const styles = StyleSheet.create({
  header: {
    width: "100%",
    backgroundColor: appColor
  }
});

const Header = () => (
  <NativeBaseHeader key="header" style={styles.header}>
    <Body>
      <Title>Greene County Alerts</Title>
    </Body>
  </NativeBaseHeader>
);

export default Header;
