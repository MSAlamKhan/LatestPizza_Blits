import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import LottieView from 'lottie-react-native';
import Colors from '../../constants/Colors';

const Loader = () => {
  return (
    <View style={styles.container}>
      <LottieView
        style={{width: 300, height: 300, alignSelf: 'center'}}
        source={require('../../assets/LootiFile/Loader.json')}
        autoPlay
        speed={1}
      />
    </View>
  );
};

export default Loader;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
    justifyContent: 'center',
  },
});
