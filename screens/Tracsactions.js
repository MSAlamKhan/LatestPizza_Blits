import React, {useCallback, useContext, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Colors from '../constants/Colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import EnterUserDetails from '../components/modals/EnterUserDetails';
// import PaymentModal from '../components/modals/paymentModal';
import {AuthContext} from '../context/Auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {Checkbox} from 'react-native-paper';
import {APIURL} from '../constants/Url';
import {ScrollView} from 'react-native-gesture-handler';
import CashLoader from '../components/Animatedfullscreen/CashLoader';
import {color} from 'react-native-reanimated';

const Tracsactions = () => {
  const [loading, setLoading] = useState(false);
  const {paymentData, setPaymentPreviousData, language, userDetails} =
    useContext(AuthContext);
  const navigation = useNavigation();

  const [transactions, settransactions] = useState([]);

  const fetch_transactions = async data => {
    setLoading(true);
    try {
      let base_url = `${APIURL}/API/get_transactions.php`;
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
      console.log('response', responseData);
      if (responseData) {
        // console.log('settransactions', responseData);
        settransactions(responseData);
        // setLoding(false);
        // setfetchCardDetails(responseData);
      } else {
        console.log('failed');
        // setLoding(false);
        // setfetchCardDetails(responseData);
      }

      return responseData;
    } catch (error) {
      // Alert.alert(error.message);
    } finally {
      setLoading(false);
    }
    setLoading(false);
  };
  useFocusEffect(
    useCallback(() => {
      fetch_transactions();
    }, []),
  );
  return loading ? (
    <CashLoader />
  ) : (
    <ScrollView style={{flex: 1}}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            flexDirection: 'row',
            alignContent: 'center',
            alignItems: 'center',
          }}>
          <Ionicons
            style={[styles.paymentButtonText, {fontSize: 30}]}
            name="arrow-back-outline"
            color={'white'}
          />
          <Text style={{marginLeft: 10, fontWeight: 'bold', color: 'white'}}>
            Back
          </Text>
        </TouchableOpacity>
      </View>
      <View>
        {transactions.length == 1 && <Text>No Transction</Text>}
        {transactions?.map((item, index) => {
          return (
            <TouchableOpacity key={index} style={styles.paymentmainView}>
              <View style={styles.MainButtonChild}>
                <Text style={[styles.AddressText, {marginHorizontal: 10}]}>
                  {language.transactionId} : {item.transaction_id}
                </Text>
                <View style={{flexDirection: 'row'}}>
                  <Text
                    style={[
                      styles.AddressText,
                      {
                        marginHorizontal: 10,
                        color:
                          item.transaction_type == 'credit'
                            ? Colors.primary
                            : Colors.buttongrad1,
                      },
                    ]}>
                    {item.transaction_type == 'credit'
                      ? language.amountCredited
                      : language.amountDebited}
                    : €{item.old_amount}
                  </Text>
                  <Text style={[styles.AddressText, {marginHorizontal: 10}]}>
                    {language.totalAmount} : €{item.amount}
                  </Text>
                </View>
                <Text style={styles.ShippingAdress}>
                  {language.transactionType} : {item.transaction_type}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  header: {
    // paaddingHorizontal: 15,
    // marginVertical: 20,0
    paddingHorizontal: 10,
    paddingVertical: 20,
    marginBottom: 10,
    backgroundColor: Colors.primary,
  },
  paymentmainView: {
    padding: 20,
    marginHorizontal: 10,
    flexDirection: 'row',
    borderRadius: 8,
    marginBottom: 10,
    justifyContent: 'space-between',
    backgroundColor: '#fff',
  },
  paymentmethod: {
    //   borderWidth: 1,
    //   borderColor: Colors.primary,
    padding: 20,
    marginHorizontal: 10,
    fontSize: 20,
    fontFamily: 'Roboto-Bold',
  },
  paymentpyby: {
    color: 'black',
    fontFamily: 'Roboto-Regular',
    fontSize: 13,
    padding: 5,
  },
  extrapaymentmethod: {
    paddingHorizontal: 5,
    paddingVertical: 0,
    marginBottom: 20,
    fontFamily: 'Roboto-Medium',
    fontSize: 13,
  },
  paymentButton: {
    position: 'absolute',
    //   margin: 16,
    //   right: 10,
    bottom: 0,
    //   borderWidth: 1,
    width: '100%',
    padding: 20,
    backgroundColor: Colors.primary,
  },
  paymentButtonText: {
    // textAlign: 'center',
    fontSize: 18,
    fontFamily: 'Roboto-Bold',
  },
  headerRightItemsIcon: {
    paddingRight: 20,
    alignSelf: 'center',
  },
  FlatListitems: {
    backgroundColor: 'white',
    // borderBottomWidth: 1,
    // borderBottomColor: Colors.textBlue,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 18,
  },
  FlatListleft: {
    flexDirection: 'row',
    // alignItems: 'center',
  },
  MainButton: {
    backgroundColor: 'white',
    marginHorizontal: 10,
    padding: 10,
    marginTop: 10,
    borderRadius: 10,
    // borderRadius: 100,
  },
  MainButtonChild: {
    flexDirection: 'column',
    // alignItems: 'center',
  },
  AddressText: {
    fontSize: 13,
    fontFamily: 'Roboto-Medium',
    paddingVertical: 2,
  },
  ShippingAdress: {
    fontSize: 13,
    color: 'black',
    opacity: 0.6,
    fontFamily: 'Roboto-Medium',
    //   marginTop: 5,
    paddingVertical: 2,
    marginLeft: 12,
    // marginLeft: 22,
  },
});
export default Tracsactions;
