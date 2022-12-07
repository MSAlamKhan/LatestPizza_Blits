import React, {useContext} from 'react';
import {View, StyleSheet, Text} from 'react-native';

import Input from '../Input';
import {useForm} from 'react-hook-form';
import Modal from 'react-native-modal';
import {AuthContext} from '../../context/Auth';

import PaypalButton from '../PaypalButton';
import StripeButton from '../StripeButton';
import {useNavigation} from '@react-navigation/native';
// import {
//   requestOneTimePayment,
//   requestBillingAgreement,
// } from 'react-native-paypal';
const AmmoutModal = props => {
  const navigation = useNavigation();

  const {language} = useContext(AuthContext);
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: {errors, isValid},
  } = useForm({mode: 'all'});
  return (
    <Modal
      isVisible={props.isVisible}
      onBackButtonPress={props.onBackButtonPress}
      //   onBackButtonPress={() => setModalVisible(false)}
      onBackdropPress={props.onBackdropPress}
      //   onBackdropPress={() => setModalVisible(false)}
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
          {language.enterYourWalletAmmount}
        </Text>

        <Input
          name="amount"
          control={control}
          keyboardType="numeric"
          rules={{
            required: 'Amount is required',
          }}
          style={{marginHorizontal: 30}}
          placeholder={language.amount}
          textStyle={{color: '#000'}}
        />
        {errors.amount && (
          <Text style={styles.errormessage}>{errors.amount.message}</Text>
        )}
        <StripeButton
          style={{marginTop: 30, marginBottom: 10}}
          onPress={handleSubmit(props.onPressStripe)}
          title={language.payWithStripe}
        />
        <PaypalButton
          style={{marginBottom: 10}}
          onPress={handleSubmit(props.onPressPaypal)}
          title={language.payWithPaypal}
        />
      </View>
    </Modal>
  );
};

export default AmmoutModal;

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
