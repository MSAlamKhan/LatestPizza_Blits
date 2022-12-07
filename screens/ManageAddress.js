import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, {useState, useContext, useCallback} from 'react';

import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {AuthContext} from '../context/Auth';
import EnterUserDetails from '../components/modals/EnterUserDetails';

import Colors from '../constants/Colors';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';
const AddAddress = ({navigation}) => {
  // const [modalVisible, setModalVisible] = useState(false);
  const {
    language,
    addressList,
    setModalVisible,
    modalVisible,
    setAddressList,
    userDetails,
  } = useContext(AuthContext);

  const [loading, setLoading] = useState([{}]);
  const [getAddresses, setGetAddresses] = useState([{}]);

  const deleteAddress = (item, index) => {
    const newAddressList = addressList.filter((item, ind) => ind != index);

    setAddressList(newAddressList);
    AsyncStorage.setItem(
      `Address${userDetails.user_id}`,
      JSON.stringify(newAddressList),
    );
  };
  return (
    <View style={styles.container}>
      <EnterUserDetails
        modalVisible={modalVisible}
        onClose={() => setModalVisible(false)}
        onPress={() => setModalVisible(false)}
        backButton={() => setModalVisible(false)}
        // onPressButton={() => setModalVisible(false)}
        // modalVisible={false}
      />

      <Text style={styles.manageAddressText}>Manage Address</Text>
      <View
        style={{
          flex: 1,
          justifyContent: 'space-between',
          backgroundColor: Colors.backgroundColor,
        }}>
        <ScrollView>
          {addressList?.map((item, index) => {
            return (
              <View key={index} style={styles.MainButton}>
                <View style={styles.MainButtonChild}>
                  <FontAwesome5
                    style={[styles.paymentButtonText, {fontSize: 15}]}
                    name="location-arrow"
                    color={Colors.primary}
                  />
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      // backgroundColor: 'pink',
                      width: '95%',
                    }}>
                    <View style={{flexDirection: 'row'}}>
                      <Text
                        style={[styles.AddressText, {marginHorizontal: 10}]}>
                        {item.Shipping_city}
                      </Text>

                      <Text style={styles.AddressText}>
                        {item.Shipping_state}
                      </Text>
                    </View>
                    <AntDesign
                      onPress={() => deleteAddress(item, index)}
                      name="delete"
                      size={20}
                    />
                  </View>
                </View>
                <Text style={styles.ShippingAdress}>
                  {item.Shipping_address}
                </Text>
                <Text style={styles.ShippingAdress}>
                  {item.Shipping_address_2}
                </Text>
              </View>
            );
          })}
        </ScrollView>
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={[
            styles.paymentButton,
            {
              // position: 'absolute',
              // bottom: 70,
              // width: '100%',
              padding: 15,
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
      </View>
    </View>
  );
};

export default AddAddress;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  headerRightItemsIcon: {
    paddingRight: 20,
    alignSelf: 'center',
  },
  manageAddressText: {
    marginVertical: 20,
    alignSelf: 'center',
    fontSize: 20,
    fontFamily: 'Roboto-Bold',
    paddingHorizontal: 20,
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
    alignItems: 'center',
  },
  MainButton: {
    backgroundColor: 'white',
    marginHorizontal: 10,
    padding: 10,
    marginTop: 10,
    borderRadius: 10,
    // borderRadius: 100,
  },
  paymentButtonText: {
    // textAlign: 'center',
    fontSize: 18,
    fontFamily: 'Roboto-Bold',
  },
  MainButtonChild: {
    flexDirection: 'row',
    alignItems: 'center',
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
