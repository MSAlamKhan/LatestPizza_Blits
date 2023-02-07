import {StyleSheet, Text, View, ScrollView} from 'react-native';
import React, {useState, useContext} from 'react';
import CommonButton from '../components/CommonButton';
import Colors from '../constants/Colors';
import {AuthContext} from '../context/Auth';
import {APIURL} from '../constants/Url';
import Input from '../components/Input';
import {useForm} from 'react-hook-form';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '../components/Animatedfullscreen/Loader';
import LottieView from 'lottie-react-native';
import {color} from 'react-native-reanimated';

export default function AddPhoneNumber({navigation}) {
  // const [phoneNo, setPhoneNo] = useState('222222');
  // const {setIsSignin} = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const {language, role, setIsSignin, setUserDetails, setRecentlyView} =
    useContext(AuthContext);

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
    var otp = Math.floor(1000 + Math.random() * 9000);
    try {
      const deviceToken = await AsyncStorage.getItem('deviceToken');

      let base_url = `${APIURL}/API/login.php`;
      let uploadData = new FormData();

      uploadData.append('email', data.email);
      uploadData.append('password', data.pasword);
      uploadData.append('notification_token', deviceToken);
      // uploadData.append('role_id', role);
      uploadData.append(
        'token',
        'as23rlkjadsnlkcj23qkjnfsDKJcnzdfb3353ads54vd3favaeveavgbqaerbVEWDSC',
      );

      // eslint-disable-next-line no-undef
      const response = await fetch(base_url, {
        method: 'post',
        body: uploadData,
      });

      const responseData = await response.json();

      if (responseData.status === true) {
        const signUpUserDetails = responseData.data;
        const userDetail = JSON.stringify(signUpUserDetails);
        await AsyncStorage.setItem('userDetails', userDetail);
        setUserDetails(responseData.data);
        setIsSignin(true);
        setRecentlyView([]);
        alert(responseData.message);

        // setIsSignin(false);
      } else {
        alert(responseData.message);
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
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        backgroundColor: Colors.backgroundColor,
        // paddingTop: 35,
      }}>
      <ScrollView
        contentContainerStyle={{flexGrow: 1, justifyContent: 'center'}}>
        <Text
          style={{
            fontFamily: 'Roboto-Medium',
            fontSize: 26,
            textAlign: 'center',
            marginTop: 20,
          }}>
          {language.welcomeTo}
        </Text>
        <LottieView
          style={{
            // backgroundColor: 'pink',
            width: 200,
            height: 200,
            // backgroundColor: 'pink',
            alignSelf: 'center',
            justifyContent: 'center',
          }}
          source={require('../assets/LootiFile/pizza.json')}
          autoPlay
          speed={1}
          // resizeMode="cover"
        />
        <View style={styles.topcontainer}>
          <Text style={styles.loginin}>{language.signinForBestExperince} </Text>
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
          // style={{marginTop: 20}}
          placeholder="Email"
          textStyle={{color: '#000'}}
        />
        {errors.email && (
          <Text style={styles.errormessage}>{errors.email.message}</Text>
        )}

        <Input
          name="password"
          control={control}
          style={styles.inputField}
          rules={{
            required: 'password is required',
            minLength: {
              value: 7,
              message: ' Password too short min length is 7',
            },
            maxLength: {
              value: 16,
              message: 'Password maximum length is 16',
            },
          }}
          secureTextEntry={true}
          // style={{marginTop: 20}}
          placeholder="Password"
          textStyle={{color: '#000'}}
        />
        {errors.password && (
          <Text style={styles.errormessage}>{errors.password.message}</Text>
        )}

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
            title={language.signin}
          />
          <Text
            onPress={() => {
              navigation.navigate('ForgotPassowrdEmail');
            }}
            style={styles.forgotText}>
            {language.forgotPassword} ?
          </Text>
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
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'space-around',
    // backgroundColor: Colors.backgroundColor,
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
  forgotText: {
    alignSelf: 'center',
    fontSize: 15,
    fontFamily: 'Roboto-Light',
    marginVertical: 20,
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
