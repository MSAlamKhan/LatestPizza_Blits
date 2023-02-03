import { useNavigation } from '@react-navigation/native';
import React, { useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  StatusBar,
  ScrollView,
  Modal,
} from 'react-native';


import LottieView from 'lottie-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CommonButton from '../components/CommonButton';
import { APIURL } from '../constants/Url';
import { AuthContext } from '../context/Auth';
import Input from '../components/Input';
import Loader from '../components/Animatedfullscreen/Loader';
import CashLoader from '../components/Animatedfullscreen/CashLoader';
import Toast from 'react-native-simple-toast';
import Colors from '../constants/Colors';

import { CreditCardInput, LiteCreditCardInput } from "../components/react-native-vertical-credit-card-input"


// create a component
const CURRENCY = 'USD';
var CARD_TOKEN = null;
const STRIPE_PUBLISHABLE_KEY =
  'pk_test_51KsK97HmIepslB4LEJkmrrFr3zQw4CbcrKSxYQuktQVJlgfDyoaBsHok4tuHShl1EHEKc5nsoopEJ56b6iSRgMuD00PdiTFJJ6';
const Secret_key =
  'sk_test_51KsK97HmIepslB4LHRIVngVUWNgBgpLIYGdwTKf5B6ILmoxWjKELhEoQ7n758DAMHXQRgz1FnZrQ8iGXKjUYqSJd005yXMlK04';

function getCreditCardToken(creditCardData) {
  // console.log('creditCardData ', creditCardData.values.number);
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
      resolve({ status: true });
    }, 1000);
  });
}

const Stripe = ({ route }) => {
  const { amount } = route.params;
  const navigation = useNavigation();
  const { userDetails } = useContext(AuthContext);
  const [CardInput, setCardInput] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [index, setIndex] = React.useState(9999);

  const tranction = async (user_id, amount) => {
    console.log(userDetails.user_id)
    try {
      let base_url = `${APIURL}/API/transaction.php`;
      let form = new FormData();
      form.append(
        'token',
        'as23rlkjadsnlkcj23qkjnfsDKJcnzdfb3353ads54vd3favaeveavgbqaerbVEWDSC',
      );
      form.append('user_id', userDetails.user_id);
      form.append('amount', amount);
      // form.append('transaction_id', transactionid);
      form.append('gateway', 'stripe');
      form.append('transaction_type', 'credit');
      form.append('transaction_message', `${amount} credit to your account `);

      // eslint-disable-next-line no-undef
      const response = await fetch(base_url, {
        method: 'post',
        body: form,
      });

      const responseData = await response.json();
      console.log('responseeeee', responseData);
      if (responseData.status == true) {
        navigation.goBack();
        Toast.show(` ${amount} has been credited to your account`, Toast.LONG);
      } else {
        alert('addsaerror1111111132321');
      }
    } catch (error) {
      alert(error);
    }
    setLoading(false);
  };

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm({ mode: 'all' });

  const onSubmit = async data => {
    // console.log(data.values , "shoe data")
    setLoading(true);

    // if (CardInput.valid == false || typeof CardInput.valid == 'undefined') {
    //   alert('Invalid Credit Card');
    //   return false;
    // }

    let creditCardToken;
    try {
      // Create a credit card token
      creditCardToken = await getCreditCardToken(data);
      // console.log("creditCardToken", creditCardToken)
      if (creditCardToken.error) {
        alert('creditCardToken error');
        setLoading(false);
        return;
      }
    } catch (e) {
      console.log('e', e);
      setLoading(false);
      return;
    }
    const { error } = await subscribeUser(creditCardToken);
    if (error) {
      alert(error);
      setLoading(false);
    } else {
      let pament_data = await charges();

      // console.log('pament_data ', pament_data);

      if (pament_data.status == 'succeeded') {
        console.log('payment data,', pament_data);
        // Payment(pament_data.id);
        // tranction(pament_data.id);
        tranction(userDetails.user_id, amount);
        setLoading(false);
        navigation.navigate('wallet');
      } else {
        // setModalVisible(true);
        // setError(pament_data.error.message);
        // setLoading(true);
        // setTimeout(() => {
        //   setLoading(false);
        //   alert('Payment failed');
        // }, 1000);
        alert('Payment failed');
        navigation.navigate('wallet');
        setLoading(false);
      }
    }
    setLoading(true);
    // }

    // Send a request to your server with the received credit card token
    // Handle any errors from your server
  };


  const charges = async () => {
    // const card = {
    //   amount: amount * 100,
    //   currency: CURRENCY,
    //   source: CARD_TOKEN,
    //   description: 'PizzaBlitz',
    // };

    const card = {
      amount: parseFloat(amount) * 100,
      currency: CURRENCY,
      source: CARD_TOKEN,
      description: 'PizzaBlitz',
    };

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

  const _onChange = async data => {
    const values = {
      values: {

        cvc: data.values.cvc,
        expiry: data.values.expiry,
        name: data.values.name,
        number: data.values.number
      }
      //number: '4242 4242 4242 4242'
    }

    setCardInput(values);
    // onSubmit(values)
  };
  useEffect(() => {

  }, [])

  return loading ? (
    <CashLoader />
  ) : (
    <ScrollView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2471A3" />
      <View style={{ marginTop: 50 }}>
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>

          <View
            style={{
              marginTop: 20,
              marginHorizontal: 10
            }}
          >
            <CreditCardInput
              requiresName={true}
              cardImageFront={require('../assets/card-front-green.png')}
              cardImageBack={require('../assets/card-back-green.png')}
              inputContainerStyle={styles.inputContainerStyle}
              inputStyle={styles.inputStyle}
              labelStyle={styles.labelStyle}
              validColor="black"
              placeholderColor="#ccc"
              onChange={_onChange} />
          </View>

          <CommonButton
            style={{ marginTop: 30, marginHorizontal: 70 }}
            onPress={() => {
              console.log("All data = == ==>", CardInput)
              if (CardInput != null) {
                onSubmit(CardInput)
              }
            }}
            title={'Pay'}
          />
        </SafeAreaView>
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
  headerText: {
    color: '#000000',
    fontFamily: 'Poppins-Bold',
    textAlign: 'center',
    fontSize: 24,
    textAlignVertical: 'center',
    alignSelf: 'flex-start',
    paddingLeft: 20,
  },
  ImgStyle: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    borderRadius: 8,
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
    placeholderTextColor: 'grey',
    letterSpacing: -0.34,
    paddingLeft: 15,
    paddingHorizontal: 10,
    paddingVertical: 0,
    height: 50,
    width: '100%',
    borderRadius: 5,
  },
  labelStyle: {
    fontSize: 14,
    letterSpacing: -0.34,
    paddingLeft: 15,
    paddingHorizontal: 2,
    paddingVertical: 10,
    color: '#000000',
    fontFamily: 'Poppins-Medium'
  },
  inputContainer: {
    width: '90%',
    alignSelf: 'center',
    marginTop: 10,
  },
  iconButton: {
    alignSelf: 'flex-start',
    marginTop: 20,
    marginLeft: 10,
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
  containerStyle: {
    width: '85%',
    alignSelf: 'center',
    marginTop: 18,
  },
  enabledButtonText: {
    color: 'white',
  },
  error: {
    color: 'red',
    fontSize: 12,
    alignSelf: 'flex-start',
    marginLeft: 25,
    marginTop: 5,
    fontFamily: 'Poppins-SemiBold',
  },

  inputTitleText: {
    color: "black",
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
  },
});

//make this component available to the app
export default Stripe;
