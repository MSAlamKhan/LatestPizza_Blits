import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React from 'react';
import Entypo from 'react-native-vector-icons/Entypo';
import LinearGradient from 'react-native-linear-gradient';
const PaypalButton = props => {
  return (
    <TouchableOpacity onPress={props.onPress}>
      <LinearGradient
        colors={['#222D65', '#169BD7']}
        start={{x: 0, y: 1}}
        end={{x: 1, y: 0}}
        style={[styles.commonButton, props.style]}>
        {/* <LinearGradient
        colors={['#f6cf64', '#f3c23d']}
        start={{x: 0, y: 0}}
        end={{x: 0, y: 1}}
        style={styles.buttonline}>
        <View></View>
      </LinearGradient>
      <View style={styles.buttonline}></View> */}

        <Entypo
          style={{position: 'absolute', top: '45%', left: 10}}
          name="paypal"
          size={20}
          color="white"
        />

        <Text style={[styles.buttontext, props.textStyle]}>{props.title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default PaypalButton;

const styles = StyleSheet.create({
  commonButton: {
    // backgroundColor: Colors.primary,
    // paddingHorizontal: 5,
    // flexDirection: 'row',
    alignSelf: 'center',
    width: '80%',
    paddingVertical: 10,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: 'white',
    alignItems: 'center',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,

    elevation: 6,
  },
  buttonline: {
    height: 7,
    borderRadius: 20,
    width: '90%',
    marginBottom: -4,
  },
  buttontext: {
    color: '#fff',
    fontSize: 15,
  },
});
