import React, {useContext} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Dashboard from '../screens/Dashboard';
import LanguageSelection from '../screens/LanguageSelection';
import LoginEmail from '../screens/LoginEmail';
import Categories from '../screens/Categories';
import Notifications from '../screens/Notifications';
import Profile from '../screens/Profile';
import EditProfile from '../screens/EditProfile';
import Tracsactions from '../screens/Tracsactions';
import MyOrderDetails from '../screens/MyOrderDetails';
import Stripe from '../screens/Stripe';
import AccountSetting from '../screens/AccountSetting';
import Cart from '../screens/Cart';
// import ThankYou from '../screens/ThankYou';

import {createNativeStackNavigator} from '@react-navigation/native-stack';
import MyOrders from '../screens/MyOrders';

import LoyaltyCard from '../screens/LoyaltyCard';
import Wallet from '../screens/Wallet';
import Colors from '../constants/Colors';

import SubCategories from '../screens/SubCategories';
import ProductList from '../screens/ProductList';
import ProductVariant from '../screens/ProductVariant';
import ProductVariation from '../screens/ProductVariation';
import ProductDetails from '../screens/ProductDetails';
import Search from '../screens/Search';
import RegisterForm from '../screens/RegisterForm';
import {AuthContext} from '../context/Auth';
import PrivacyPolicy from '../screens/PrivacyPolicy';

import {PaymentMethod} from '../screens/PaymentMethod';
import {Address} from '../screens/Address';
import TermsPrivacy from '../screens/TermsPrivacy';
import OTPScreen from '../screens/OTPScreen';

import RiderProfile from '../screens/Rider/RiderProfile';
import RiderOrdersList from '../screens/Rider/RiderOrdersList';
import ManageAddress from '../screens/ManageAddress';
import ThankYou from '../screens/ThankYou';
import Help from '../screens/Help';
import ReturnPolicy from '../screens/ReturnPolicy';
import ForgotPassowrdEmail from '../screens/ForgotPassowrdEmail';
import NewPassword from '../screens/NewPassword';
import PayWithStripe from '../screens/PayWithStripe';
import DealsDetails from '../screens/DealsDetails';
const Tab = createBottomTabNavigator();
const AuthStack = createNativeStackNavigator();
const AccountStack = createNativeStackNavigator();
const CategoryStack = createNativeStackNavigator();
const CartStack = createNativeStackNavigator();
const DashBoardStack = createNativeStackNavigator();

