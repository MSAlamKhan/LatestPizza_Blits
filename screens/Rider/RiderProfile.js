import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import React, {useContext, useState} from 'react';
import Colors from '../../constants/Colors';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';

import {AuthContext} from '../../context/Auth';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {APIURL} from '../../constants/Url';
import SelectLanugageModal from '../../components/modals/SelectLanguageModal';

// import RNRestart from 'react-native-restart';
import Toast from 'react-native-simple-toast';
import {english, hindi} from '../../constants/Language';
import Loader from '../../components/Animatedfullscreen/Loader';
const RiderProfile = ({navigation}) => {
  const {
    isSignin,
    setIsSignin,
    setRole,
    role,
    userDetails,
    setUserDetails,
    language,
    setLanguage,
  } = useContext(AuthContext);
  // console.log('userDetails=>>>>>>>', userDetails);
  const [lanugageModal, setLanugageModal] = useState(false);
  const [loading, setLoading] = useState(false);
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
        // RNRestart.Restart();
        setIsSignin(false);
      }

      return responseData;
    } catch (error) {
      alert(error.message);
    }
    setLoading(false);
  };
  const hindiSelectionModal = () => {
    AsyncStorage.setItem('language', 'hindi');
    setLanguage(hindi);
    setLanugageModal(false);
  };
  const englishSelectionModal = () => {
    AsyncStorage.setItem('language', 'english');
    setLanguage(english);
    setLanugageModal(false);
  };
  return loading ? (
    <Loader />
  ) : (
    <View style={styles.signinContainer}>
      <SelectLanugageModal
        modalVisible={lanugageModal}
        onClose={() => setLanugageModal(false)}
        onEnglishPress={() => englishSelectionModal()}
        onHindiPress={() => hindiSelectionModal()}
        backButton={() => setLanugageModal(false)}
        title={language.selectLanguage}
      />
      <View style={styles.upperLayout}>
        <Text style={styles.myAccount}>{language.myAccount}</Text>
        <View style={{}}>
          <Image
            style={styles.profilePicture}
            source={{
              uri: `${APIURL}/API/uploads/${userDetails.profilepic}`,
            }}
          />

          <Text style={styles.nameText}>{userDetails?.name}</Text>
          <Text style={styles.phoneNoText}>{userDetails?.phone}</Text>
        </View>
      </View>
      <View style={styles.lowerLayout}>
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
        {/* <TouchableOpacity
          onPress={() => navigation.navigate('riderorderlist')}
          style={styles.itemsContainer}>
          <View style={{flexDirection: 'row'}}>
            <View style={styles.iconsContainer}>
              <MaterialCommunityIcons
                color={'white'}
                name="bank-outline"
                size={25}
              />
            </View>
            <Text style={styles.itemsText}>{language.myOrders}</Text>
          </View>
          <Entypo name="chevron-small-right" size={35} />
        </TouchableOpacity> */}
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
        {/* <View style={styles.line}></View>
        <TouchableOpacity
          onPress={() => navigation.navigate('loyaltyCard')}
          style={styles.itemsContainer}>
          <View style={{flexDirection: 'row'}}>
            <View style={styles.iconsContainer}>
              <Ionicons color={'white'} name="card-sharp" size={25} />
            </View>
            <Text style={styles.itemsText}>Loyalty Card</Text>
          </View>
          <Entypo name="chevron-small-right" size={35} />
        </TouchableOpacity> */}
        {/* <View style={styles.line}></View>
        <TouchableOpacity
          onPress={() => navigation.navigate('referEarn')}
          style={styles.itemsContainer}>
          <View style={{flexDirection: 'row'}}>
            <View style={styles.iconsContainer}>
              <Entypo color={'white'} name="slideshare" size={25} />
            </View>
            <Text style={styles.itemsText}>Refer & Earn</Text>
          </View>
          <Entypo name="chevron-small-right" size={35} />
        </TouchableOpacity> */}
        <View style={styles.line}></View>
        {/* <TouchableOpacity
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
        </TouchableOpacity> */}
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
              <MaterialCommunityIcons color={'white'} name="logout" size={25} />
            </View>
            <Text style={styles.itemsText}>{language.logout}</Text>
          </View>
          <Entypo name="chevron-small-right" size={35} />
        </TouchableOpacity>
        <View style={styles.line}></View>
      </View>
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
    flex: 1,
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
    flex: 2,
    backgroundColor: Colors.backgroundColor,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },
  itemsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
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
    color: 'black',
  },
});
export default RiderProfile;
