import {useNavigation} from '@react-navigation/native';
import React, {useContext} from 'react';
import {View, Text, StyleSheet, StatusBar, ScrollView} from 'react-native';
// import {CreditCardInput} from 'react-native-credit-card-input-plus';

import CommonButton from '../components/CommonButton';
import {APIURL} from '../constants/Url';
import {AuthContext} from '../context/Auth';

import CashLoader from '../components/Animatedfullscreen/CashLoader';
import {Colors} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useForm } from 'react-hook-form';
import Input from '../components/Input';

// create a component
const CURRENCY = 'USD';
var CARD_TOKEN = null;
const STRIPE_PUBLISHABLE_KEY =
  'pk_test_51KsK97HmIepslB4LEJkmrrFr3zQw4CbcrKSxYQuktQVJlgfDyoaBsHok4tuHShl1EHEKc5nsoopEJ56b6iSRgMuD00PdiTFJJ6';
const Secret_key =
  'sk_test_51KsK97HmIepslB4LHRIVngVUWNgBgpLIYGdwTKf5B6ILmoxWjKELhEoQ7n758DAMHXQRgz1FnZrQ8iGXKjUYqSJd005yXMlK04';

async function getCreditCardToken(creditCardData) {
  // console.log('creditCardData ', creditCardData);
  // alert()
  const card = {
    'card[number]': creditCardData.values.number.replace(/ /g, ''),
    'card[exp_month]': creditCardData.values.expiry.split('/')[0],
    'card[exp_year]': creditCardData.values.expiry.split('/')[1],
    'card[cvc]': creditCardData.values.cvc,
  };
  return fetch('https://api.stripe.com/v1/tokens', {
    headers: {
      // Use the correct MIME type for your server
      Accept: 'application/json',
      // Use the correct Content Type to send data to Stripe
      'Content-Type': 'application/x-www-form-urlencoded',
      // Use the Stripe publishable key as Bearer
      Authorization: `Bearer ${STRIPE_PUBLISHABLE_KEY}`,
    },
    // Use a proper HTTP method
    method: 'post',
    // Format the credit card data to a string of key-value pairs
    // divided by &
    body: Object.keys(card)
      .map(key => key + '=' + card[key])
      .join('&'),
  })
    .then(response => response.json())
    .catch(error => console.log(error));
}
/**
 * The method imitates a request to our server.
 *
 * @param creditCardToken
 * @return {Promise<Response>}
 */
function subscribeUser(creditCardToken) {
  return new Promise(resolve => {
    CARD_TOKEN = creditCardToken.id;
    setTimeout(() => {
      resolve({status: true});
    }, 1000);
  });
}

