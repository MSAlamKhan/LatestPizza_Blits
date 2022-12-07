import React from 'react';
import {StyleSheet, SafeAreaView, Pressable, Image, Text} from 'react-native';
import Modal from 'react-native-modal';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
export function ImagePickerModal({
  isVisible,
  onClose,
  onImageLibraryPress,
  onCameraPress,
}) {
  return (
    <Modal
      visible={isVisible}
      onBackButtonPress={onClose}
      onBackdropPress={onClose}
      style={styles.modal}>
      <SafeAreaView style={styles.buttons}>
        <Pressable style={styles.button} onPress={onImageLibraryPress}>
          <FontAwesome style={styles.buttonIcon} name="picture-o" size={30} />
          <Text style={styles.buttonText}>Library</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={onCameraPress}>
          <Entypo style={styles.buttonIcon} name="camera" size={30} />
          <Text style={styles.buttonText}>camera</Text>
        </Pressable>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
    // paddingVertical: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  buttonIcon: {
    alignSelf: 'center',
  },
  buttons: {
    backgroundColor: 'white',
    flexDirection: 'row',
    paddingVertical: 20,
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 14,

    fontFamily: 'Montserrat-Bold',
    letterSpacing: -0.34,
  },
});
