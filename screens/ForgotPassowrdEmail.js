import {StyleSheet, Text, View, ScrollView} from 'react-native';
import React, {useState, useContext} from 'react';
import CommonButton from '../components/CommonButton';

import Colors from '../constants/Colors';
import {AuthContext} from '../context/Auth';

import {APIURL} from '../constants/Url';
import Toast from 'react-native-simple-toast';
import Input from '../components/Input';
import {useForm} from 'react-hook-form';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '../components/Animatedfullscreen/Loader';
import LottieView from 'lottie-react-native';
export default function AddPhoneNumber({navigation, route}) {
  // const [phoneNo, setPhoneNo] = useState('222222');
  // const {setIsSignin} = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const {language, role, setIsSignin, setUserDetails} = useContext(AuthContext);

  const [showEmail, setShowEmail] = useState(true);
  const [phoneNo, setFormattedValue] = useState('');

  const {
    control,
    handleSubmit,
    formState: {errors},
    register,
    reset,
  } = useForm({
    mode: 'all',
  });
  const onSubmit = async data => {
    setLoading(true);
    try {
      let base_url = `${APIURL}/API/verifyemail.php`;
      let uploadData = new FormData();

      uploadData.append('email', data.email);
      uploadData.append(
        'token',
        'as23rlkjadsnlkcj23qkjnfsDKJcnzdfb3353ads54vd3favaeveavgbqaerbVEWDSC',
      );

      const response = await fetch(base_url, {
        method: 'post',
        body: uploadData,
      });

      const responseData = await response.json();

      if (responseData.status === true) {
        // const signUpUserDetails = responseData.data;
        // const userDetail = JSON.stringify(signUpUserDetails);
        // await AsyncStorage.setItem('userDetails', userDetail);
        // setUserDetails(responseData.data);
        // setIsSignin(true);
        navigation.navigate('NewPassword', {
          OTP: responseData.data.OTP,
          email: data.email,
        });
        Toast.show(responseData.message, Toast.LONG);

        // setIsSignin(false);
      } else {
        Toast.show(responseData.message, Toast.LONG);
      }

      return responseData;
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
    setLoading(false);
  };
  return loading ? (
    <Loader />
  ) : (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{flex: 1, justifyContent: 'center'}}>
      <View>
        <Text
          style={{
            fontFamily: 'Roboto-Medium',
            fontSize: 26,
            textAlign: 'center',
            marginTop: 20,
          }}>
          Welcome to Pizza Blitz
        </Text>
        <LottieView
          style={{
            width: 200,
            height: 200,
            alignSelf: 'center',
            justifyContent: 'center',
          }}
          source={require('../assets/LootiFile/pizza.json')}
          autoPlay
          speed={1}
        />
        <View style={styles.topcontainer}>
          <Text style={styles.enterPhone}>
            {language.enterYourEmailToContinue}
          </Text>
        </View>
        <Input
          name="email"
          control={control}
          keyboardType="email-address"
          style={styles.inputField}
          rules={{
            required: 'email is required',
            pattern: {
              value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
              message: 'Enter a valid email',
            },
          }}
          placeholder="Email"
          textStyle={{color: '#000'}}
        />
        {errors.email && (
          <Text style={styles.errormessage}>{errors.email.message}</Text>
        )}

        {/* <Text
          style={styles.useEmailPhone}
          onPress={() => {
            // setShowEmail(false);
            navigation.navigate('loginPhone');
          }}>
          {language.usePhone}
        </Text> */}
      </View>
      <View style={{marginTop: 50}}>
        <Text style={styles.termandpolicy}>
          {language.ByContinuingYouAgreeToMrMarts}{' '}
          <Text
            onPress={() => navigation.navigate('terms')}
            style={{fontFamily: 'Roboto-Bold', fontSize: 12}}>
            {language.TermsOfUse}
          </Text>{' '}
          {language.and}{' '}
          <Text
            onPress={() => navigation.navigate('privacy')}
            style={{fontFamily: 'Roboto-Bold', fontSize: 12}}>
            {language.privacyPolicy}
          </Text>
        </Text>
        <CommonButton
          style={{marginTop: 10}}
          onPress={handleSubmit(onSubmit)}
          title="Continue"
        />
        {/* 
        <Text style={styles.doesntText}>
          {language.doesntHaveanAccount}
          <Text
            onPress={() => {
              navigation.navigate('registration');
            }}
            style={styles.signupText}>
            {' '}
            {language.signup}
          </Text>
        </Text> */}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // justifyContent: 'space-around',
    backgroundColor: Colors.backgroundColor,
  },
  topcontainer: {
    marginTop: 20,
    // marginLeft: 40,

    width: '80%',
    alignSelf: 'center',
  },
  inputField: {
    borderWidth: 1,
    paddingLeft: 5,
    backgroundColor: '#fff',
    paddingHorizontal: 5,
    paddingVertical: 5,
    borderRadius: 10,
    // marginTop: 10,
    alignSelf: 'center',

    width: '80%',
    marginVertical: 10,
  },

  loginin: {
    fontFamily: 'Roboto-Medium',
    fontSize: 16,
  },
  enterPhone: {
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
  },
  useEmailPhone: {
    textAlign: 'right',

    width: '80%',
    alignSelf: 'center',
  },
  termandpolicy: {
    alignSelf: 'center',
    fontSize: 11,
    fontFamily: 'Roboto-Light',
  },
  doesntText: {
    alignSelf: 'center',
    fontSize: 12,
    fontFamily: 'Roboto-Light',
  },
  signupText: {
    fontSize: 15,
    fontFamily: 'Roboto-Bold',
  },
  errormessage: {
    color: 'red',
    fontSize: 15,
    alignSelf: 'center',
  },
});