const PayWithStripe = ({route}) => {

  const {amount, locationData, shippingcost, mergedData, additionNotes} =
    route.params;
  const navigation = useNavigation();
  const {userDetails, setCart, setThankyouScreen} = useContext(AuthContext);
  const [CardInput, setCardInput] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [index, setIndex] = React.useState(9999);
  const {
    control,
    handleSubmit,
    watch,
    formState: {errors},
    reset,
  } = useForm({mode: 'all'});
  
  console.log('locationData', locationData);
  console.log(amount + shippingcost);
  const floatamount = parseFloat(amount);
  const removeItemValue = async key => {
    try {
      await AsyncStorage.removeItem('cart');
      setCart({
        items: [],
        totalAmount: 0,
      });
      // navigation.navigate('cart');
      setThankyouScreen(true);
      return true;
    } catch (exception) {
      return false;
    }
  };

  const tranction = async transactionid => {
    console.log(transactionid);
    try {
      let base_url = `${APIURL}/API/transaction.php`;

      let form = new FormData();

      form.append(
        'token',
        'as23rlkjadsnlkcj23qkjnfsDKJcnzdfb3353ads54vd3favaeveavgbqaerbVEWDSC',
      );

      form.append('user_id', userDetails.user_id);
      form.append('amount', amount + shippingcost);
      form.append('transaction_id', transactionid);
      form.append('transaction_type', 'online');
      form.append('gateway', 'stripe');
      form.append(
        'transaction_message',
        `${amount + shippingcost} credit to your account `,
      );

      // eslint-disable-next-line no-undef
      const response = await fetch(base_url, {
        method: 'post',
        body: form,
      });

      const responseData = await response.json();
      console.log(responseData);

      if (responseData.status == true) {
        PlaceOrder();
      } else {
        alert('addsaerror111');
      }
    } catch (error) {
      alert('error:', error);
    }
    setLoading(false);
  };

  const onSubmit = async data => {
    setLoading(true);

    let expDate = data.month + '/' + data.year;
    const values = {
      values: {
        cvc: data.cvc,
        expiry: expDate,
        name: data.Acount,
        number: data.cardNumber
        // number: '4242 4242 4242 4242',
      },
    }

    // if (CardInput.valid == false || typeof CardInput.valid == 'undefined') {
    //   setLoading(false);
    //   alert('Invalid Credit Card');
    //   return false;
    // }

    let creditCardToken;
    try {
      // Create a credit card token
      creditCardToken = await getCreditCardToken(values);
      // console.log("creditCardToken", creditCardToken)
      if (creditCardToken.error) {
        alert('creditCardToken error');
        setLoading(false);
        return;
      }
    } catch (e) {
      setLoading(false);
      console.log('e', e);
      return;
    }
    const {error} = await subscribeUser(creditCardToken);
    if (error) {
      setLoading(false);
      alert(error);
    } else {
      let pament_data = await charges();
      console.log('pament_data', pament_data);
      if (pament_data.status == 'succeeded') {
        // function for succcesss
        try {
          GetPaymentStatus(pament_data.id);
          //   tranction(pament_data.id);
          // await AsyncStorage.setItem(
          //   `${userDetails?.id.toString()}`,
          //   JSON.stringify([CardInput, ...PrevCardsInput]),
          // );
          console.log('asdsad');
        } catch (err) {
          setLoading(false);
          console.log('err ', err);
        }
      } else {
        setLoading(false);
        alert('failed Try again later');
        // setModalVisible(true);
        // setError(pament_data.error.message);
        // setLoading(true);
        // setTimeout(() => {
        //   setLoading(false);
        //   alert('Payment failed');
        // }, 1000);
      }
    }
    // }

    // Send a request to your server with the received credit card token
    // Handle any errors from your server
  };

  const charges = async () => {
    const card = {
      amount: parseInt(amount + shippingcost) * 100,
      currency: CURRENCY,
      source: CARD_TOKEN,
      description: 'PizzaBlitz.inc',
    };
    // console.log('source', card);
    // console.log(
    //   'stripe',
    //   Object.keys(card)
    //     .map(key => key + '=' + card[key])
    //     .join('&'),
    // );
    return fetch('https://api.stripe.com/v1/charges', {
      headers: {
        // Use the correct MIME type for your server
        Accept: 'application/json',
        // Use the correct Content Type to send data to Stripe
        'Content-Type': 'application/x-www-form-urlencoded',
        // Use the Stripe publishable key as Bearer
        Authorization: `Bearer ${Secret_key}`,
      },
      // Use a proper HTTP method
      method: 'post',
      // Format the credit card data to a string of key-value pairs
      // divided by &
      body: Object.keys(card)
        .map(key => key + '=' + card[key])
        .join('&'),
    }).then(response => response.json());
  };

  const _onChange = data => {
    setCardInput(data);
  };
  //ORDER PLACE COMPPLETE API
  const GetPaymentStatus = async paymentid => {
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
        tranction(paymentid);
      } else {
        alert(responseData.Message);
      }
    } catch (error) {
      // Alert.alert(error.message);
      console.log(error.Message);
    }
  };

  // console.log('asd ', locationData);

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
      form.append('Shipping_address_2', locationData?.Shipping_address_2);
      form.append('Shipping_city', locationData?.Shipping_city);
      form.append('Shipping_area', locationData?.Shipping_area);
      form.append('Shipping_state', locationData?.Shipping_state);

      form.append('order_total_price', amount);

      form.append('payment_type', 'online');
      form.append('payment_status', 'paid');

      form.append('addtional_notes', additionNotes);
      form.append('Shipping_cost', shippingcost);
      form.append('Shipping_postal_code', locationData?.Shipping_postal_code);
      form.append('order_datails', JSON.stringify(mergedData));

      // eslint-disable-next-line no-undef
      const response = await fetch(base_url, {
        method: 'post',
        body: form,
      });

      const responseData = await response.json();
      console.log('responseData=======11111>', responseData);
      if (responseData[0].status == true) {
        // alert('Success wallet transaction');
        // alert(responseData.Message);
        removeItemValue();
        // onSubmit();
        // throw new Error(responseData.Message);
      } else {
        console.log('checking bith');
        alert(responseData[0].Message);
      }
    } catch (error) {
      // Alert.alert(error.message);
      console.log('11111', error);
    }
    setLoading(false);
  };

  return loading ? (
    <CashLoader />
  ) : (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Stripe Payment</Text>
      <Text style={styles.amount}>
        Pay:€{(amount + shippingcost).toFixed(2)}
      </Text>
      <StatusBar barStyle="light-content" backgroundColor="#2471A3" />

      <View style={{marginTop: 50}}>
        {/* <CreditCardInput
          inputContainerStyle={styles.inputContainerStyle}
          inputStyle={styles.inputStyle}
          labelStyle={styles.labelStyle}
          validColor="black"
          placeholderColor="#ccc"
          onChange={_onChange}
        /> */}
<View
style={{
  backgroundColor:'#ffffff',
  padding:10,
  marginHorizontal:10,
  borderWidth:1,
  borderColor:"#2b8a3e",
  borderRadius:10
}}
>
        <View style={styles.inputContainer}>
          {/* <Text style={styles.inputTitleText}>Card Number</Text> */}
          <Input
            onFocus={() => {
              setIndex(0);
            }}
            InputContainerStyle={
              index === 0
                ? {borderWidth: 1, borderColor: "white"}
                : {borderWidth: 0}
            }
            control={control}
            name="cardNumber"
            rules={{
              required: 'Card number is required',
              maxLength: {
                value: 16,
                message: '*Please enter valid card number',
              },
            }}
            placeholder="Card Number"
            keyboardType="number-pad"
            placeholderTextColor={'#32323266'}
          />
        </View>
        {/* {errors.cardNumber && <ValidationText text={errors.cardNumber.message} />} */}
        {errors.cardNumber && (
          <Text style={styles.error}>{errors.cardNumber.message} </Text>
        )}
  
        <View
          style={{
            width: '50%',
            marginTop: 10,
            flexDirection: 'row',
            paddingLeft: 20,
          }}>
          <Input
            onFocus={() => {
              setIndex(1);
            }}
            InputContainerStyle={
              index === 1
                ? {borderWidth: 1, borderColor: "white"}
                : {borderWidth: 0}
            }
            control={control}
            name="month"
            rules={{
              required: 'Month is required',
              maxLength: {
                value: 2,
                message: '*Please enter valid month',
              },
            }}
            placeholder="month Date"
            keyboardType="number-pad"
            placeholderTextColor={'#32323266'}
          />
  
          <Input
             style={{
             
              paddingLeft: 50,
            }}
            onFocus={() => {
              setIndex(1);
            }}
            InputContainerStyle={
              index === 1
                ? {borderWidth: 1, borderColor: "white"}
                : {borderWidth: 0}
            }
            control={control}
            name="year"
            rules={{
              required: 'year is required',
              maxLength: {
                value: 2,
                message: '*Please enter valid year',
              },
            }}
            placeholder="Expiry Date"
            keyboardType="number-pad"
            placeholderTextColor={'#32323266'}
          />
        </View>
        {/* {errors.expiry && <ValidationText text={errors.expiry.message} />} */}
        {(errors.year || errors.month) && (
          <Text style={styles.error}>Please enter valid date</Text>
        )}
  
        <View style={styles.inputContainer}>
          <Input
            onFocus={() => {
              setIndex(3);
            }}
            InputContainerStyle={
              index === 3
                ? {borderWidth: 1, borderColor: "white"}
                : {borderWidth: 0}
            }
            control={control}
            name="Acount"
            rules={{
              required: 'Account holder name is required',
            }}
            placeholder="Acount holder"
            placeholderTextColor={'#32323266'}
          />
        </View>
        {/* {errors.Acount && <ValidationText text={errors.Acount.message} />} */}
        {errors.Acount && (
          <Text style={styles.error}>{errors.Acount.message} </Text>
        )}
  
        <View style={styles.inputContainer}>
          <Input
            onFocus={() => {
              setIndex(4);
            }}
            InputContainerStyle={
              index === 4
                ? {borderWidth: 1, borderColor: "white"}
                : {borderWidth: 0}
            }
            control={control}
            name="cvc"
            rules={{
              required: 'CVC is required',
              maxLength: {
                value: 3,
                message: '*Please enter valid CVC number',
              },
            }}
            keyboardType="number-pad"
            placeholder="CVC"
            placeholderTextColor={'#32323266'}
          />
        </View>
        {/* {errors.cvc && <ValidationText text={errors.cvc.message} />} */}
        {errors.cvc && <Text style={styles.error}>{errors.cvc.message} </Text>}
            </View>
        <CommonButton
          style={{marginTop: 30, marginHorizontal: 70}}
          onPress={handleSubmit(onSubmit)}
          title={'Pay'}
        />
      </View>

      {/* <CustomButton
        title="Pay Now"
        style={styles.enabledButton}
        textStyle={styles.enabledButtonText}
        onPress={onSubmit}
      /> */}
    </ScrollView>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#fff',
  },
  error: {
    color: 'red',
    fontSize: 12,
    alignSelf: 'flex-start',
    marginLeft: 25,
    marginTop: 5,
    fontFamily: 'Poppins-SemiBold',
  },
  title: {
    fontFamily: 'Roboto-Bold',
    fontSize: 35,
    alignSelf: 'center',
    color: "red",
    marginTop: 40,
  },
  amount: {
    fontFamily: 'Roboto-Bold',
    fontSize: 20,
    alignSelf: 'center',
    color: "black",
    marginTop: 10,
  },
  ImgStyle: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    borderRadius: 8,
  },
  inputContainer: {
    width: '90%',
    alignSelf: 'center',
    marginTop: 10,
  },
  enabledButton: {
    // backgroundColor: colors.greenbutton,
    marginVertical: 100,
  },
  enabledButtonText: {
    color: 'white',
  },
  button: {
    // backgroundColor: colors.greenbutton,
    width: 150,
    height: 45,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 15,
    color: '#f4f4f4',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  inputContainerStyle: {},
  inputStyle: {
    // paddingLeft: 15,
    // color: 'black',
    // color: colors.textlight2grey,
    fontFamily: 'Montserrat-Bold',
    letterSpacing: -0.34,
    paddingLeft: 15,
    // marginVertical: 10,
    backgroundColor: 'white',
    paddingHorizontal: 10,
    paddingVertical: 0,
    height: 50,
    width: '100%',
    borderRadius: 5,
  },
  labelStyle: {
    // marginBottom: 5,
    fontSize: 12,
    // fontFamily: 'Montserrat-Regular',
    // color: 'black',
    // color: colors.textlight2grey,
    // fontFamily: 'Montserrat-Medium',
    letterSpacing: -0.34,
    paddingLeft: 15,
    paddingHorizontal: 2,
    paddingVertical: 10,
  },
});

//make this component available to the app
export default PayWithStripe;
