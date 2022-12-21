import React, { useState, useCallback, useContext } from 'react';
import { View, StyleSheet, Text, ImageBackground } from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';
import Colors from '../constants/Colors';
import AuthButton from '../components/AuthButton';
import LinearGradient from 'react-native-linear-gradient';
import LottieView from 'lottie-react-native';
import CommonButton from '../components/CommonButton';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Input from '../components/Input';
import { useForm } from 'react-hook-form';

import { APIURL } from '../constants/Url';
import Toast from 'react-native-simple-toast';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { AuthContext } from '../context/Auth';
import Loader from '../components/Animatedfullscreen/Loader';
import AmmoutModal from '../components/modals/AmmoutModal';
import paypalApi from '../apis/paypalApi';
// import {
//   requestOneTimePayment,
//   requestBillingAgreement,
// } from 'react-native-paypal';
const Wallet = () => {
  const { userDetails, language, paypalToken } = useContext(AuthContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [amount, setAmount] = useState();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState();
  const navigation = useNavigation();

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm({ mode: 'all' });

  const getUserDetail = async () => {
    setLoading(true);
    try {
      let base_url = `${APIURL}/API/getUserDetails.php`;

      let form = new FormData();

      form.append(
        'token',
        'as23rlkjadsnlkcj23qkjnfsDKJcnzdfb3353ads54vd3favaeveavgbqaerbVEWDSC',
      );

      form.append('user_id', userDetails.user_id);

      // eslint-disable-next-line no-undef
      const response = await fetch(base_url, {
        method: 'post',
        body: form,
      });
      const responseData = await response.json();
      if (responseData.status == true) {
        setAmount(responseData.Data.amount);
        setName(responseData.Data.name);
      } else {
        alert('Your account was not found, Please try later.');
      }
    } catch (error) {
      Toast.show(error.message, Toast.LONG);
    }
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      getUserDetail();
    }, []),
  );
  // const tranction = async (transactionid, amount) => {
  //   setLoading(true);
  //   try {
  //     let base_url = `${APIURL}/API/transaction.php`;

  //     let form = new FormData();

  //     form.append(
  //       'token',
  //       'as23rlkjadsnlkcj23qkjnfsDKJcnzdfb3353ads54vd3favaeveavgbqaerbVEWDSC',
  //     );

  //     form.append('user_id', userDetails.user_id);
  //     form.append('amount', amount);
  //     form.append('transaction_id', transactionid);
  //     form.append('transaction_type', 'credit');
  //     form.append('gateway', 'paypal');
  //     form.append('transaction_message', `${amount} credit to your account `);
  //     // eslint-disable-next-line no-undef
  //     const response = await fetch(base_url, {
  //       method: 'post',
  //       body: form,
  //     });

  //     const responseData = await response.json();
  //     console.log('tranction', responseData);
  //     if (responseData.status) {
  //       getUserDetail();
  //     } else {
  //       alert('try again later');
  //     }
  //   } catch (error) {
  //     alert('error:', error);
  //   }
  //   setLoading(false);
  // };
  const stripe = data => {
    setModalVisible(false);
    navigation.navigate('stripe', { amount: data.amount });
  };

  const paypal = async (data) => {
    setModalVisible(false);
    setLoading(true)
    try {
      const token = await paypalApi.generateToken()
      const res = await paypalApi.createOrder(
        token,
        "CAPTURE",
        "Wallet Recharge",
        "Recharge your wallet through paypal",
        "1",
        "" + data.amount,
        "EUR")
      console.log("res++++++", res)
      //  setAccessToken(token)
      setLoading(false)
      if (!!res?.links) {
        const findUrl = res.links.find(data => data?.rel == "approve")
        // setPaypalUrl(findUrl.href)

        navigation.navigate('paypal', {
          amount: data.amount,
          accessToken: token,
          url: findUrl.href
        });

      }

    } catch (error) {
      console.log("error", error)
      setLoading(false)

    }

    //navigation.navigate('paypal', { amount: data.amount });
  };

  // const payWithPaypal = async data => {
  //   setModalVisible(false);
  //   const {nonce, payerId, email, firstName, lastName, phone} =
  //     await requestOneTimePayment(paypalToken, {
  //       amount: data.amount, // required
  //       // any PayPal supported currency (see here: https://developer.paypal.com/docs/integration/direct/rest/currency-codes/#paypal-account-payments)
  //       currency: 'EUR',
  //       merchantAccountId: '79zbsc89qfq2p52p',
  //       // any PayPal supported locale (see here: https://braintree.github.io/braintree_ios/Classes/BTPayPalRequest.html#/c:objc(cs)BTPayPalRequest(py)localeCode)
  //       localeCode: 'en_GB',
  //       shippingAddressRequired: false,
  //       userAction: 'Pay Now', // display 'Pay Now' on the PayPal review page
  //       // one of 'authorize', 'sale', 'order'. defaults to 'authorize'. see details here: https://developer.paypal.com/docs/api/payments/v1/#payment-create-request-body
  //       intent: 'authorize',
  //     });

  //   tranction(nonce, data.amount);
  // };
  return loading ? (
    <Loader />
  ) : (
    <View style={styles.screen}>
      <AmmoutModal
        isVisible={modalVisible}
        onBackButtonPress={() => setModalVisible(false)}
        onBackdropPress={() => setModalVisible(false)}
        onPressStripe={data => stripe(data)}
        onPressPaypal={data => paypal(data)}
      />
      {/* <Modal
        isVisible={modalVisible}
        onBackButtonPress={() => setModalVisible(false)}
        onBackdropPress={() => setModalVisible(false)}
        style={styles.MainViewModal}
        animationIn="slideInRight"
        animationOut="slideOutLeft"
        animationOutTiming={1000}
        animationInTiming={1000}
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
            {language.enterYourWalletAmmount}
          </Text>

          <Input
            name="amount"
            control={control}
            keyboardType="numeric"
            rules={{
              required: 'Amount cant be empty!',
            }}
            style={{marginHorizontal: 30}}
            placeholder={language.amount}
            textStyle={{color: '#000'}}
          />
          {errors.amount && (
            <Text style={styles.errormessage}>{errors.amount.message}</Text>
          )}
          <CommonButton
            style={{marginTop: 30, marginHorizontal: 70}}
            onPress={handleSubmit(onSubmit)}
            title={language.submit}
          />
        </View>
      </Modal> */}
      <View style={styles.upperLayout}>
        <Text style={styles.title}>{language.wallet}</Text>
      </View>
      <View style={styles.lowerLayout}>
        {/* <View style={styles.walletContainer}> */}
        <LinearGradient
          colors={[Colors.buttongrad1, Colors.buttongrad2]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.walletContainer}>
          {/* <ImageBackground
          source={{
            uri: 'https://media.istockphoto.com/photos/purple-defocused-blurred-motion-abstract-background-picture-id1273929462?k=20&m=1273929462&s=612x612&w=0&h=jJ0xkuDVJQMp6YwnAiqbtM8nwid36M97VIFxCP_sKCE=',
          }} */}
          {/* style={styles.walletContainer}> */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingHorizontal: 20,
            }}>
            <Text style={styles.walletTitle}>{language.mrMart}</Text>
            <FontAwesome5 name="store" color={Colors.primary} size={20} />
          </View>

          <Text style={styles.ammountText}> € {amount}</Text>

          <Text style={styles.nameText}>{name}</Text>

          {/* </ImageBackground> */}
        </LinearGradient>
        {/* </View> */}
        <View style={styles.mainBox}>
          <View style={{ marginVertical: 20 }}>
            <LottieView
              style={{ width: 200, height: 200, alignSelf: 'center' }}
              source={require('../assets/LootiFile/Wallet.json')}
              autoPlay
              speed={1}
            // resizeMode="cover"
            />
          </View>
          {/* <StripeProvider
            // publishableKey={publishableKey}
            merchantIdentifier="merchant.identifier">
            <PaymentScreen />
          </StripeProvider> */}
          {userDetails.role_id == 3 && (
            <CommonButton
              onPress={() => setModalVisible(true)}
              title={language.addAmount}
            />
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  //Screeen Style
  screen: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  upperLayout: {
    flex: 1,
    backgroundColor: Colors.primary,
    borderBottomRightRadius: 80,
  },
  title: {
    fontFamily: 'Roboto-Bold',
    fontSize: 18,
    color: Colors.textColor,
    paddingLeft: 20,
    paddingTop: 20,
  },
  lowerLayout: {
    flex: 3,
    backgroundColor: Colors.backgroundColor,
    borderTopLeftRadius: 80,
    // paddingTop: 30,
    // paddingHorizontal: 30,
  },
  ///   Wallet
  walletContainer: {
    marginTop: -80,

    height: 150,
    marginHorizontal: 30,

    borderRadius: 20,
    // alignItems: 'center',
    justifyContent: 'space-around',
  },
  walletTitle: {
    fontSize: 20,
    color: Colors.primary,
  },
  nameText: {
    color: Colors.backgroundColor,
    fontSize: 20,
    alignSelf: 'center',
    // paddingLeft: 20,
  },
  ammountText: {
    color: '#ffff',
    fontSize: 30,
    alignSelf: 'center',
  },
  cardNumberText: {
    color: Colors.primary,
    fontSize: 22,
    alignSelf: 'center',
    // paddingLeft: 20,
  },
  mainBox: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginHorizontal: 15,
    marginVertical: 60,
  },
});

export default Wallet;
