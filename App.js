/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
 import 'react-native-gesture-handler';
 import React, {useEffect, useState} from 'react';
 import {Text, View, Image, Platform, StatusBar} from 'react-native';
 import {Provider as PaperProvider} from 'react-native-paper';
 import AppNavigationContainer from './navigation/NavigationContainer';
 import {AuthProvider} from './context/Auth';
 import SplashScreen from 'react-native-splash-screen';
 import AsyncStorage from '@react-native-async-storage/async-storage';
 import OneSignal from 'react-native-onesignal';
 // import {useNavigation, useFocusEffect} from '@react-navigation/native';
 
 const App = () => {
   const [appLoading, setAppLoading] = useState(true);
   useEffect(() => {
    OneSignal.setLogLevel(6, 0);
    OneSignal.setAppId('04869310-bf7c-4e9d-9ec9-faf58aac8168');
    OneSignal.promptForPushNotificationsWithUserResponse(response => {
      console.log('Prompt response:', response);
    });

    OneSignal.setNotificationWillShowInForegroundHandler(
      notificationReceivedEvent => {
        let notification = notificationReceivedEvent.getNotification();
        console.log('notification: ', notification);
        OneSignal.add;
        const data = notification.additionalData;
        console.log('additionalData: ', data);
        notificationReceivedEvent.complete(notification);
      },
    );
    OneSignal.setNotificationOpenedHandler(notification => { });
    OneSignal.addSubscriptionObserver(async event => {
      if (event.to.isSubscribed) {
        const state = await OneSignal.getDeviceState();
        console.log('state.userId=======>', state.userId);
        await AsyncStorage.setItem('onesignaltoken', state.userId);
        console.log('token', state.userId)
      }
    });
  

     
    if (Platform.OS !== 'ios') {
      setTimeout(() => {
        SplashScreen.hide();
      }, 3500);
    } else {
      SplashScreen.hide();
      setTimeout(() => {
        setAppLoading(false);
      }, 3500);
    }
    
   }, []);
 
   return (
     // <Paypal />
     <AuthProvider>
       <PaperProvider>
         <AppNavigationContainer />
       </PaperProvider>
     </AuthProvider>
   );
 };
 
 export default App;


//  04869310-bf7c-4e9d-9ec9-faf58aac8168
// 04869310-bf7c-4e9d-9ec9-faf58aac8168