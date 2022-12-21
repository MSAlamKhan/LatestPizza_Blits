import { StyleSheet, Text, View } from 'react-native';
import React, { useContext } from 'react';
import { WebView } from 'react-native-webview';
import queryString from 'query-string';
import paypalApi from '../apis/paypalApi';
import { AuthContext } from '../context/Auth';
import { APIURL } from '../constants/Url';


const Paypal = ({ navigation, route }) => {

  const { amount, accessToken, url } = route.params;
  const { userDetails, language, paypalToken } = useContext(AuthContext);
  console.log("ZZZZ : ", amount + " " + accessToken);


  const clearPaypalState = () => {
    // setPaypalUrl(null)
    // setAccessToken(null)
    navigation.goBack();
  }

  const onUrlChange = (webviewState) => {
    console.log("webviewStatewebviewState", webviewState)
    if (webviewState.url.includes('https://example.com/cancel')) {
      clearPaypalState()
      return;
    }
    if (webviewState.url.includes('https://example.com/return')) {

      const urlValues = queryString.parseUrl(webviewState.url)
      console.log("my urls value", urlValues)
      const { token } = urlValues.query
      if (!!token) {

        paymentSucess(token)
      }

    }
  }


  const paymentSucess = async (id) => {
    try {
      const res = await paypalApi.capturePayment(id, accessToken)
      console.log("capturePayment res++++", res)
      // alert("Payment sucessfull...!!!")
      // Api for wallet Recharge
      if (res.status == "COMPLETED") {
        tranction(id, amount);
      }
      // tranction(id, amount);

    } catch (error) {
      console.log("error raised in payment capture", error)
    }
  }


  const tranction = async (transactionid, amount) => {

    try {
      let base_url = `${APIURL}/API/transaction.php`;

      let form = new FormData();

      form.append(
        'token',
        'as23rlkjadsnlkcj23qkjnfsDKJcnzdfb3353ads54vd3favaeveavgbqaerbVEWDSC',
      );

      form.append('user_id', userDetails.user_id);
      form.append('amount', amount);
      form.append('transaction_id', transactionid);
      form.append('transaction_type', 'credit');
      form.append('gateway', 'paypal');
      form.append('transaction_message', `${amount} credit to your account `);
      // eslint-disable-next-line no-undef
      const response = await fetch(base_url, {
        method: 'post',
        body: form,
      });

      const responseData = await response.json();
      console.log('tranction', responseData);
      if (responseData.status) {
        clearPaypalState()
      } else {
        alert('try again later');
        clearPaypalState()
      }
    } catch (error) {
      alert('error:', error);
      clearPaypalState()
    }

  };


  return (
    <WebView
      source={{
        uri: url,

      }}
      onNavigationStateChange={onUrlChange}
    />
  );
};

export default Paypal;

const styles = StyleSheet.create({});
