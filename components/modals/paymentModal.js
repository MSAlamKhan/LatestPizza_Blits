import {StyleSheet, Text, View} from 'react-native';
import React, {useContext, useRef, useState} from 'react';
import CommonButton from '../CommonButton';
import Modal from 'react-native-modal';
import Input from '../Input';
import {useForm} from 'react-hook-form';
import {useNavigation} from '@react-navigation/native';
import {AuthContext} from '../../context/Auth';
import Loader from '../Animatedfullscreen/Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-simple-toast';
import {APIURL} from '../../constants/Url';
const PaymentModal = props => {
  const Shipping_address_2 = useRef();

  const Shipping_postal_code = useRef();

  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const {
    setCart,
    modalVisible,
    setModalVisibleLoyal,
    userDetails,
    locationData,
    CartDetails,
    setThankyouScreen,
  } = useContext(AuthContext);

  const {
    control,
    register,
    handleSubmit,
    formState: {errors, isValid},
  } = useForm({mode: 'all'});

  const removeItemValue = async key => {
    try {
      await AsyncStorage.removeItem('cart');
      setCart({
        items: [],
        totalAmount: 0,
      });
      // navigation.navigate('cart');
      setThankyouScreen(true);
      return true;
    } catch (exception) {
      return false;
    }
  };
  const GetPaymentStatus = async data => {
    setLoading(true);
    try {
      let base_url = `${APIURL}/API/getSubscriptionStatus.php`;

      let form = new FormData();
      form.append(
        'token',
        'as23rlkjadsnlkcj23qkjnfsDKJcnzdfb3353ads54vd3favaeveavgbqaerbVEWDSC',
      );
      form.append('user_id', userDetails?.user_id);

      // eslint-disable-next-line no-undef
      const response = await fetch(base_url, {
        method: 'post',
        body: form,
      });

      const responseData = await response.json();

      if (responseData.status === true) {
        // alert('Success wallet transaction');
        // alert(responseData.Message);
        onSubmit(data);
        // throw new Error(responseData.Message);
      } else {
        Toast.show(`${responseData.Message}`, Toast.LONG);
      }
    } catch (error) {
      // Alert.alert(error.message);
      console.log(error.Message);
    }
    setLoading(false);
  };

  const PlaceOrder = async () => {
    setLoading(true);
    try {
      let base_url = `${APIURL}/API/placeOrder.php`;

      let form = new FormData();
      form.append(
        'token',
        'as23rlkjadsnlkcj23qkjnfsDKJcnzdfb3353ads54vd3favaeveavgbqaerbVEWDSC',
      );
      form.append('user_id', userDetails?.user_id);
      form.append('Shipping_address', locationData?.Shipping_address);
      form.append('Shipping_address_2', locationData.Shipping_address_2);
      form.append('Shipping_city', locationData?.Shipping_city);
      form.append('Shipping_area', locationData?.Shipping_area);
      form.append('Shipping_state', locationData?.Shipping_state);
      form.append('order_total_price', props.price);

      form.append('payment_type', 'loyalty_cart');

      form.append('payment_status', 'paid');
      form.append('addtional_notes', '');
      form.append('Shipping_postal_code', locationData?.Shipping_postal_code);
      form.append('order_datails', JSON.stringify(CartDetails));

      // eslint-disable-next-line no-undef
      const response = await fetch(base_url, {
        method: 'post',
        body: form,
      });

      const responseData = await response.json();

      if (responseData.status === true) {
        Toast.show(`${responseData.Message}`, Toast.LONG);
        removeItemValue();
      } else {
        Toast.show(`${responseData.Message}`, Toast.LONG);
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const onSubmit = async data => {
    setLoading(true);
    try {
      let base_url = `${APIURL}/API/card_transaction.php`;

      let form = new FormData();
      form.append(
        'token',
        'as23rlkjadsnlkcj23qkjnfsDKJcnzdfb3353ads54vd3favaeveavgbqaerbVEWDSC',
      );
      form.append('card_number', data.card_number);
      form.append('amount', props.price);
      form.append('transaction_id', Math.random() * 100);
      form.append('cvc_code', data.cvc);

      const response = await fetch(base_url, {
        method: 'post',
        body: form,
      });

      const responseData = await response.json();
      // const Success = responseData?.success;
      if (responseData.status === true) {
        // setPaymentData(data);
        setLoading(false);
        // setmodal(false);
        PlaceOrder();
        Toast.show(`${responseData.Message}`, Toast.LONG);
        // setmodal(false);

        // throw new Error(responseData.Message);
      } else {
        Toast.show(`${responseData.Message}`, Toast.LONG);
        setLoading(false);
        // setmodal(false);
      }
    } catch (error) {
      // Alert.alert(error.message);
      setLoading(false);
      // setmodal(false);

      console.log('error', error.Message);
    }
    setLoading(false);
    // setmodal(false);
  };

  return loading ? (
    <Loader />
  ) : (
    <Modal
      isVisible={props.modalVisible}
      onBackButtonPress={props.backButton}
      onBackdropPress={props.onClose}
      style={styles.MainViewModal}
      animationIn="slideInRight"
      animationOut="slideOutLeft"
      animationOutTiming={1000}
      animationInTiming={1000}
      transparent={true}
      hideModalContentWhileAnimating={true}>
      <View style={styles.modalInputsBox}>
        <Text
          style={{
            textAlign: 'center',
            fontSize: 20,
            marginVertical: 40,
            fontWeight: 'bold',
          }}>
          Enter Loyalty Card
        </Text>

        <Input
          name="card_number"
          control={control}
          keyboardType="numeric"
          rules={{
            required: 'Card number cant be empty!',
            minLength: {
              value: 14,
              message: 'Card number too short min length is ',
            },
            maxLength: {
              value: 16,
              message: 'Card number maximum length is 16',
            },
          }}
          maxLength={16}
          onSubmitEditing={() => Shipping_address_2.current.focus()}
          style={{marginHorizontal: 30}}
          placeholder="Card number"
          textStyle={{color: '#000'}}
        />
        {errors.card_number && (
          <Text style={styles.errormessage}>{errors.card_number.message}</Text>
        )}

        <Input
          name="cvc"
          control={control}
          keyboardType="numeric"
          rules={{
            required: 'Cvc cant be empty!',
          }}
          maxLength={3}
          ref={e => (Shipping_postal_code.current = e)}
          onSubmitEditing={handleSubmit(GetPaymentStatus)}
          style={{marginHorizontal: 30}}
          placeholder="Cvc"
          textStyle={{color: '#000'}}
        />
        {errors.cvc && (
          <Text style={styles.errormessage}>{errors.cvc.message}</Text>
        )}
        <CommonButton
          style={{marginTop: 30, marginHorizontal: 70}}
          onPress={handleSubmit(GetPaymentStatus)}
          title="Submit"
        />
      </View>
    </Modal>
  );
};

export default PaymentModal;

const styles = StyleSheet.create({
  MainViewModal: {
    flex: 1,

    justifyContent: 'center',
    margin: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 20,
  },
  modalInputsBox: {
    // flex: 1,
    backgroundColor: 'white',
    paddingVertical: 40,
    // borderRadius: 5,
    borderRadius: 20,
  },
  errormessage: {
    color: '#e93e36',
    marginHorizontal: 30,
    fontSize: 14,
    fontFamily: 'Roboto-Bold',
  },
});
