import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import LottieView from 'lottie-react-native';
import Colors from '../../constants/Colors';

const CashLoader = () => {
  return (
    <View style={styles.container}>
      <LottieView
        style={{width: 300, height: 300, alignSelf: 'center'}}
        source={require('../../assets/LootiFile/cash.json')}
        autoPlay
        speed={1}
      />
    </View>
  );
};

export default CashLoader;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
    justifyContent: 'center',
  },
});
