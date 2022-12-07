import {StyleSheet, Text, View} from 'react-native';
import React, {useContext} from 'react';
import CommonButton from '../CommonButton';
import Modal from 'react-native-modal';
import {AuthContext} from '../../context/Auth';
const LoginModal = props => {
  const {language} = useContext(AuthContext);
  return (
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
        <Text style={styles.loginText}>
          {language.loginToAccessThisFeature}
        </Text>
        <CommonButton
          style={{marginTop: 30, marginHorizontal: 70}}
          onPress={props.onPress}
          title={props.title}
        />
      </View>
    </Modal>
  );
};

export default LoginModal;

const styles = StyleSheet.create({
  modalInputsBox: {
    paddingTop: 20,
    // height: 100,
    borderRadius: 20,
    backgroundColor: 'white',
  },
  loginText: {
    textAlign: 'center',
  },
});
