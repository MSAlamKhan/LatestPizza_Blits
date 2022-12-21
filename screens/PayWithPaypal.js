import { StyleSheet, Text, View } from 'react-native';
import React, { useContext } from 'react';
import { WebView } from 'react-native-webview';
import queryString from 'query-string';
import paypalApi from '../apis/paypalApi';
import { AuthContext } from '../context/Auth';
import { APIURL } from '../constants/Url';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PayWithPaypal = ({ navigation, route }) => {


    const { userDetails, setCart, setThankyouScreen } = useContext(AuthContext);
    const {
        amount,
        shippingcost,
        locationData,
        mergedData,
        additionNotes,
        accessToken,
        url, } = route.params

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
            // Api for wallet Recharge
            if (res.status == "COMPLETED") {
                // tranction(id, amount);
                // clearPaypalState()
                tranction(id)

            }
            // tranction(id, amount);

        } catch (error) {
            console.log("error raised in payment capture", error)
        }
    }


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
            form.append('gateway', 'paypal');
            form.append(
                'transaction_message',
                `${amount + shippingcost} debitted from your account `,
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
                //  clearPaypalState()
            } else {
                alert('addsaerror111');
            }
        } catch (error) {
            alert('error:', error);
        }

    };

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

    const PlaceOrder = async () => {
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

            form.append('order_total_price', amount + shippingcost);

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

    };


    return (
        <WebView
            source={{
                uri: url
            }}
            onNavigationStateChange={onUrlChange}
        />
    )
}

export default PayWithPaypal;