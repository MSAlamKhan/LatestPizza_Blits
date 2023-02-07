import React, {useState, useEffect, useContext, useCallback} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {useForm} from 'react-hook-form';
import Colors from '../constants/Colors';
import AuthButton from '../components/AuthButton';
import Input from '../components/Input';
import {AuthContext} from '../context/Auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {APIURL} from '../constants/Url';
import CommonButton from '../components/CommonButton';
import LottieView from 'lottie-react-native';
import Loader from '../components/Animatedfullscreen/Loader';
// import Input from '../components/Input';

const OTPScreen = ({route, navigation}) => {
  const {setIsSignin, setUserDetails, role, language} = useContext(AuthContext);
  const [isLoading, setLoading] = useState(false);
  // const [OTP, setOTP] = useState();
  const {email, phone, otpcode, name, type, response, refer, password} =
    route.params;

  // phone: data.phone,
  // email: data.email,
  // otpcode: otp,

  const registerData = route.params;

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    mode: 'all',
  });
  console.log(otpcode);
  // const pinCode = register('mobileNo');
  const ForgotPassword = async data => {
    setLoading(true);
    if (otpcode == data.otp) {
      const UserDetails = JSON.stringify(response);
      AsyncStorage.setItem('userDetails', UserDetails);
      setUserDetails(response);
      {
        role === 2 ? navigation.navigate('riderprofile') : setLoading(false);
        // navigation.navigate('profile');
        setIsSignin(true);
        setLoading(false);
      }
      // navigation.navigate('profile');
      setIsSignin(true);
    } else {
      alert('Otp doesnt match');
    }
    setLoading(false);
  };
  console.log(otpcode);
  const onSubmit = async data => {
    setLoading(true);

    if (otpcode == data.otp) {
      // const phoneNo = `${registerData.countryCode}${registerData.mobileNo}`;
      const deviceToken = await AsyncStorage.getItem('deviceToken');
      try {
        let base_url = `${APIURL}/API/register.php`;
        let uploadData = new FormData();

        uploadData.append('name', name);
        // uploadData.append('phone', phone);
        uploadData.append('phone', '+91' + phone);
        uploadData.append('email', email);
        uploadData.append('role_id', '3');
        uploadData.append('password', password);
        refer && uploadData.append('user_referal', refer);

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

        if (responseData.status == true) {
          const signUpUserDetails = responseData.Data;
          // const UserDetails = JSON.stringify(signUpUserDetails);
          // AsyncStorage.setItem('userDetails=', signUpUserDetails);
          // console.log('UserDetails=>>>>>>', UserDetails);
          const userDetail = JSON.stringify(signUpUserDetails);
          await AsyncStorage.setItem('userDetails', userDetail);
          setUserDetails(responseData.Data);
          setIsSignin(true);
          alert(responseData.Message);
          setIsSignin(true);
          // navigation.navigate('dashBoard');
        } else {
          alert(responseData.Message);
        }
      } catch (error) {
        Alert.alert(error.message);
        setLoading(false);
      }
    } else {
      alert('Invalid OTP');
    }
    setLoading(false);
  };

  // const getOTP = useCallback(async () => {
  //   const phoneNo = `${registerData.countryCode}${registerData.mobileNo}`;

  //   try {
  //     let base_url = `${APIURL}/API/generateOTP.php`;

  //     let uploadData = new FormData();

  //     uploadData.append('token', 'ASDEGFAERGBEBDFV66_2654641321sdvzdfv!@');
  //     uploadData.append('phone', phoneNo);

  //     // eslint-disable-next-line no-undef
  //     const response = await fetch(base_url, {
  //       method: 'post',
  //       body: uploadData,
  //     });

  //     const responseData = await response.json();
  //     console.log(responseData.OTP);
  //     if (responseData.code != 200) {
  //       throw new Error(responseData.Message);
  //     } else {
  //       setOTP(responseData.OTP);
  //     }
  //   } catch (error) {
  //     Alert.alert(error.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // }, []);

  // useEffect(() => {
  //   getOTP();
  // }, []);

  return isLoading ? (
    <Loader />
  ) : (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.screen}>
        <LottieView
          style={{width: 200, height: 200, alignSelf: 'center'}}
          source={require('./otp.json')}
          autoPlay
          speed={1.5}
          // resizeMode="cover"
        />

        <View style={styles.fieldContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.fieldText}>
              {language.pleaseEnterFourDigitsCode}:{otpcode}
            </Text>

            <Input
              style={styles.inputField}
              control={control}
              name="otp"
              rules={{required: true, minLength: 4, maxLength: 4}}
              keyboardType={'number-pad'}
              blurOnSubmit={false}
              returnKeyType="next"
              maxLength={4}
            />
          </View>
        </View>
        {type === 'registration' ? (
          <CommonButton
            onPress={handleSubmit(onSubmit)}
            style={styles.button}
            title="Verify OTP"
          />
        ) : (
          <CommonButton
            // onPress={handleSubmit(LoginSubmit)}
            style={styles.button}
            title="Sign In"
          />
        )}

        {/* <AuthButton
          onPress={handleSubmit(onSubmit)}
          style={styles.registerButton}>
          Send
        </AuthButton> */}
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
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
    paddingHorizontal: 15,
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
  logo: {
    marginTop: 40,
    width: '50%',
    height: 120,
    alignSelf: 'center',
  },

  fieldContainer: {},
  inputContainer: {
    marginTop: 20,
  },
  fieldText: {
    fontSize: 18,
    fontFamily: 'OpenSans-Regular',
    marginVertical: 10,
    alignSelf: 'center',
  },
  fieldArea: {
    borderWidth: 1,
    borderColor: Colors.grey,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  redBorder: {
    borderColor: Colors.accent,
  },
  button: {
    marginTop: 20,
    // backgroundColor: Colors.accent,
  },
  resendContainer: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  resendTitle: {
    fontSize: 16,
    fontFamily: 'OpenSans-Regular',
    color: Colors.grey,
  },
  resendText: {
    fontSize: 16,
    fontFamily: 'OpenSans-Regular',
    color: Colors.accent,
  },
});

export default OTPScreen;
