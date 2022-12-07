import {StyleSheet, Text, View, Image} from 'react-native';
import React, {useEffect} from 'react';
import Colors from '../constants/Colors';
import CommonButton from '../components/CommonButton';

import LottieView from 'lottie-react-native';
import RNRestart from 'react-native-restart';
const ThankYou = () => {
  // useEffect(
  //   () =>
  //     navigation.addListener('beforeRemove', e => {
  //       // Prevent default behavior of leaving the screen
  //       e.preventDefault();

  //       // Prompt the user before leaving the screen
  //     }),
  //   [navigation],
  // );
  return (
    <View style={styles.container}>
      {/* <Image
        style={{height: 200, width: 200}}
        source={{
          uri: 'https://i.pinimg.com/originals/91/36/df/9136df0949a40e6567c6f4f7a6343672.gif',
        }}
      /> */}
      {/* <FastImage
        style={styles.image}
        source={require('../assets/tick.gif')}
        resizeMode={FastImage.resizeMode.cover}
      /> */}
      <LottieView
        style={{width: 200, height: 200, alignSelf: 'center'}}
        source={{
          uri: 'https://assets10.lottiefiles.com/packages/lf20_yom6uvgj.json',
        }}
        autoPlay
        speed={1}
        // resizeMode="cover"
      />
      <Text style={styles.ThankText}>Thank You!</Text>
      <Text style={styles.yourOrderText}>
        Your order has placed successfully.
      </Text>
      <Text style={styles.youWillText}>
        you will be notified once order will dispatch.
      </Text>
      <View style={styles.buttonContainer}>
        <CommonButton
          onPress={() => RNRestart.Restart()}
          style={{marginBottom: 20}}
          title="Continue Shopping"
        />
        {/* <CommonButton onPress={() => alert('asad')} title="Back To Home" /> */}
      </View>
    </View>
  );
};

export default ThankYou;

const styles = StyleSheet.create({
  image: {
    width: 200,
    height: 200,
    backgroundColor: 'blue',
    resizeMode: 'cover',
  },
  container: {
    // justifyContent: 'center',
    paddingTop: 100,

    flex: 1,
    backgroundColor: Colors.primary,
    textAlign: 'center',
  },
  ThankText: {
    color: '#fff',
    fontSize: 32,
    marginVertical: 20,
    textAlign: 'center',
    fontFamily: 'Roboto-Bold',
  },
  yourOrderText: {
    color: '#fff',
    fontSize: 28,
    marginVertical: 15,
    textAlign: 'center',
    fontFamily: 'Roboto-Bold',
  },
  youWillText: {
    color: '#fff',
    fontSize: 15,
    paddingHorizontal: 60,
    textAlign: 'center',
    fontFamily: 'Roboto-Bold',
  },
  buttonContainer: {
    marginTop: 30,
  },
});
