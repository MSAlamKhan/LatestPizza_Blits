import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  PermissionsAndroid,
  Linking,
} from 'react-native';
import React, {useContext, useState, useRef} from 'react';
import Colors from '../constants/Colors';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {APIURL} from '../constants/Url';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {useForm} from 'react-hook-form';
import Input from '../components/Input';
import {ScrollView} from 'react-native-gesture-handler';
import {AuthContext} from './../context/Auth';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {accessCamera, accessGallery} from '../utils/Imagepicker';
import {ImagePickerModal} from '../components/modals/ImagePickerModal';
import {getPixelSizeForLayoutSize} from 'react-native/Libraries/Utilities/PixelRatio';
import Loader from '../components/Animatedfullscreen/Loader';

//askdasmndklas
const EditProfile = () => {
  // const {userDetails} = useContext(AuthContext);
  const navigation = useNavigation();
  const [details, setdetails] = useState();

  const {
    setIsAuthenticated,
    setUserDetails,
    userDetails,
    setIsSignin,
    language,
  } = useContext(AuthContext);

  const photo = useRef();
  const [loading, setLoading] = useState(getPixelSizeForLayoutSize);
  const phonenoRef = useRef();
  const [visible, setVisible] = useState(false);
  const {
    control,
    register,
    handleSubmit,
    setValue,

    formState: {errors, isValid},
  } = useForm({
    mode: 'all',
    defaultValues: {
      name: userDetails?.name,
      email: userDetails?.email,
      phone: userDetails?.phone.substring(3),
    },
  });

  const getUserDetail = async () => {
    try {
      let base_url = `${APIURL}/API/getUserDetails.php`;

      let form = new FormData();

      form.append(
        'token',
        'as23rlkjadsnlkcj23qkjnfsDKJcnzdfb3353ads54vd3favaeveavgbqaerbVEWDSC',
      );

      form.append('user_id', userDetails.user_id);

      // eslint-disable-next-line no-undef
      const response = await fetch(base_url, {
        method: 'post',
        body: form,
      });

      const responseData = await response.json();

      if (responseData.status == true) {
        const signUpUserDetails = responseData.Data;
        const userDetail = JSON.stringify(signUpUserDetails);
        await AsyncStorage.setItem('userDetails', userDetail);
        setUserDetails(signUpUserDetails);
        // setIsSignin(true);
      } else {
        alert('error');
      }
    } catch (error) {
      alert('error:', error);
    }
    setLoading(false);
  };
  register('photo');
  const onSubmit = async data => {
    setLoading(true);
    try {
      let base_url = `${APIURL}/API/editprofile.php`;
      let uploadData = new FormData();

      uploadData.append('name', data.name);
      uploadData.append('phone', '+47' + data.phone);
      uploadData.append('email', data.email);
      uploadData.append('user_id', userDetails?.user_id);
      uploadData.append(
        'token',
        'as23rlkjadsnlkcj23qkjnfsDKJcnzdfb3353ads54vd3favaeveavgbqaerbVEWDSC',
      );
      data.photo !== undefined &&
        uploadData.append('avatar', {
          name: data.photo.fileName,
          uri: data.photo.uri,
          type: data.photo.type,
        });
      const response = await fetch(base_url, {
        method: 'post',
        body: uploadData,
      });
      const responseData = await response.json();
      // console.log('response', responseData);
      if (responseData.status === true) {
        await getUserDetail();
        // alert(responseData.message);
        alert(`${responseData.message}`);
        userDetails.role_id == 2
          ? navigation.navigate('riderprofile')
          : navigation.navigate('profile');
      } else {
        alert(`${responseData.message}`);
        setLoading(false);
      }
    } catch (error) {
      alert(error.message);
      setLoading(false);
    }
  };
  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Pizza Blitz App Camera Permission',
          message:
            'Pizza Blitz needs access to your camera ' +
            'so you can take awesome pictures.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the camera');
      } else {
        alert(
          'Camera Permission isnt Given go to setting to acccess camera permission'
  
        );
        setTimeout(() => {
          //your code to be executed after 1 second
          Linking.openSettings();
        }, 1000);
      }
    } catch (err) {
      console.warn(err);
    }
  };
  const openCamera = async () => {
    // setVisible(true);
    await requestCameraPermission();
    accessCamera().then(response => {
      photo.current = response.assets ? response.assets[0] : undefined;
      setValue('photo', photo.current);
      setVisible(false);
    });
  };
  const openGallery = () => {
    setVisible(true);
    accessGallery().then(response => {
      photo.current = response.assets ? response.assets[0] : undefined;
      setValue('photo', photo.current);
      setVisible(false);
    });
  };
  return loading ? (
    <Loader />
  ) : (
    <View style={styles.container}>
      <View style={styles.upperLayout}>
        <Text style={styles.myAccount}>{language.editProfile}</Text>
        <View>
          <TouchableOpacity
            onPress={() => setVisible(true)}
            style={{width: 120, alignSelf: 'center'}}>
            {!photo.current ? (
              <>
                <Image
                  style={styles.profilePicture}
                  source={{
                    uri: `${APIURL}/API/uploads/${userDetails.profilepic}`,
                  }}
                />

                <View style={styles.iconsContainer}>
                  <MaterialIcons
                    color={'white'}
                    name="edit"
                    size={25}
                    style={{textAlign: 'center'}}
                  />
                </View>
              </>
            ) : (
              <Image
                source={{uri: photo.current.uri}}
                style={styles.profilePicture}
              />
            )}
          </TouchableOpacity>

          <Text style={styles.nameText}>{userDetails?.name}</Text>
        </View>
      </View>
      <ScrollView style={styles.lowerLayout}>
        <Text style={styles.fullNameText}>{language.fullName}</Text>
        <Input
          control={control}
          name="name"
          ref={e => {
            // phoneno.ref(e);
            // phonenoRef.current = e;
          }}
          rules={{
            required: 'Name is required',
            minLength: {
              value: 2,
              message: 'Too short min length is 2',
            },
          }}
          placeholder="Name"
          textStyle={{textAlign: 'center'}}
        />
        {errors.name && (
          <Text style={styles.errormessage}>{errors.name.message}</Text>
        )}

        <Text style={styles.mobileNoText}>{language.mobileNumber}</Text>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={{fontSize: 16, borderWidth: 1, padding: 2}}>+49</Text>
          <Input
            // type="special"
            control={control}
            name="phone"
            ref={e => {
              // phoneno.ref(e);
              // phonenoRef.current = e;
            }}
            rules={{
              required: 'Phone Number is required',
              minLength: {
                value: 10,
                message: 'Too short min length is 10',
              },
            }}
            style={{width: '90%', marginLeft: 5}}
            placeholder="1234567890"
            keyboardType="number-pad"
            // update={() => alert('update')}
            textStyle={{textAlign: 'center'}}
          />
        </View>
        {errors.phone && (
          <Text style={styles.errormessage}>{errors.phone.message}</Text>
        )}
        <Text style={styles.mobileNoText}>{language.emailAddress}</Text>

        <Input
          // type="special"
          control={control}
          name="email"
          ref={e => {
            // phoneno.ref(e);
            // phonenoRef.current = e;
          }}
          rules={{
            required: 'Email Address is required',
            minLength: {
              value: 2,
              message: 'Too short min length is 2',
            },
          }}
          placeholder="Email Address"
          // update={() => alert('update')}
          textStyle={{textAlign: 'center'}}
        />
        {errors.email && (
          <Text style={styles.errormessage}>{errors.email.message}</Text>
        )}
        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          style={{marginVertical: 10, marginBottom: 40}}>
          <Text style={styles.submitText}>{language.submit}</Text>
        </TouchableOpacity>
      </ScrollView>
      <ImagePickerModal
        isVisible={visible}
        onClose={() => setVisible(false)}
        onImageLibraryPress={openGallery}
        onCameraPress={openCamera}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  upperLayout: {
    // flex: 1,
    minHeight: 210,
    justifyContent: 'space-around',
  },
  myAccount: {
    fontFamily: 'Roboto-Bold',
    fontSize: 15,
    paddingLeft: 15,
    color: 'white',
  },
  profilePicture: {
    width: 120,
    height: 120,
    borderRadius: 100,
    alignSelf: 'center',
  },
  iconsContainer: {
    padding: 5,
    borderRadius: 100,
    position: 'absolute',
    marginLeft: 50,
    bottom: 0,
    right: 0,
    backgroundColor: Colors.iconBackground,
  },
  nameText: {
    fontFamily: 'Roboto-Bold',
    color: Colors.textColor,
    alignSelf: 'center',
    fontSize: 20,
    paddingTop: 20,
  },

  lowerLayout: {
    flex: 2,
    backgroundColor: Colors.backgroundColor,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingTop: 30,
    paddingHorizontal: 30,
    paddingBottom: 20,
  },
  fullNameText: {
    color: Colors.textBlue,
    fontFamily: 'Roboto-Regular',
    fontSize: 15,
    marginBottom: 15,
  },
  errormessage: {
    color: 'red',
    fontSize: 15,
    alignSelf: 'center',
  },
  submitText: {
    color: Colors.textBlue,
    fontFamily: 'Roboto-Bold',
    fontSize: 18,
    textAlign: 'center',
  },
  mobileNoText: {
    color: Colors.textBlue,
    fontFamily: 'Roboto-Regular',
    fontSize: 15,
    marginBottom: 15,
  },
});
export default EditProfile;
