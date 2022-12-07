import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import LottieView from 'lottie-react-native';
import Colors from '../../constants/Colors';

const NoData = () => {
  return (
    <View style={styles.container}>
      <LottieView
        style={{width: 300, height: 300, alignSelf: 'center', flex: 1}}
        source={require('../../assets/LootiFile/NoData.json')}
        autoPlay
        speed={1}
        // resizeMode="cover"
      />
    </View>
  );
};

export default NoData;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
    justifyContent: 'center',
  },
});
