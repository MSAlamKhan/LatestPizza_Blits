import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React, {useContext, useState, useCallback} from 'react';
import Colors from '../constants/Colors';
import NotificationBox from '../components/NotificationBox';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {AuthContext} from '../context/Auth';
import {APIURL} from '../constants/Url';
import {useFocusEffect} from '@react-navigation/native';
import Toast from 'react-native-simple-toast';
import {ScrollView} from 'react-native-gesture-handler';
const Notifications = () => {
  const [selectedType, setSelectedType] = useState('all');
  const {language, userDetails} = useContext(AuthContext);
  const [notificaion, setNotificaion] = useState([]);
  const [orderNotification, setOrderNotification] = useState([]);
  const [promoNotification, setPromoNotification] = useState([]);

  const getNotification = async (transactionid, amount) => {
    try {
      let base_url = `${APIURL}/API/notification.php`;

      let form = new FormData();

      form.append(
        'token',
        'as23rlkjadsnlkcj23qkjnfsDKJcnzdfb3353ads54vd3favaeveavgbqaerbVEWDSC',
      );

      // form.append('user_id', 153);
      form.append('user_id', userDetails.user_id);

      // eslint-disable-next-line no-undef
      const response = await fetch(base_url, {
        method: 'post',
        body: form,
      });

      const responseData = await response.json();

      if (responseData.status == true) {
        setNotificaion(responseData.Data);
        setPromoNotification(
          responseData.Data.filter(item => item.purpose === 'promo'),
        );
        setOrderNotification(
          responseData.Data.filter(item => item.purpose === 'order'),
        );

        // console.log('222==>', check);
        // setAmount(responseData.Data.amount);
        // setName(responseData.Data.name);
      } else {
        Toast.show(`No Notification`, Toast.LONG);
      }
    } catch (error) {
      Toast.show(`Internet not working`, Toast.LONG);
    }
  };
  useFocusEffect(
    useCallback(() => {
      getNotification();
    }, []),
  );
  return (
    <View style={styles.container}>
      <View style={styles.upperLayout}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>{language.notifications}</Text>
          {/* <Ionicons name="search" size={20} /> */}
        </View>
      </View>
      <View style={styles.lowerLayout}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => setSelectedType('all')}
            style={[
              styles.button,
              {
                backgroundColor:
                  selectedType === 'all'
                    ? Colors.primary
                    : Colors.backgroundColor,
                borderWidth: selectedType === 'all' ? 0 : 1,
              },
            ]}>
            <Text
              style={[
                styles.buttonText,
                {color: selectedType === 'all' ? 'white' : 'black'},
              ]}>
              {language.all}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setSelectedType('orderInfo')}
            style={[
              styles.button,
              {
                backgroundColor:
                  selectedType === 'orderInfo'
                    ? Colors.primary
                    : Colors.backgroundColor,
                borderWidth: selectedType === 'orderInfo' ? 0 : 1,
              },
            ]}>
            <Text
              style={[
                styles.buttonText,
                {color: selectedType === 'orderInfo' ? 'white' : 'black'},
              ]}>
              {language.orderInfo}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setSelectedType('promotion')}
            style={[
              styles.button,
              {
                backgroundColor:
                  selectedType === 'promotion'
                    ? Colors.primary
                    : Colors.backgroundColor,
                borderWidth: selectedType === 'promotion' ? 0 : 1,
              },
            ]}>
            <Text
              style={[
                styles.buttonText,
                {color: selectedType === 'promotion' ? 'white' : 'black'},
              ]}>
              {language.promotion}
            </Text>
          </TouchableOpacity>
        </View>
        <ScrollView>
          {selectedType === 'all' && <NotificationBox data={notificaion} />}
          {selectedType === 'orderInfo' && (
            <NotificationBox data={orderNotification} />
          )}
          {selectedType === 'promotion' && (
            <NotificationBox data={promoNotification} />
          )}
        </ScrollView>
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
    height: 90,
    // alignItems: 'center',
    justifyContent: 'center',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontFamily: 'Roboto-Bold',
    fontSize: 18,
    color: Colors.textColor,
  },
  lowerLayout: {
    backgroundColor: Colors.backgroundColor,
    flex: 1,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  buttonContainer: {
    // marginVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    borderBottomWidth: 1,
    borderColor: Colors.textLighestGrey,
    paddingVertical: 15,
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 30,
  },
  buttonText: {
    fontFamily: 'Roboto-Bold',
    fontSize: 15,
  },
});
export default Notifications;
