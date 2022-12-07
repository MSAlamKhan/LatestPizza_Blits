import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';

const AuthButton = props => {
  return (
    <TouchableOpacity
      activeOpacity={0.6}
      style={{...styles.buttonView, ...props.style}}
      onPress={props.onPress}
      disabled={props.disabled}>
      <Text style={styles.buttonText}>{props.children}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonView: {
    width: '90%',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    padding: 15,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '800',
    fontFamily: 'OpenSans-Regular',
  },
});

export default AuthButton;
