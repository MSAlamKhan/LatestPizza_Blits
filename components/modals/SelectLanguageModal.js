import {StyleSheet, Text, View} from 'react-native';
import React, {useContext, useRef} from 'react';
import CommonButton from '../CommonButton';
import Modal from 'react-native-modal';
import Input from '../Input';
import {useForm} from 'react-hook-form';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AuthContext} from '../../context/Auth';
const SelectLanugageModal = props => {
  const {language} = useContext(AuthContext);
  return (
    <Modal
      isVisible={props.modalVisible}
      onBackButtonPress={props.backButton}
      onBackdropPress={props.onClose}
      style={styles.MainViewModal}
      animationIn="slideInRight"
      animationOut="slideOutLeft"
      animationOutTiming={300}
      animationInTiming={300}
      transparent={true}
      hideModalContentWhileAnimating={true}>
      <View style={styles.modalInputsBox}>
        <Text
          style={{
            textAlign: 'center',
            fontSize: 20,
            marginVertical: 10,
            fontWeight: 'bold',
          }}>
          {language.selectLanguage}
        </Text>

        <CommonButton
          style={{marginTop: 30, marginHorizontal: 70}}
          onPress={props.onEnglishPress}
          title={language.english}
        />
        <CommonButton
          style={{marginHorizontal: 70}}
          onPress={props.onHindiPress}
          title={language.german}
        />
      </View>
    </Modal>
  );
};

export default SelectLanugageModal;

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
