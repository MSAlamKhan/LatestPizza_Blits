import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {WebView} from 'react-native-webview';
const Paypal = () => {
  return (
    <WebView
      source={{
        uri: 'https://www.paypal.com/sdk/js?client-id=AQJndoJxyM7JK7KYQou_zgLpJsUYFUAn-6_Yg5K7R8GI13fC23VIFsU4g75-UdLKk-blMipU7SNakWdK&currency=USD',
      }}
    />
  );
};

export default Paypal;

const styles = StyleSheet.create({});
