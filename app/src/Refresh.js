import React, { Component } from "react";
import { Animated, AppRegistry } from "react-native";
import { Button, Icon } from "native-base";
import PropTypes from "prop-types";

const AnimatedIcon = Animated.createAnimatedComponent(Icon);

class Refresh extends React.Component {
  static propTypes = {
    refetch: PropTypes.func.isRequired
  };

  state = {
    spinValue: new Animated.Value(0)
  };

  spin = () => {
    this.state.spinValue.setValue(0);

    Animated.timing(this.state.spinValue, {
      toValue: 1,
      duration: 2000
    }).start();
  };

  refresh = async () => {
    console.log("Refreshing...");
    this.spin();

    await this.props.refetch();

    console.log("Done!");
  };

  render() {
    return (
      <Button iconLeft transparent dark onPress={this.refresh}>
        <AnimatedIcon
          name="refresh"
          style={{
            transform: [
              {
                rotate: this.state.spinValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: ["0deg", "360deg"]
                })
              },
              { perspective: 1000 }
            ]
          }}
        />
      </Button>
    );
  }
}

export default Refresh;
