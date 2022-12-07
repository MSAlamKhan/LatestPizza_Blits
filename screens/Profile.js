import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import React, {useContext, useState} from 'react';
import Colors from '../constants/Colors';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {NavigationContainer} from '@react-navigation/native';
import {AuthContext} from '../context/Auth';
import CommonButton from '../components/CommonButton';
import {english, german, hindi} from '../constants/Language';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SelectLanugageModal from '../components/modals/SelectLanguageModal';
import Toast from 'react-native-simple-toast';
import {APIURL} from '../constants/Url';
import Loader from '../components/Animatedfullscreen/Loader';

const Profile = ({navigation}) => {
  const [imageLoading, setImageLoading] = useState(true);
  const {
    isSignin,
    setIsSignin,
    setRole,
    setLanguage,
    userDetails,
    language,
    setCart,
    setRecentlyView,
  } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [lanugageModal, setLanugageModal] = useState(false);
  const logout = async () => {
    setLoading(true);
    try {
      let base_url = `${APIURL}/API/cleartoken.php`;
      let uploadData = new FormData();

      uploadData.append(
        'token',
        'as23rlkjadsnlkcj23qkjnfsDKJcnzdfb3353ads54vd3favaeveavgbqaerbVEWDSC',
      );
      uploadData.append('user_id', userDetails.user_id);

      // eslint-disable-next-line no-undef
      const response = await fetch(base_url, {
        method: 'post',
        body: uploadData,
      });

      const responseData = await response.json();

      if (responseData.status === false) {
        Toast.show(responseData.Message, Toast.LONG);
      } else {
        await AsyncStorage.removeItem('userDetails');
        setRecentlyView([]);
        await AsyncStorage.removeItem('cart');
        setCart({
          items: [],
          totalAmount: 0,
        });
        // RNRestart.Restart();
        setIsSignin(false);
      }

      return responseData;
    } catch (error) {
      Toast.show(error.message, Toast.LONG);
    }
    setLoading(false);
    // await AsyncStorage.removeItem('userDetails');
    // // RNRestart.Restart();
    // setIsSignin(false);
  };
  // const germanSelectionModal = () => {
  //   AsyncStorage.setItem('language', 'hindi');
  //   setLanguage(german);
  //   setLanugageModal(false);
  // };
  // const englishSelectionModal = () => {
  //   AsyncStorage.setItem('language', 'english');
  //   setLanguage(english);
  //   setLanugageModal(false);
  // };

  // const hindiSelection = () => {
  //   navigation.navigate('bottomTab');
  //   AsyncStorage.setItem('language', 'german');
  //   setLanguage(german);
  // };
  // const englishSelection = () => {
  //   navigation.navigate('bottomTab');
  //   AsyncStorage.setItem('language', 'english');
  //   setLanguage(english);
  // };
  return isSignin ? (
    <>
      {loading ? (
        <Loader />
      ) : (
        <SafeAreaView style={styles.signinContainer}>
          {/* <SelectLanugageModal
            modalVisible={lanugageModal}
            onClose={() => setLanugageModal(false)}
            onEnglishPress={() => englishSelectionModal()}
            onHindiPress={() => germanSelectionModal()}
            backButton={() => setLanugageModal(false)}
            title={language.selectLanguage}
          /> */}
          <View style={styles.upperLayout}>
            <Text style={styles.myAccount}>{language.myAccount}</Text>
            <View style={{}}>
              <Image
                onLoad={() => setImageLoading(false)}
                // onLoadEnd={() => console.log('it should work')}
                style={[styles.profilePicture]}
                source={{
                  uri: `${APIURL}/API/uploads/${userDetails.profilepic}`,
                }}
              />
              <ActivityIndicator
                animating={imageLoading}
                color={'green'}
                style={[{position: 'absolute'}, styles.profilePicture]}
              />
              <Text style={styles.nameText}>{userDetails?.name}</Text>
              <Text style={styles.phoneNoText}>{userDetails?.phone}</Text>
            </View>
          </View>
          <ScrollView style={styles.lowerLayout}>
            <TouchableOpacity
              onPress={() => navigation.navigate('editProfile')}
              style={styles.itemsContainer}>
              <View style={{flexDirection: 'row'}}>
                <View style={styles.iconsContainer}>
                  <MaterialCommunityIcons
                    color={'white'}
                    name="account-edit"
                    size={25}
                  />
                </View>
                <Text style={styles.itemsText}>{language.editProfile}</Text>
              </View>
              <Entypo name="chevron-small-right" size={35} />
            </TouchableOpacity>
            <View style={styles.line}></View>
            <TouchableOpacity
              onPress={() => navigation.navigate('myorders')}
              style={styles.itemsContainer}>
              <View style={{flexDirection: 'row'}}>
                <View style={styles.iconsContainer}>
                  <Entypo color={'white'} name="shopping-cart" size={25} />
                </View>
                <Text style={styles.itemsText}>{language.myOrders}</Text>
              </View>
              <Entypo name="chevron-small-right" size={35} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('wallet')}
              style={styles.itemsContainer}>
              <View style={{flexDirection: 'row'}}>
                <View style={styles.iconsContainer}>
                  <Entypo color={'white'} name="wallet" size={25} />
                </View>
                <Text style={styles.itemsText}>{language.wallet}</Text>
              </View>
              <Entypo name="chevron-small-right" size={35} />
            </TouchableOpacity>
            <View style={styles.line}></View>
            <TouchableOpacity
              onPress={() => navigation.navigate('loyaltyCard')}
              style={styles.itemsContainer}>
              <View style={{flexDirection: 'row'}}>
                <View style={styles.iconsContainer}>
                  <Ionicons color={'white'} name="card-sharp" size={25} />
                </View>
                <Text style={styles.itemsText}>{language.loyaltyCard}</Text>
              </View>
              <Entypo name="chevron-small-right" size={35} />
            </TouchableOpacity>
            <View style={styles.line}></View>

            <View style={styles.line}></View>
            <TouchableOpacity
              onPress={() => navigation.navigate('accountSetting')}
              style={styles.itemsContainer}>
              <View style={{flexDirection: 'row'}}>
                <View style={styles.iconsContainer}>
                  <MaterialCommunityIcons
                    color={'white'}
                    name="account-settings"
                    size={25}
                  />
                </View>
                <Text style={styles.itemsText}>{language.accountSetting}</Text>
              </View>
              <Entypo name="chevron-small-right" size={35} />
            </TouchableOpacity>
            {/* <TouchableOpacity
              onPress={() => setLanugageModal(true)}
              style={styles.itemsContainer}>
              <View style={{flexDirection: 'row'}}>
                <View style={styles.iconsContainer}>
                  <FontAwesome color={'white'} name="language" size={25} />
                </View>
                <Text style={styles.itemsText}>{language.selectLanguage}</Text>
              </View>
              <Entypo name="chevron-small-right" size={35} />
            </TouchableOpacity> */}
            <TouchableOpacity
              onPress={() => logout()}
              style={styles.itemsContainer}>
              <View style={{flexDirection: 'row'}}>
                <View style={styles.iconsContainer}>
                  <MaterialCommunityIcons
                    color={'white'}
                    name="logout"
                    size={25}
                  />
                </View>
                <Text style={styles.itemsText}>{language.logout}</Text>
              </View>
              <Entypo name="chevron-small-right" size={35} />
            </TouchableOpacity>

            {/* <View style={styles.line}></View> */}
          </ScrollView>
        </SafeAreaView>
      )}
    </>
  ) : (
    <View style={styles.container}>
      <Text style={{fontSize: 20, alignSelf: 'center', paddingHorizontal: 30}}>
        {language.signInToAcessProfile}
      </Text>
      <CommonButton
        onPress={() => {
          navigation.navigate('Signin');
          setRole(3);
          // setIsSignin(true);
        }}
        style={{marginTop: 20}}
        title={language.signin}
      />

      <Text style={{fontSize: 20, alignSelf: 'center', paddingHorizontal: 30}}>
        {language.changeLanugage}
      </Text>
      {/* <CommonButton
        onPress={() => {
          navigation.navigate('dashboard');
          englishSelection();
          // setRole(3);
          // setIsSignin(true);
        }}
        style={{marginTop: 20}}
        title={language.english}
      /> */}
      {/* <CommonButton
        onPress={() => {
          navigation.navigate('dashboard');
          hindiSelection();
          // setRole(2);
          // setIsSignin(true);
        }}
        style={{marginBottom: 30}}
        title={language.german}
      /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  //Not Signin Style
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  //Signin Style
  signinContainer: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  upperLayout: {
    flex: 1.2,
    justifyContent: 'space-around',
  },
  myAccount: {
    fontFamily: 'Roboto-Bold',
    fontSize: 15,
    paddingLeft: 15,
    color: Colors.textColor,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 100,
    alignSelf: 'center',
  },
  nameText: {
    fontFamily: 'Roboto-Bold',
    color: Colors.textColor,
    alignSelf: 'center',
    fontSize: 20,
    paddingVertical: 10,
  },
  phoneNoText: {
    fontFamily: 'Roboto-Light',
    color: Colors.textColor,
    fontSize: 13,
    alignSelf: 'center',
    paddingBottom: 5,
  },
  lowerLayout: {
    height: '40%',
    backgroundColor: Colors.backgroundColor,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },
  itemsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
    borderBottomWidth: 0.5,
    marginHorizontal: 30,
    paddingBottom: 10,
    borderBottomColor: Colors.textLighestGrey,
  },
  iconsContainer: {
    backgroundColor: Colors.iconBackground,
    padding: 5,
    borderRadius: 100,
  },
  itemsText: {
    alignSelf: 'center',
    paddingLeft: 20,
    fontFamily: 'Roboto-Medium',
    fontSize: 16,
    color: Colors.iconBackground,
  },
});
export default Profile;