export const AccountStackNavigator = () => {
  return (
    <AccountStack.Navigator>
      <AccountStack.Screen
        options={{headerShown: false}}
        name="profile"
        component={Profile}
      />
      <AccountStack.Screen
        options={{headerShown: false}}
        name="language"
        component={LanguageSelection}
      />
      <AccountStack.Screen
        options={{headerShown: false}}
        name="search"
        component={Search}
      />
      <AccountStack.Screen
        options={{headerShown: false}}
        name="editProfile"
        component={EditProfile}
      />
      <AccountStack.Screen
        options={{headerShown: false}}
        name="transactions"
        component={Tracsactions}
      />
      <AccountStack.Screen
        options={{headerShown: false}}
        name="myorders"
        component={MyOrders}
      />
      <AccountStack.Screen
        options={{headerShown: false}}
        name="myOrderDetails"
        component={MyOrderDetails}
      />
      <AccountStack.Screen
        options={{headerShown: false}}
        name="wallet"
        component={Wallet}
      />
      <AccountStack.Screen
        options={{headerShown: false}}
        name="stripe"
        component={Stripe}
      />
      <AccountStack.Screen
        options={{headerShown: false}}
        name="loyaltyCard"
        component={LoyaltyCard}
      />

      <AccountStack.Screen
        options={{headerShown: false}}
        name="accountSetting"
        component={AccountSetting}
      />

      <AccountStack.Screen
        options={{headerShown: false}}
        name="terms"
        component={TermsPrivacy}
      />

      <AccountStack.Screen
        options={{headerShown: false}}
        name="addAddress"
        component={ManageAddress}
      />
      <AccountStack.Screen
        options={{headerShown: false}}
        name="productDetail"
        component={ProductDetails}
      />
      <AccountStack.Screen
        options={{headerShown: false}}
        name="help"
        component={Help}
      />
      <AccountStack.Screen
        options={{headerShown: false}}
        name="privacy"
        component={PrivacyPolicy}
      />
      <AccountStack.Screen
        options={{headerShown: false}}
        name="return"
        component={ReturnPolicy}
      />
    </AccountStack.Navigator>
  );
};
export const AuthentificationStackNavigator = () => {
  return (
    <AccountStack.Navigator>
      <AccountStack.Screen
        options={{headerShown: false}}
        name="login"
        component={LoginEmail}
      />
      <AccountStack.Screen
        options={{headerShown: false}}
        name="help"
        component={Help}
      />
      <AccountStack.Screen
        options={{headerShown: false}}
        name="privacy"
        component={PrivacyPolicy}
      />
      <AccountStack.Screen
        options={{headerShown: false}}
        name="return"
        component={ReturnPolicy}
      />
      <AuthStack.Screen
        options={{headerShown: false}}
        name="otp"
        component={OTPScreen}
      />
      <AccountStack.Screen
        options={{headerShown: false}}
        name="registration"
        component={RegisterForm}
      />
      <AccountStack.Screen
        options={{headerShown: false}}
        name="ForgotPassowrdEmail"
        component={ForgotPassowrdEmail}
      />
      <AccountStack.Screen
        options={{headerShown: false}}
        name="NewPassword"
        component={NewPassword}
      />
    </AccountStack.Navigator>
  );
};
export const NotSignInStackNavigator = () => {
  const {role, cart, selectedLanguage} = useContext(AuthContext);
  return (
    <AccountStack.Navigator>
      {/* {!selectedLanguage && (
        <AccountStack.Screen
          options={{headerShown: false}}
          name="language"
          component={LanguageSelection}
        />
      )} */}

      <AccountStack.Screen
        options={{headerShown: false}}
        name="userBottom"
        component={BottomTabNavigator}
      />
      <AccountStack.Screen
        options={{headerShown: false}}
        name="Signin"
        component={AuthentificationStackNavigator}
      />
    </AccountStack.Navigator>
  );
};
export const RiderAccountStackNavigator = () => {
  return (
    <AccountStack.Navigator>
      <AccountStack.Screen
        options={{headerShown: false}}
        name="riderprofile"
        component={RiderProfile}
      />
      {/* <AccountStack.Screen
        options={{headerShown: false}}
        name="riderprofile"
        component={RiderProfile}
      /> */}
      {/* <AccountStack.Screen
        options={{headerShown: false}}
        name="search"
        component={Search}
      /> */}
      <AccountStack.Screen
        options={{headerShown: false}}
        name="editProfile"
        component={EditProfile}
      />
      <AccountStack.Screen
        options={{headerShown: false}}
        name="transactions"
        component={Tracsactions}
      />
      <AccountStack.Screen
        options={{headerShown: false}}
        name="riderorderlist"
        component={RiderOrdersList}
      />
      {/* <AccountStack.Screen
        options={{headerShown: false}}
        name="myOrderDetails"
        component={MyOrderDetails}
      /> */}
      <AccountStack.Screen
        options={{headerShown: false}}
        name="wallet"
        component={Wallet}
      />
      {/* <AccountStack.Screen
        options={{headerShown: false}}
        name="loyaltyCard"
        component={LoyaltyCard}
      />
      <AccountStack.Screen
        options={{headerShown: false}}
        name="referEarn"
        component={ReferEarn}
      /> */}
      <AccountStack.Screen
        options={{headerShown: false}}
        name="accountSetting"
        component={AccountSetting}
      />

      <AccountStack.Screen
        options={{headerShown: false}}
        name="productDetail"
        component={ProductDetails}
      />
    </AccountStack.Navigator>
  );
};
export const CategoryStackNavigator = () => {
  return (
    <CategoryStack.Navigator initialRouteName="categories">
      <CategoryStack.Screen
        options={{headerShown: false}}
        name="categories"
        component={Categories}
      />
      <CategoryStack.Screen
        options={{headerShown: false}}
        name="subCategories"
        component={SubCategories}
      />
      <CategoryStack.Screen
        options={{headerShown: false}}
        name="productList"
        component={ProductList}
      />
        <CategoryStack.Screen
        options={{headerShown: false}}
        name="ProductVariant"
        component={ProductVariant}
      />
      <CategoryStack.Screen
        options={{headerShown: false}}
        name="ProductVariation"
        component={ProductVariation}
      />
      
      <CategoryStack.Screen
        options={{headerShown: false}}
        name="productDetail"
        component={ProductDetails}
      />

      <CategoryStack.Screen
        options={{headerShown: false}}
        name="search"
        component={Search}
      />
    </CategoryStack.Navigator>
  );
};
export const DashBoardStackNavigator = () => {
  return (
    <DashBoardStack.Navigator>
      <DashBoardStack.Screen
        options={{headerShown: false}}
        name="dashboard"
        component={Dashboard}
      />
      <DashBoardStack.Screen
        options={{headerShown: false}}
        name="productList"
        component={ProductList}
      />
      <DashBoardStack.Screen
        options={{headerShown: false}}
        name="ProductVariant"
        component={ProductVariant}
      />
      <DashBoardStack.Screen
        options={{headerShown: false}}
        name="ProductVariation"
        component={ProductVariation}
      />
      <DashBoardStack.Screen
        options={{headerShown: false}}
        name="productDetail"
        component={ProductDetails}
      />
      <DashBoardStack.Screen
        options={{headerShown: false}}
        name="search"
        component={Search}
      />
      <DashBoardStack.Screen
        options={{headerShown: false}}
        name="dealsDetail"
        component={DealsDetails}
      />
    </DashBoardStack.Navigator>
  );
};
export const CartStackNavigator = () => {
  return (
    <CartStack.Navigator>
      <CartStack.Screen
        options={{headerShown: false, tabBarStyle: {display: 'none'}}}
        name="cart"
        component={Cart}
      />
      <CartStack.Screen
        options={{headerShown: false}}
        name="subCategories"
        component={SubCategories}
      />
      <CartStack.Screen
        options={{headerShown: false}}
        name="Address"
        component={Address}
      />
      <CartStack.Screen
        options={{headerShown: false}}
        name="paymentMethod"
        component={PaymentMethod}
      />
      <CartStack.Screen
        options={{headerShown: false, tabBarStyle: {display: 'none'}}}
        name="thankyou"
        component={ThankYou}
      />
      <CartStack.Screen
        options={{headerShown: false, tabBarStyle: {display: 'none'}}}
        name="payWithStripe"
        component={PayWithStripe}
      />
      {/* <CartStack.Screen
        options={{headerShown: false}}
        name="addAddress"
        component={AddAddress}
      /> */}
    </CartStack.Navigator>
  );
};

