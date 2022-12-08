import React, {useContext, useState, useEffect, useCallback} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {
  UserBottomTabNavigator,
  NotSignInStackNavigator,
  RiderBottomTabNavigator,
} from './Navigation';

import {AuthContext} from '../context/Auth';
import OneSignal from 'react-native-onesignal';
import AsyncStorage from '@react-native-async-storage/async-storage';

// import AddPhoneNumber from '../screens/AddPhoneAndEmail';

import ThankYou from '../screens/ThankYou';

const AppNavigationContainer = () => {
  OneSignal.addSubscriptionObserver(async event => {
    console.log('OneSignal: subscription changed to userId:', event.to);
    if (event.to.isSubscribed) {
      const state = await OneSignal.getDeviceState();
      console.log('push Token', state.userId);
      AsyncStorage.setItem('deviceToken', state.userId);
    }
  });
  const {
    getUserDetails,
    setRole,
    setUserData,
    userDetails,
    isSignin,
    thankyouScreen,
  } = useContext(AuthContext);

  const loginStatus = useCallback(async () => {
    try {
      const userdetailasync = await AsyncStorage.getItem('userDetails');
      if (userdetailasync !== null) {
        const parseUserDetail = JSON.parse(userdetailasync);
        setUserData(parseUserDetail);
        setRole(parseInt(parseUserDetail.role_id));
      }
    } catch (e) {
      console.log(e, 'Auth.js');
    }
  }, []);

  useEffect(() => {
    getUserDetails();
    loginStatus();
  }, []);
  console.log('user roleID=====>', userDetails?.role_id);
  return thankyouScreen ? (
    <NavigationContainer>
      <ThankYou />
    </NavigationContainer>
  ) : (
    <NavigationContainer>
      {/* <Stripe /> */}
      {!isSignin && <NotSignInStackNavigator />}
      {isSignin && userDetails?.role_id == 2 && <RiderBottomTabNavigator />}
      {isSignin && userDetails?.role_id == 3 && <UserBottomTabNavigator />}
    </NavigationContainer>
  );
};

export default AppNavigationContainer;
