import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
} from 'react-native';
import Colors from '../constants/Colors';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import PaymentModal from '../components/modals/paymentModal';
import { APIURL } from '../constants/Url';
import Loader from '../components/Animatedfullscreen/Loader';
import { AuthContext } from '../context/Auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Zocial from 'react-native-vector-icons/Zocial';
// import {
//   requestOneTimePayment,
//   requestBillingAgreement,
// } from 'react-native-paypal';
import Toast from 'react-native-simple-toast';
import paypalApi from '../apis/paypalApi';


export const PaymentMethod = ({ route }) => {
  const { price, selectPaymentTypes } = route.params;

  const [SelectType, setSelectType] = useState('');
  const [additionNotes, setAdditionNote] = useState('');
  // const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const {
    locationData,
    cart,
    setCart,
    userDetails,

    setModalVisibleLoyal,
    modalVisibleLoyal,
    setThankyouScreen,
    paypalToken,
    language,
    dealCart,
  } = useContext(AuthContext);
  const navigation = useNavigation();
  // const {}

  const paymentMethodsData = [
    {
      name: language.wallet,
      paymentType: 'Wallet',
      IconCategory: Entypo,
      IconName: 'wallet',
      size: 30,
    },
    {
      name: language.loyaltyCard,
      paymentType: 'Loyalty',
      IconCategory: MaterialIcons,
      IconName: 'loyalty',
      size: 30,
    },
    {
      name: language.cashOnDelivery,
      paymentType: 'Cash on delivery',
      IconCategory: MaterialCommunityIcons,
      IconName: 'cash-multiple',
      size: 30,
    },
    {
      name: language.payWithPaypal,
      paymentType: 'Pay with Paypal',
      IconCategory: Entypo,
      IconName: 'paypal',
      size: 30,
    },
    {
      name: language.payWithStripe,
      paymentType: 'Pay with Stripe',
      IconCategory: Zocial,
      IconName: 'stripe',
      size: 30,
    },
  ];

  const removeItemValue = async key => {
    try {
      await AsyncStorage.removeItem('cart');
      setCart({
        items: [],
        totalAmount: 0,
        addonsPrice: 0,
      });
      await AsyncStorage.removeItem('dealcart');
      setCart({
        items: [],
        totalAmount: 0,
        totalAddonsPrice: 0,
      });
      // navigation.replace('thankyou');
      setLoading(false)
      setThankyouScreen(true);
      // navigation.replace( "HomeScreen" )
      // navigation.navigate('cart');
      return true;
    } catch (exception) {
      return false;
    }
  };

  console.log('cart', cart);
  var CartDetails = cart.items.map(
    (e, v) =>
      new Object({
        id: e.id,
        is_deal: 'no',
        deal_id: 'null',
        deal_items: 'null',
        quantity: e.quantity.toString(),
        addons: e.addons,
        types: [e.type],
        dressing: e.dressing,
      }),
  );
  var dealCartDetail = dealCart.items.map(
    (e, v) =>
      new Object({
        deal_id: e.deal_id,
        is_deal: 'yes',
        deal_items: e.deal_items.map(item => ({
          item_id: item.item_id,
          items_products: item.items_products.map(item => ({
            prod_id: item.prod_id,
            addons: item.addons.items,
            types: item.types,
            dressing: item.dressing,
          })),
        })),
      }),
  );
  const mergedData = [...CartDetails, ...dealCartDetail];

  const GetPaymentStatus = async nonce => {
    setLoading(true);
    try {
      let base_url = `${APIURL}/API/getSubscriptionStatus.php`;

      let form = new FormData();
      form.append(
        'token',
        'as23rlkjadsnlkcj23qkjnfsDKJcnzdfb3353ads54vd3favaeveavgbqaerbVEWDSC',
      );
      form.append('user_id', userDetails?.user_id);

      // eslint-disable-next-line no-undef
      const response = await fetch(base_url, {
        method: 'post',
        body: form,
      });

      const responseData = await response.json();

      if (responseData.status === true) {
        // alert('Success wallet transaction');
        // alert(responseData.Message);

        SelectType === 'Cash on delivery' ? PlaceOrder() : onSubmit(nonce);

        // throw new Error(responseData.Message);
      } else {
        Toast.show(responseData.Message, Toast.LONG);
        // console.log('api response=>', responseData);
      }
    } catch (error) {
      // Alert.alert(error.message);
      console.log('status', error.Message);
    }
    // setLoading(false);
  };
  console.log('merged', mergedData);
  console.log('hhha', userDetails?.user_id);
  // console.log('asd ', locationData);
  const shippingcost =
    parseFloat(selectPaymentTypes.min_order_price) > price
      ? selectPaymentTypes.min_order_price - price
      : 0;

  const PlaceOrder = async () => {
    setLoading(true);

    try {
      let base_url = `${APIURL}/API/placeOrder_zee.php`;

      let form = new FormData();
      form.append(
        'token',
        'as23rlkjadsnlkcj23qkjnfsDKJcnzdfb3353ads54vd3favaeveavgbqaerbVEWDSC',
      );
      form.append('user_id', userDetails?.user_id);
      form.append('Shipping_address', locationData?.Shipping_address);
      form.append('Shipping_address_2', locationData.Shipping_address_2);
      form.append('Shipping_city', locationData?.Shipping_city);
      form.append('Shipping_area', locationData?.Shipping_area);
      form.append('Shipping_state', locationData?.Shipping_state);

      form.append('order_total_price', price);
      if (SelectType === 'Cash on delivery') {
        form.append('payment_type', 'cash');
        form.append('payment_status', 'unpaid');
      } else if (SelectType === 'Cash on Paypal') {
        form.append('payment_type', 'Paypal');
        form.append('payment_status', 'paid');
      } else {
        form.append('payment_type', 'wallet');
        form.append('payment_status', 'paid');
      }

      form.append('addtional_notes', additionNotes);
      form.append('Shipping_cost', shippingcost.toFixed(2));
      form.append('Shipping_postal_code', locationData?.Shipping_postal_code);
      form.append('order_datails', JSON.stringify(mergedData));

      // eslint-disable-next-line no-undef
      const response = await fetch(base_url, {
        method: 'post',
        body: form,
      });

      const responseData = await response.json();
      console.log('res', responseData);
      if (responseData[0].status == true) {
        removeItemValue();
      } else {
        alert('showww');
      }
    } catch (error) {
      // Alert.alert(error.message);
      console.log('syntaxxxx', error);
      console.log('Placeorder catch');
    }
    // setLoading(false);
  };

  const onSubmit = async nonce => {
    setLoading(true);
    console.log('tranction id', nonce);
    try {
      let base_url = `${APIURL}/API/transaction.php`;

      let form = new FormData();
      form.append(
        'token',
        'as23rlkjadsnlkcj23qkjnfsDKJcnzdfb3353ads54vd3favaeveavgbqaerbVEWDSC',
      );
      form.append('user_id', userDetails?.user_id);
      form.append('amount', parseFloat(price) + shippingcost);

      form.append('transaction_id', nonce);
      form.append('gateway', SelectType === 'Wallet' ? '' : 'paypal');
      form.append(
        'transaction_type',
        SelectType === 'Wallet' ? 'debit' : 'online',
      );

      form.append(
        'transaction_message',
        `${parseFloat(price) + shippingcost
        } has beed debited from your account `,
      );

      // eslint-disable-next-line no-undef
      const response = await fetch(base_url, {
        method: 'post',
        body: form,
      });
      const responseData = await response.json();
      console.log('sirf rsponse', responseData);

      if (responseData.status === true) {
        PlaceOrder();
      } else {
        alert(responseData.Message);
        console.log('error tranction', responseData.Messag);
        setLoading(false);
      }
    } catch (error) {
      // Alert.alert(error.message);

      alert(error);
      console.log('onsubtmit catch', error);
      setLoading(false);
    }
    // setLoading(false);
  };
  const payWithPaypal = async () => {
    try {
      setLoading(true)
      const token = await paypalApi.generateToken()
      const res = await paypalApi.createOrder(
        token,
        "CAPTURE",
        "Cart Checkout",
        "Payment for your food item(s) through paypal",
        "1",
        "" + (parseFloat(price) + parseFloat(shippingcost)),
        "EUR")
      //  setAccessToken(token)
      console.log("res++++++", res)
      setLoading(false)
      if (!!res?.links) {
        const findUrl = res.links.find(data => data?.rel == "approve")
        // setPaypalUrl(findUrl.href)

        navigation.navigate('paywithpaypal', {
          amount: parseFloat(price),
          shippingcost,
          locationData,
          mergedData,
          additionNotes,
          accessToken: token,
          url: findUrl.href
        });

      }



      // const {nonce, payerId, email, firstName, lastName, phone} =
      //   await requestOneTimePayment(paypalToken, {
      //     amount: price + shippingcost, // required
      //     // any PayPal supported currency (see here: https://developer.paypal.com/docs/integration/direct/rest/currency-codes/#paypal-account-payments)
      //     currency: 'EUR',
      //     // any PayPal supported locale (see here: https://braintree.github.io/braintree_ios/Classes/BTPayPalRequest.html#/c:objc(cs)BTPayPalRequest(py)localeCode)
      //     localeCode: 'en_GB',
      //     shippingAddressRequired: false,
      //     userAction: 'Pay Now', // display 'Pay Now' on the PayPal review page
      //     // one of 'authorize', 'sale', 'order'. defaults to 'authorize'. see details here: https://developer.paypal.com/docs/api/payments/v1/#payment-create-request-body
      //     intent: 'authorize',
      //   });
      // GetPaymentStatus(nonce);
    } catch (e) {
      Toast.show(`${e}`, Toast.LONG);
    }
  };

  const HandlerSubmit = () => {
    if (SelectType === 'Wallet') {
      setModalVisibleLoyal(false);
      GetPaymentStatus('');
    } else if (SelectType === 'Cash on delivery') {
      setModalVisibleLoyal(false);
      GetPaymentStatus(Math.random() * 100);
    } else if (SelectType === 'Pay with Paypal') {
      setModalVisibleLoyal(false);
      payWithPaypal();
    } else if (SelectType === 'Pay with Stripe') {
      setModalVisibleLoyal(false);
      navigation.navigate('payWithStripe', {
        amount: parseFloat(price),
        shippingcost,
        locationData,
        mergedData,
        additionNotes,
      });
    } else {
      alert('Select payment type');
    }
  };
  console.log('addd', additionNotes);

  return loading ? (
    <Loader />
  ) : (
    <View style={{ flex: 1 }}>
      <PaymentModal
        modalVisible={modalVisibleLoyal}
        onClose={() => setModalVisibleLoyal(false)}
        onPress={() => setModalVisibleLoyal(false)}
        backButton={() => setModalVisibleLoyal(false)}
        price={price}
      // modalVisible={false}
      />
      <ScrollView style={{ marginBottom: 80 }}>
        <Text style={[styles.paymentmethod, { paddingHorizontal: 5 }]}>
          {language.paymentMethod}
        </Text>
        <Text style={[styles.paymentmethod, styles.extrapaymentmethod]}>
          {language.ChooseDesiredPaymentMethod}
        </Text>
        {paymentMethodsData.map((item, index) => {
          return (
            <TouchableOpacity
              onPress={() => {
                setSelectType(item.paymentType);
                item.paymentType === 'Loyalty' && setModalVisibleLoyal(true);
              }}
              key={index}
              style={[
                styles.paymentmainView,
                {
                  borderColor:
                    item.paymentType === SelectType
                      ? Colors.primary
                      : '#CCD1D1',
                },
              ]}>
              <item.IconCategory
                style={{ paddingRight: 10 }}
                name={item.IconName}
                size={item.size}
                color={Colors.primary}
              />
              <Text style={styles.paymentpyby}>{item.name}</Text>
            </TouchableOpacity>
          );
        })}
        <TextInput
          multiline={true}
          placeholderTextColor="black"
          textAlignVertical={'top'}
          placeholder={'Additional Notes'}
          style={styles.additionalNoteInput}
          onChangeText={item => setAdditionNote(item)}
        />
      </ScrollView>
      <TouchableOpacity onPress={HandlerSubmit} style={styles.paymentButton}>
        <Text style={styles.paymentButtonText}>{language.placeOrder}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  paymentmainView: {
    borderWidth: 1,
    borderColor: Colors.primary,
    padding: 20,
    marginHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 10,
  },
  paymentmethod: {
    //   borderWidth: 1,
    //   borderColor: Colors.primary,
    padding: 20,
    marginHorizontal: 10,
    fontSize: 20,
    fontFamily: 'Roboto-Bold',
  },
  paymentpyby: {
    color: 'black',
    fontFamily: 'Roboto-Regular',
    fontSize: 15,
  },
  extrapaymentmethod: {
    paddingHorizontal: 5,
    paddingVertical: 0,
    marginBottom: 20,
    fontFamily: 'Roboto-Medium',
    fontSize: 13,
  },
  paymentButton: {
    position: 'absolute',
    //   margin: 16,
    //   right: 10,
    bottom: 0,
    //   borderWidth: 1,
    width: '100%',
    padding: 20,
    backgroundColor: Colors.primary,
  },
  paymentButtonText: {
    textAlign: 'center',
    fontSize: 18,
    fontFamily: 'Roboto-Bold',
    color: 'white',
  },
  additionalNoteInput: {
    backgroundColor: '#fff',
    marginHorizontal: 10,
    borderRadius: 10,
    height: 150,
    padding: 10,
    color: 'black',
  },
});