export const BottomTabNavigator = () => {
  const {cart, language, dealCart} = useContext(AuthContext);

  const defaultTabNavOptions = {
    tabBarStyle: {
      // backgroundColor: 'red',
      height: 62,
      //color you want to change
      paddingBottom: 12,
    },

    tabBarActiveTintColor: Colors.primary,
    tabBarInactiveTintColor: '#aaa',
  };

  return (
    <Tab.Navigator
      initialRouteName="dashboard"
      screenOptions={{...defaultTabNavOptions, unmountOnBlur: true}}>
      <Tab.Screen
        name="dashboardStack"
        component={DashBoardStackNavigator}
        options={{
          headerShown: false,
          tabBarLabel: language?.home,
          tabBarVisible: false,
          tabBarIcon: ({color, size}) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="categoriesStack"
        component={CategoryStackNavigator}
        options={{
          headerShown: false,
          tabBarLabel: language?.categories,
          tabBarIcon: ({color, size}) => (
            <MaterialIcons name="category" color={color} size={size} />
          ),
          // tabBarBadge: 8,
        }}
      />

      <Tab.Screen
        name="Profile"
        component={AccountStackNavigator}
        options={{
          headerShown: false,
          tabBarLabel: language?.profile,
          tabBarIcon: ({color, size}) => (
            <MaterialCommunityIcons name="account" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="cartStack"
        component={CartStackNavigator}
        options={{
          headerShown: false,
          tabBarLabel: language?.cart,
          tabBarIcon: ({color, size}) => (
            <AntDesign name="shoppingcart" color={color} size={size} />
          ),
          tabBarBadge: cart.items.length + dealCart.items.length,
          // tabBarBadge: cart.items.length,
        }}
      />
    </Tab.Navigator>
  );
};
export const UserBottomTabNavigator = () => {
  const {cart, language, dealCart} = useContext(AuthContext);

  const defaultTabNavOptions = {
    tabBarStyle: {
      // backgroundColor: 'red',
      height: 62,
      //color you want to change
      paddingBottom: 12,
    },

    tabBarActiveTintColor: Colors.primary,
    tabBarInactiveTintColor: '#aaa',
  };

  return (
    <Tab.Navigator
      initialRouteName="dashboard"
      screenOptions={{...defaultTabNavOptions, unmountOnBlur: true}}>
      <Tab.Screen
        name="dashboardStack"
        component={DashBoardStackNavigator}
        options={{
          headerShown: false,
          tabBarLabel: language?.home,
          tabBarVisible: false,
          tabBarIcon: ({color, size}) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="categoriesStack"
        component={CategoryStackNavigator}
        options={{
          headerShown: false,
          tabBarLabel: language?.categories,
          tabBarIcon: ({color, size}) => (
            <MaterialIcons name="category" color={color} size={size} />
          ),
          // tabBarBadge: 8,
        }}
      />
      <Tab.Screen
        name="notifications"
        component={Notifications}
        options={{
          headerShown: false,
          tabBarLabel: language?.notifications,
          tabBarIcon: ({color, size}) => (
            <MaterialCommunityIcons name="bell" color={color} size={size} />
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={AccountStackNavigator}
        options={{
          headerShown: false,
          tabBarLabel: language?.profile,
          tabBarIcon: ({color, size}) => (
            <MaterialCommunityIcons name="account" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="cartStack"
        component={CartStackNavigator}
        options={{
          headerShown: false,
          tabBarLabel: language?.cart,
          tabBarIcon: ({color, size}) => (
            <AntDesign name="shoppingcart" color={color} size={size} />
          ),
          tabBarBadge: cart.items.length + dealCart.items.length,
        }}
      />
    </Tab.Navigator>
  );
};
export const RiderBottomTabNavigator = () => {
  const {role, cart, language} = useContext(AuthContext);

  const defaultTabNavOptions = {
    tabBarStyle: {
      // backgroundColor: 'red',
      height: 62,
      //color you want to change
      paddingBottom: 12,
    },
    tabBarActiveTintColor: Colors.primary,
  };
  return (
    <Tab.Navigator
      initialRouteName="dashboard"
      screenOptions={defaultTabNavOptions}>
      {/* <Tab.Screen
        name="dashboard"
        component={Dashboard}
        options={{
          headerShown: false,
          tabBarLabel: 'Home',
          tabBarVisible: false,
          tabBarIcon: ({color, size}) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
        }}
      /> */}
      {/* <Tab.Screen
        name="categoriesStack"
        component={CategoryStackNavigator}
        options={{
          headerShown: false,
          tabBarLabel: 'Categories',
          tabBarIcon: ({color, size}) => (
            <MaterialIcons name="category" color={color} size={size} />
          ),
          // tabBarBadge: 8,
        }}
      /> */}
      {/* <Tab.Screen
        name="notifications"
        component={Notifications}
        options={{
          headerShown: false,
          tabBarLabel: language?.notifications,
          tabBarIcon: ({color, size}) => (
            <MaterialCommunityIcons name="bell" color={color} size={size} />
          ),
        }}
      /> */}
      <Tab.Screen
        name="riderorderlist"
        component={RiderOrdersList}
        options={{
          headerShown: false,
          tabBarLabel: 'My Order',
          tabBarIcon: ({color, size}) => (
            <FontAwesome5 name="shipping-fast" color={color} size={20} />
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={RiderAccountStackNavigator}
        options={{
          headerShown: false,
          tabBarLabel: language?.profile,
          tabBarIcon: ({color, size}) => (
            <MaterialCommunityIcons name="account" color={color} size={size} />
          ),
        }}
      />
      {/* <Tab.Screen
        name="cartStack"
        component={CartStackNavigator}
        options={{
          headerShown: false,
          tabBarLabel: 'Cart',
          tabBarIcon: ({color, size}) => (
            <AntDesign name="shoppingcart" color={color} size={size} />
          ),
          tabBarBadge: cart.items.length,
        }}
      /> */}
    </Tab.Navigator>
  );
};
export const AuthStackNavigator = () => {
  const {selectedLanguage, role} = useContext(AuthContext);

  return (
    <AuthStack.Navigator>
      {/* <AuthStack.Screen
        options={{headerShown: false}}
        name="loginForm"
        component={BottomTabNavigator}
        options={({navigation}) => ({
          headerShown: Platform.OS === 'ios' ? true : false,
          headerTitle: '',
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon name="arrow-back" color={Colors.primary} size={25} />
            </TouchableOpacity>
          ),
        })}
      /> */}
      {/* {/* <AuthStack.Screen
        name="registerForm"
        component={RegisterForm}
        options={{headerShown: false}}
      /> */}
      {/* {!selectedLanguage && (
       
      )} */}
      {/* <AuthStack.Screen
        options={{headerShown: false}}
        name="otp"
        component={LanguageSelection}
      /> */}
      <AuthStack.Screen
        options={{headerShown: false}}
        name="login"
        component={LoginEmail}
      />
      <AuthStack.Screen
        options={{headerShown: false}}
        name="privacy"
        component={PrivacyPolicy}
      />
      <AuthStack.Screen
        options={{headerShown: false}}
        name="registration"
        component={RegisterForm}
      />
      <AuthStack.Screen
        options={{headerShown: false}}
        name="ForgotPassowrdEmail"
        component={ForgotPassowrdEmail}
      />
      <AuthStack.Screen
        options={{headerShown: false}}
        name="NewPassword"
        component={NewPassword}
      />
      <AuthStack.Screen
        options={{headerShown: false}}
        name="otp"
        component={OTPScreen}
      />
      \
      <AuthStack.Screen
        options={{headerShown: false}}
        name="terms"
        component={TermsPrivacy}
      />
      {/* <AuthStack.Screen
        options={{headerShown: false}}
        name="bottomTab"
        component={BottomTabNavigator}
      /> */}
    </AuthStack.Navigator>
  );
};
