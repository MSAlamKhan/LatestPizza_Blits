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
 
 // import {useNavigation, useFocusEffect} from '@react-navigation/native';
 
 const App = () => {
   // const navigation = useNavigation();
 
   const [appLoading, setAppLoading] = useState(true);
   
   useEffect(() => {
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
 