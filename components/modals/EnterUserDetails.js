import {StyleSheet, Text, View} from 'react-native';
import React, {useContext, useRef, useState} from 'react';
import CommonButton from '../CommonButton';
import Modal from 'react-native-modal';
import Input from '../Input';
import {useForm, Controller} from 'react-hook-form';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AuthContext} from '../../context/Auth';
import DropDownSelector from '../DropDown/DropDownSelector';

const EnterUserDetails = props => {
  const Shipping_address_2 = useRef();
  const Shipping_area = useRef();
  const Shipping_city = useRef();
  const Shipping_state = useRef();
  const Shipping_postal_code = useRef();

  const {
    language,
    addressList,
    setAddressList,
    setModalVisible,
    userDetails,
    selected,
    setSelected,
  } = useContext(AuthContext);

  const {
    control,
    register,
    reset,
    handleSubmit,
    formState: {errors, isValid},
  } = useForm({mode: 'all'});

  const onSubmit = async data => {
    data.Shipping_postal_code = props.gerAreas[selected].value;
    data.price = props.price;
    data.min_order_price = props.gerAreas1[selected].min_order_price;

    addressList.push(data);
    await AsyncStorage.setItem(
      `Address${userDetails.user_id}`,
      JSON.stringify(addressList),
    );

    reset();
    setModalVisible(false);
  };

  return (
    <Modal
      visible={props.modalVisible}
      onBackButtonPress={props.backButton}
      onBackdropPress={props.onClose}
      style={styles.MainViewModal}
      // animationIn="slideInRight"
      // animationOut="slideOutLeft"
      // animationOutTiming={200}
      // animationInTiming={200}
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
          {language.enterYourRequiredDetail}
        </Text>

        <Input
          name="Shipping_address"
          control={control}
          keyboardType="default"
          rules={{
            required: language.shippingAddressIsRequired,
          }}
          onSubmitEditing={() => Shipping_address_2.current.focus()}
          style={{marginHorizontal: 30}}
          placeholder={language.shippingAddress}
          textStyle={{color: '#000'}}
        />
        {errors.Shipping_address && (
          <Text style={styles.errormessage}>
            {errors.Shipping_address.message}
          </Text>
        )}
        <Input
          name="Shipping_address_2"
          control={control}
          keyboardType="default"
          // rules={{
          //   required: 'Shipping address_2 cant be empty!',
          // }}
          ref={e => (Shipping_address_2.current = e)}
          onSubmitEditing={() => Shipping_city.current.focus()}
          style={{marginHorizontal: 30}}
          placeholder={language.shippingAddress2}
          textStyle={{color: '#000'}}
        />
        {/* {errors.Shipping_address_2 && (
          <Text style={styles.errormessage}>
            {errors.Shipping_address_2.message}
          </Text>
        )} */}
        <Input
          name="Shipping_city"
          control={control}
          keyboardType="default"
          rules={{
            required: language.shippingCityIsRequired,
          }}
          ref={e => (Shipping_city.current = e)}
          onSubmitEditing={() => Shipping_area.current.focus()}
          style={{marginHorizontal: 30}}
          placeholder={language.shippingCity}
          textStyle={{color: '#000'}}
        />
        {errors.Shipping_city && (
          <Text style={styles.errormessage}>
            {errors.Shipping_city.message}
          </Text>
        )}
        <Input
          name="Shipping_area"
          control={control}
          keyboardType="default"
          rules={{
            required: language.shippingAreaIsRequired,
          }}
          ref={e => (Shipping_area.current = e)}
          onSubmitEditing={() => Shipping_state.current.focus()}
          style={{marginHorizontal: 30}}
          placeholder={language.shippingArea}
          textStyle={{color: '#000'}}
        />
        {errors.Shipping_area && (
          <Text style={styles.errormessage}>
            {errors.Shipping_area.message}
          </Text>
        )}
        <Input
          name="Shipping_state"
          control={control}
          keyboardType="default"
          rules={{
            required: language.shippingStateIsRequired,
          }}
          ref={e => (Shipping_state.current = e)}
          onSubmitEditing={() => Shipping_postal_code.current.focus()}
          style={{marginHorizontal: 30}}
          placeholder={language.shippingState}
          textStyle={{color: '#000'}}
        />
        {errors.Shipping_state && (
          <Text style={styles.errormessage}>
            {errors.Shipping_state.message}
          </Text>
        )}

        <Controller
          control={control}
          name="postalCode"
          rules={{
            required: 'Postal Code is required',
          }}
          render={({field: {value, onChange}}) => {
            setSelected(value);
            return (
              <DropDownSelector
                setSelected={onChange}
                data={props.gerAreas}
                placeholder={language.shippingPostalCode}
              />
            );
          }}
        />
        {errors.postalCode && (
          <Text style={styles.errormessage}>{errors.postalCode.message}</Text>
        )}

        {/* <DropDownSelector
          setSelected={setSelected}
          data={props.gerAreas}
          placeholder={'Postal Code'}
        /> */}

        <CommonButton
          style={{marginTop: 30, marginHorizontal: 70}}
          onPress={handleSubmit(onSubmit)}
          title={language.submit}
        />
      </View>
    </Modal>
  );
};

export default EnterUserDetails;

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
