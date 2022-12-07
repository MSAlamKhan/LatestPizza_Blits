import React, {useContext} from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import Colors from '../../constants/Colors';
import Modal from 'react-native-modal';
import {useNavigation} from '@react-navigation/native';
import CommonButton from '../CommonButton';
import LottieView from 'lottie-react-native';
import {AuthContext} from '../../context/Auth';
import {AutoSizeText, ResizeTextMode} from 'react-native-auto-size-text';
export function NotificationModal({isVisible, onClose, message, onPress}) {
  const navigation = useNavigation();
  const {language} = useContext(AuthContext);
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onBackButtonPress={onClose}
      onBackdropPress={onClose}
      style={styles.container}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View
            style={{
              backgroundColor: Colors.primary,
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'center',
              // alignItems: 'center',
              // padding: 30,
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
            }}>
            <LottieView
              style={{width: 180, height: 180, alignSelf: 'center'}}
              source={require('../../assets/LootiFile/addToCart.json')}
              autoPlay
              speed={1.5}
              // resizeMode="cover"
            />
          </View>

          {/* <Text
            style={{
              // textAlign: 'center',
              paddingHorizontal: 10,
              fontWeight: '600',
              color: 'black',
              marginTop: 10,
            }}>
            {message}
          </Text> */}
          <AutoSizeText
            style={{
              // textAlign: 'center',
              paddingHorizontal: 10,
              fontWeight: '600',
              color: 'black',
              marginTop: 10,
            }}
            fontSize={32}
            numberOfLines={4}
            mode={ResizeTextMode.max_lines}>
            {message}
          </AutoSizeText>

          <CommonButton
            style={{
              paddingHorizontal: 40,
              marginTop: 20,
              paddingVertical: 5,
              // borderRadius: 10,
            }}
            onPress={() => navigation.navigate('dashboardStack')}
            title={language.continueShopping}
          />
          <CommonButton
            style={{
              paddingHorizontal: 30,
              marginBottom: 20,
              paddingVertical: 5,
            }}
            onPress={onPress}
            title={language.proceedToCheckOut}
          />
          {/* <Text style={{fontSize: 15}}>Product Added To Card</Text> */}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  //modal
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'red',
    // marginHorizontal: 0,
    // backgroundColor: 'tra',
  },
  modalView: {
    // backgroundColor: 'gray',
    backgroundColor: Colors.backgroundColor,
    // alignItems: 'center',
    shadowColor: '#000',
    width: '80%',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    borderRadius: 10,
  },
  //screen
  container: {
    flex: 1,
    justifyContent: 'center',
    margin: 0,
    backgroundColor: 'rgba(0,0,0,0.85)',
  },
});
