import React, {useCallback, useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
// import Entypo from 'react-native-vector-icons/Entypo';
import Colors from '../constants/Colors';

import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';

import EnterUserDetails from '../components/modals/EnterUserDetails';

import {AuthContext} from '../context/Auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect, useNavigation} from '@react-navigation/native';

import Loader from '../components/Animatedfullscreen/Loader';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {APIURL} from '../constants/Url';
import {NotificationModal} from '../components/modals/NotificationModal';
export const Address = ({route}) => {
  const {price} = route.params;

  // const [getAddresses, setGetAddresses] = useState([]);
  // const [modalVisible, setModalVisible] = useState(false);
  const [loading] = useState(false);
  const [getAreaLoading, setGetAreaLoading] = useState(false);
  const {
    addressList,
    language,
    setLocationData,
    modalVisible,
    setModalVisible,
  } = useContext(AuthContext);
  const [PaymentType, setPaymentType] = useState('');
  const [selectPaymentTypes, SetSelectPaymentTypes] = useState({});
  const [gerAreas, setGerAreas] = useState({});
  const [gerAreas1, setGerAreas1] = useState({});
  const [modalVisible1, setModalVisible1] = useState(false);
  const navigation = useNavigation();

  const SelectPaymentTypes = name => {
    if (PaymentType === name) {
      setPaymentType(name);
    } else {
      setPaymentType(name);
    }
  };

  const Get_area = async () => {
    setGetAreaLoading(true);
    try {
      let base_url = `${APIURL}/API/getareas.php`;

      let form = new FormData();
      form.append(
        'token',
        'as23rlkjadsnlkcj23qkjnfsDKJcnzdfb3353ads54vd3favaeveavgbqaerbVEWDSC',
      );

      // eslint-disable-next-line no-undef
      const response = await fetch(base_url, {
        method: 'post',
        body: form,
      });

      const responseData = await response.json();

      if (responseData.status === true) {
        setGerAreas1(responseData.Data);
        setGerAreas(
          responseData.Data.map((item, index) => {
            return {key: index, value: item.postal_code};
          }),
        );
        // alert('Success wallet transaction');
        // alert(responseData.Message);

        // onSubmit();
        // throw new Error(responseData.Message);
      } else {
        alert(responseData.Message);
      }
    } catch (error) {
      // Alert.alert(error.message);
      console.log(error);
    }
    setGetAreaLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      Get_area();
    }, []),
  );

  const check_payment = () => {
    // console.log(price > parseFloat(selectPaymentTypes.min_order_price))
    if (PaymentType == '') {
      // alert(language.selectAnyAddress);
      navigation.navigate('paymentMethod', {price, selectPaymentTypes});
    } else {
      if (price >= parseFloat(selectPaymentTypes.min_order_price)) {
        navigation.navigate('paymentMethod', {price, selectPaymentTypes});
      } else {
        setModalVisible1(true);
      }
    }
  };

  return loading || getAreaLoading ? (
    <Loader />
  ) : (
    <View style={{flex: 1}}>
      <View>
        <EnterUserDetails
          modalVisible={modalVisible}
          onClose={() => setModalVisible(false)}
          onPress={() => setModalVisible(false)}
          backButton={() => setModalVisible(false)}
          gerAreas={gerAreas}
          gerAreas1={gerAreas1}
          price={price}
        />

        <ScrollView style={{height: '85%'}}>
          {addressList?.map((item, index) => {
            return (
              <TouchableOpacity
                style={[
                  styles.MainButton,
                  {
                    borderWidth: 1,
                    borderColor:
                      PaymentType === item?.Shipping_state + index.toString()
                        ? Colors.primary
                        : '#fff',
                  },
                ]}
                key={index}
                onPress={() => {
                  SelectPaymentTypes(item?.Shipping_state + index.toString());
                  SetSelectPaymentTypes(item);
                  setLocationData(item);
                }}>
                <View style={styles.MainButtonChild}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      // justifyContent: 'space-between',
                      width: '40%',
                    }}>
                    <FontAwesome5
                      style={[styles.paymentButtonText, {fontSize: 15}]}
                      name="location-arrow"
                      color={Colors.primary}
                    />
                    <Text style={[styles.AddressText, {marginLeft: 5}]}>
                      {item.Shipping_city}
                      {', '}
                    </Text>

                    <Text numberOfLines={1} style={styles.AddressText}>
                      {item.Shipping_state}
                    </Text>
                  </View>
                  <Text style={styles.AddressText}>
                    {language.minOrder}{' '}
                    <Text style={[styles.AddressText, {color: Colors.primary}]}>
                      €{item.min_order_price}
                    </Text>
                  </Text>
                </View>
                <Text style={styles.ShippingAdress}>
                  {item.Shipping_address}, {item.Shipping_postal_code}
                </Text>
                <Text style={styles.ShippingAdress}>{item.Shipping_area}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={[
          styles.paymentButton,
          {
            position: 'absolute',
            bottom: 70,
            width: '100%',
            padding: 10,
            backgroundColor: '#fff',
          },
        ]}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <AntDesign
            style={[styles.paymentButtonText, {fontSize: 20}]}
            name="pluscircleo"
            // size={50}
            color={'black'}
          />
          <Text
            style={[
              styles.paymentButtonText,
              {marginHorizontal: 20, fontFamily: 'Roboto-Regular'},
            ]}>
            {language.addNewAddress}
          </Text>
          <SimpleLineIcons
            style={[styles.paymentButtonText, {fontSize: 20}]}
            name="location-pin"
            // size={510}
            color={'black'}
          />
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => check_payment()}
        style={styles.paymentButton}>
        <Text style={[styles.paymentButtonText, {color: 'white'}]}>
          {language.proceedForPaymentMethod}
        </Text>
      </TouchableOpacity>

      <NotificationModal
        isVisible={modalVisible1}
        message={`${language.theMinimumCost} ${
          selectPaymentTypes.min_order_price
        } ${language.pleaseAddAnyFurther} ${
         ( selectPaymentTypes.min_order_price - price).toFixed(2)
        }.`}
        onClose={() => setModalVisible1(false)}
        onPress={() => {
          setModalVisible1(false);
          navigation.navigate('paymentMethod', {price, selectPaymentTypes});
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  paymentmainView: {
    // borderWidth: 1,
    // borderColor: Colors.primary,
    padding: 20,
    marginHorizontal: 10,
    flexDirection: 'row',
    // alignItems: 'center',
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
    textAlign: 'center',
    fontSize: 18,
    fontFamily: 'Roboto-Bold',
    // color: 'white',
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  AddressText: {
    fontSize: 15,
    fontFamily: 'Roboto-Medium',
    paddingVertical: 2,
  },
  ShippingAdress: {
    fontSize: 13,
    color: 'black',
    opacity: 0.7,
    fontFamily: 'Roboto-Regular',
    //   marginTop: 5,
    paddingVertical: 2,
    marginLeft: 22,
  },
});
