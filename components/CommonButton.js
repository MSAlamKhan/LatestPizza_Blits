import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React from 'react';
import Colors from '../constants/Colors';
import LinearGradient from 'react-native-linear-gradient';

import {AutoSizeText, ResizeTextMode} from 'react-native-auto-size-text';
export default function CommonButton(props) {
  return (
    <TouchableOpacity onPress={props.onPress}>
      <LinearGradient
        colors={[Colors.buttongrad1, Colors.buttongrad2]}
        start={{x: 0, y: 0}}
        end={{x: 0, y: 1}}
        style={[styles.commonButton, props.style]}>
        {/* <LinearGradient
          colors={['#f6cf64', '#f3c23d']}
          start={{x: 0, y: 0}}
          end={{x: 0, y: 1}}
          style={styles.buttonline}>
          <View></View>
        </LinearGradient>
        <View style={styles.buttonline}></View> */}
        <AutoSizeText
          style={[styles.buttontext, props.textStyle]}
          fontSize={16}
          numberOfLines={1}
          mode={ResizeTextMode.max_lines}>
          {props.title}
        </AutoSizeText>
        {/* <Text style={[styles.buttontext, props.textStyle]}>{props.title}</Text> */}
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  commonButton: {
    // backgroundColor: Colors.primary,
    // paddingHorizontal: 5,
    alignSelf: 'center',
    width: '80%',
    height: 45,
    // paddingVertical: 10,
    justifyContent: 'center',
    borderRadius: 30,
    borderWidth: 2,
    borderColor: 'white',
    alignItems: 'center',
    marginBottom: 10,
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
