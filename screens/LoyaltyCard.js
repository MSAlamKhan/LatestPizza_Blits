import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React, {useState, useContext, useCallback} from 'react';
import Colors from '../constants/Colors';
import {APIURL} from '../constants/Url';

import {useForm} from 'react-hook-form';
import LinearGradient from 'react-native-linear-gradient';
import CommonButton from '../components/CommonButton';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {AuthContext} from '../context/Auth';
import {NavigationContainer, useFocusEffect} from '@react-navigation/native';
import Loader from '../components/Animatedfullscreen/Loader';
// import {AuthContext} from '../context/Auth';
const LoyaltyCard = ({navigation}) => {
  const [toogle, setToogle] = useState(false);
  const [toogle1, setToogle1] = useState(false);
  const [toogle2, setToogle2] = useState(false);
  const [loding, setLoding] = useState(false);
  const [cardDetails, setcardDetails] = useState();
  const [fetchCardDetails, setfetchCardDetails] = useState();

  const {userDetails, language} = useContext(AuthContext);
  // console.log('userDetails.user_id', userDetails.user_id);

  const fetch_card = async data => {
    setLoding(true);
    try {
      let base_url = `${APIURL}/API/Fetch_card.php`;
      let uploadData = new FormData();

      uploadData.append('user_id', userDetails.user_id);
      uploadData.append(
        'token',
        'as23rlkjadsnlkcj23qkjnfsDKJcnzdfb3353ads54vd3favaeveavgbqaerbVEWDSC',
      );

      const response = await fetch(base_url, {
        method: 'post',
        body: uploadData,
      });

      const responseData = await response.json();
      console.log('fetch_card===>', responseData);
      if (responseData.status === true) {
        setLoding(false);
        setfetchCardDetails(responseData);
      } else {
        setLoding(false);
        setfetchCardDetails(responseData);
      }

      return responseData;
    } catch (error) {
      // Alert.alert(error.message);
    } finally {
      // setLoading(false);
    }
    setLoding(false);
  };

  const activate_card = async data => {
    setLoding(true);

    try {
      let base_url = `${APIURL}/API/Activate_card.php`;
      let uploadData = new FormData();

      uploadData.append('user_id', userDetails.user_id);
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
        setLoding(false);

        // console.log(responseData);
        alert(`Activation succesfull`);
        setcardDetails(responseData);
        navigation.navigate('profile');
      } else {
        setLoding(false);
        // console.log('failed');
      }

      return responseData;
    } catch (error) {
      // Alert.alert(error.message);
    } finally {
      // setLoading(false);
    }
  };
  useFocusEffect(
    useCallback(() => {
      fetch_card();
    }, []),
  );
  return loding ? (
    <Loader />
  ) : (
    <View style={styles.container}>
      <View style={styles.upperLayout}>
        <Text style={styles.title}>{language.loyaltyCard}</Text>
      </View>

      <View style={styles.lowerLayout}>
        {fetchCardDetails?.status == true ? (
          <LinearGradient
            colors={['#265289', '#5985bc']}
            start={{x: 1, y: 1}}
            end={{x: 1, y: 0}}
            style={styles.cardContainer}>
            <Text style={styles.cardText}>{language.card}</Text>

            <Text style={styles.cardNoText}>
              {fetchCardDetails?.Card_number}
            </Text>
            <Text style={styles.loyaltyText}>{language.mrMartLoyaltyCard}</Text>
            <View
              style={{
                marginTop: 40,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Text style={styles.cardHolderNameText}>{userDetails.name}</Text>
              {/* <Text style={styles.expiryText}>07/22</Text> */}
            </View>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={styles.cardHolderTitleText}>CVC</Text>
              <Text style={styles.validText}>{fetchCardDetails?.CVC}</Text>
            </View>
          </LinearGradient>
        ) : (
          <LinearGradient
            colors={['#265289', '#5985bc']}
            start={{x: 1, y: 1}}
            end={{x: 1, y: 0}}
            style={styles.cardContainer}>
            <Text style={styles.cardText}>{language.card}</Text>

            <Text style={styles.cardNoText}>000 000 000 000</Text>
            <Text style={styles.loyaltyText}>{language.mrMartLoyaltyCard}</Text>
            <View
              style={{
                marginTop: 40,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Text style={styles.cardHolderNameText}>
                {language.cardHolderName}
              </Text>
              {/* <Text style={styles.expiryText}>07/22</Text> */}
            </View>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={styles.cardHolderTitleText}>CVC</Text>
              <Text style={styles.validText}>000</Text>
            </View>
          </LinearGradient>
        )}

        {fetchCardDetails?.status == false ? (
          <CommonButton
            style={{marginVertical: 20}}
            title={language.activateLoyaltyCard}
            onPress={() => activate_card()}
          />
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  upperLayout: {
    flex: 1,
  },
  title: {
    fontFamily: 'Roboto-Bold',
    fontSize: 18,
    color: Colors.textColor,
    paddingLeft: 20,
    paddingTop: 20,
  },

  lowerLayout: {
    flex: 3,
    backgroundColor: Colors.backgroundColor,
  },
  cardContainer: {
    width: '80%',
    height: 190,
    backgroundColor: Colors.textBlue,
    alignSelf: 'center',
    marginTop: -90,
    borderRadius: 30,
    padding: 15,
  },
  cardText: {
    fontFamily: 'Roboto-Bold',
    color: 'white',
    textAlign: 'right',
    fontSize: 22,
  },
  cardNoText: {
    fontFamily: 'Roboto-Bold',
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    width: '100%',
  },
  loyaltyText: {
    fontFamily: 'Roboto-Bold',
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    // marginTop: 0,
  },
  cardHolderNameText: {
    fontFamily: 'Roboto-Bold',
    color: '#fcc419',

    fontSize: 18,
  },
  expiryText: {
    fontFamily: 'Roboto-Bold',
    color: Colors.primary,

    fontSize: 18,
  },
  cardHolderTitleText: {
    fontFamily: 'Roboto-Bold',
    color: '#fff',

    fontSize: 13,
  },
  validText: {
    fontFamily: 'Roboto-Bold',
    color: '#fff',

    fontSize: 13,
  },
  faqContaioner: {
    marginTop: 20,
  },
  faqText: {
    paddingHorizontal: 20,
    fontFamily: 'Roboto-Bold',
    fontSize: 18,
  },
  faqItems: {
    paddingHorizontal: 20,
    paddingBottom: 10,
    borderBottomWidth: 0.5,
    color: Colors.textLighestGrey,
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  faqItemsText: {
    fontFamily: 'Roboto-Light',
    fontSize: 13,
    color: Colors.textLighestGrey,
  },
  faqDescriptionText: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  FaqTermText: {
    fontFamily: 'Roboto-Bold',
    textAlign: 'center',
    marginTop: 20,
  },
});
export default LoyaltyCard;
