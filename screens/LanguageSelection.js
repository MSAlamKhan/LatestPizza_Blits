import {StyleSheet, Text, View} from 'react-native';
import React, {useContext} from 'react';
import CommonButton from '../components/CommonButton';
import LottieView from 'lottie-react-native';
import {AuthContext} from '../context/Auth';
import {english, german} from '../constants/Language';
import AsyncStorage from '@react-native-async-storage/async-storage';
const LanguageSelection = ({navigation}) => {
  // const {account} = route.params;
  const {language, setLanguage} = useContext(AuthContext);
  const germanSelection = () => {
    navigation.navigate('userBottom');
    AsyncStorage.setItem('language', 'german');
    setLanguage(german);
  };
  const englishSelection = () => {
    navigation.navigate('userBottom');
    AsyncStorage.setItem('language', 'english');
    setLanguage(english);
  };
  return (
    <View style={styles.container}>
      <LottieView
        style={{width: 200, height: 200, alignSelf: 'center'}}
        source={require('../assets/LootiFile/pizza1.json')}
        autoPlay
        speed={1}
        // resizeMode="cover"
      />
      {/* <LottieView
        style={{width: 200, height: 200, alignSelf: 'center'}}
        source={require('../assets/LootiFile/Loader.json')}
        autoPlay
        speed={1}
        // resizeMode="cover"
      /> */}
      <Text
        style={{textAlign: 'center', fontFamily: 'Roboto-Bold', fontSize: 18}}>
        Chose your Language
      </Text>
      <CommonButton
        onPress={() => englishSelection()}
        style={{marginTop: 20, marginBottom: 10}}
        title="English"
      />
      <CommonButton onPress={() => germanSelection()} title="deutsch" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    // alignItems: 'center',
  },
});
export default LanguageSelection;
