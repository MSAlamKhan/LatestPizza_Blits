import React, {useState, useRef, useContext, useCallback} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  Alert,
  KeyboardAvoidingView,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import {Controller, useForm} from 'react-hook-form';
import Colors from '../constants/Colors';
import AuthButton from '../components/AuthButton';
import Input from '../components/Input';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {AuthContext} from '../context/Auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {APIURL} from '../constants/Url';
import RNPickerSelect from 'react-native-picker-select';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CommonButton from '../components/CommonButton';
import {useHandler} from 'react-native-reanimated';
import LottieView from 'lottie-react-native';
import Loader from '../components/Animatedfullscreen/Loader';
const RegisterForm = () => {
  const {setIsAuthenticated, setUserDetails, role, language} =
    useContext(AuthContext);
  const [isLoading, setLoading] = useState(false);

  const navigation = useNavigation();

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
    // alert('checking');
    var otp = Math.floor(1000 + Math.random() * 9000);

    // console.log(val);
    // navigation.navigate('otp');
    // const phoneNo = `${data.countryCode}${data.mobileNo}`;
    setLoading(true);
    try {
      const deviceToken = await AsyncStorage.getItem('deviceToken');

      let base_url = `${APIURL}/API/singupOTP.php`;
      let uploadData = new FormData();

      uploadData.append('phone', '+47' + data.phone);
      uploadData.append('email', data.email);

      uploadData.append('otp_code', otp);
      uploadData.append('role_id', role);

      uploadData.append(
        'token',
        'as23rlkjadsnlkcj23qkjnfsDKJcnzdfb3353ads54vd3favaeveavgbqaerbVEWDSC',
      );
      uploadData.append('notification_token', deviceToken);

      // eslint-disable-next-line no-undef
      const response = await fetch(base_url, {
        method: 'post',
        body: uploadData,
      });

      const responseData = await response.json();

      if (responseData.status === false) {
        alert(responseData.Message);

        setIsAuthenticated(false);
      } else {
        navigation.navigate('otp', {
          phone: data.phone,
          email: data.email,
          otpcode: otp,
          name: data.name,
          type: 'registration',
          refer: data.refer,
          password: data.password,
        });
      }

      return responseData;
    } catch (error) {
      alert(error.Message);
    } finally {
      setLoading(false);
    }
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      reset();
    }, []),
  );

  return isLoading ? (
    <Loader />
  ) : (
    // <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    // <KeyboardAvoidingView style={styles.screen}>
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={{flexGrow: 1, justifyContent: 'center'}}>
        <Text
          style={{
            fontFamily: 'Roboto-Medium',
            fontSize: 26,
            textAlign: 'center',
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
          <Text style={styles.loginin}>{language.signupForBest}</Text>
          <Text style={styles.enterPhone}>{language.enterYourDetails}</Text>

          <Input
            // type="special"
            name="name"
            style={styles.inputField}
            control={control}
            // keyboardType="numeric"
            rules={{
              required: language.nameIsRequired,
            }}
            // style={{marginTop: 20}}
            placeholder={language.fullName}
            textStyle={{color: '#000'}}
          />
          {errors.name && (
            <Text style={styles.errormessage}>{errors.name.message}</Text>
          )}
          <Input
            name="email"
            control={control}
            keyboardType="email-address"
            style={styles.inputField}
            rules={{
              required: language.emailAddressIsRequired,
              pattern: {
                value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                message: language.enterValidemailAddress,
              },
            }}
            // style={{marginTop: 20}}
            placeholder={language.emailAddress}
            textStyle={{color: '#000'}}
          />
          {errors.email && (
            <Text style={styles.errormessage}>{errors.email.message}</Text>
          )}

          <Input
            name="password"
            control={control}
            // keyboardType="email-address"
            style={styles.inputField}
            rules={{
              required: language.passowrdIsRequired,
              minLength: {
                value: 8,
                message: language.passwordTooShort,
              },
              maxLength: {
                value: 16,
                message: language.passwordMaximumLength,
              },
            }}
            secureTextEntry={true}
            // style={{marginTop: 20}}
            placeholder={language.password}
            textStyle={{color: '#000'}}
          />
          {errors.password && (
            <Text style={styles.errormessage}>{errors.password.message}</Text>
          )}
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={{fontFamily: 'Roboto-Regular', paddingRight: 5}}>
              +49
            </Text>
            <Input
              name="phone"
              control={control}
              keyboardType="numeric"
              rules={{
                required: language.phoneIsRequired,
                minLength: {
                  value: 7,
                  message: language.numberMustBe,
                },
              }}
              maxLength={10}
              style={[styles.inputField, {width: '90%'}]}
              placeholder={language.phone}
              textStyle={{color: '#000'}}
            />
          </View>
          {errors.phone && (
            <Text style={styles.errormessage}>{errors.phone.message}</Text>
          )}
        </View>

        <View>
          <Text style={styles.termandpolicy}>
            {language.ByContinuingYouAgreeToMrMarts}{' '}
            <Text
              onPress={() => navigation.navigate('terms')}
              style={{fontFamily: 'Roboto-Bold', fontSize: 12}}>
              {language.termsOfUse}
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
            title="Sign Up"
          />
          <Text style={styles.doesntText}>
            {language.alreadyHaveAnAccount}?{' '}
            <Text
              onPress={() => {
                navigation.navigate('login');
              }}
              style={styles.signupText}>
              {language.login}
            </Text>
          </Text>
        </View>
      </ScrollView>
    </View>
    // </KeyboardAvoidingView>
    // </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  activity: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.backgroundColor,
  },
  screen: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
    justifyContent: 'center',
    // paddingHorizontal: 15,
  },
  topcontainer: {
    marginTop: 30,
    // marginLeft: 40,

    width: '90%',
    alignSelf: 'center',
  },

  loginin: {
    fontFamily: 'Roboto-Medium',
    fontSize: 16,
  },
  inputField: {
    borderWidth: 1,
    paddingLeft: 5,
    backgroundColor: '#fff',
    paddingHorizontal: 5,
    paddingVertical: 5,
    borderRadius: 10,
    // marginTop: 10,
    marginVertical: 10,
  },

  inputText: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    fontSize: 14,
    fontFamily: 'OpenSans-Regular',
    color: Colors.grey,
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
    marginVertical: 5,
    paddingHorizontal: 10,
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
    fontSize: 14,
    fontFamily: 'Roboto-Bold',
  },
  errormessage: {
    color: 'red',
    fontSize: 12,
    alignSelf: 'center',
  },
});

export default RegisterForm;
