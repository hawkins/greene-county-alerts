import React from "react";
import { StyleSheet, Linking } from "react-native";
import { Text, Button, Content, Container } from "native-base";

import { appColor } from "./theme";

const styles = StyleSheet.create({
  button: {
    backgroundColor: appColor,
    marginTop: 10
  },
  alertCenterLink: {
    color: "#fff"
  }
});

const Footer = () => (
  <Button
    block
    style={styles.button}
    onPress={() =>
      Linking.openURL("http://www.co.greene.oh.us/AlertCenter.aspx")}
  >
    <Text style={styles.alertCenterLink}>Open the Alert Center website</Text>
  </Button>
);

export default Footer;
