import React, {useState, useContext, useCallback} from 'react';
import {
  View,
  StyleSheet,
  Alert,
  FlatList,
  ActivityIndicator,
  Text,
  TouchableOpacity,
} from 'react-native';
import Colors from '../constants/Colors';
import {useFocusEffect} from '@react-navigation/native';
import ProductOrders from '../components/ProductOrders';
import {APIURL} from '../constants/Url';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Loader from '../components/Animatedfullscreen/Loader';
import {AuthContext} from '../context/Auth';
const MyOrderDetails = ({route, navigation}) => {
  const {orderId, totalPrice, shippingPrice, order_details_data} = route.params;

  const [isLoading, setLoading] = useState(false);
  const [OrderData, setOrderData] = useState([]);
  const [cost, setCost] = useState('');
  const {language, userDetail} = useContext(AuthContext);

  console.log('orderproduct====>', order_details_data);
  return isLoading ? (
    <View style={styles.activity}>
      <Loader />
    </View>
  ) : (
    <View style={styles.screen}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            flexDirection: 'row',
            alignContent: 'center',
            alignItems: 'center',
          }}>
          <Ionicons
            style={[styles.paymentButtonText, {fontSize: 30}]}
            name="arrow-back-outline"
            color={'white'}
          />
          <Text
            style={{
              marginLeft: 10,
              fontWeight: 'bold',
              color: 'white',
              fontSize: 20,
            }}>
            {language.back}
          </Text>
        </TouchableOpacity>
      </View>
      <View
        style={{
          backgroundColor: 'white',
          marginVertical: 10,
          marginHorizontal: 10,
          borderRadius: 8,
          justifyContent: 'space-between',
        }}>
        <View style={[styles.productConatiner]}>
          <FlatList
            data={order_details_data}
            keyExtractor={item => item.order_detail_id}
            renderItem={({item}) => {
              return (
                <View style={styles.productInnerContainer}>
                  <ProductOrders data={item} totalPrice={totalPrice} />
                </View>
              );
            }}
          />
        </View>
        <View style={styles.bottomBar}>
          <View style={styles.PriceContainer}>
            <Text style={styles.itemTitle}>Shipping Cost: </Text>
            <Text style={styles.itemText}>€ {parseFloat(shippingPrice)}</Text>
          </View>
          <View style={[styles.PriceContainer]}>
            <Text style={styles.itemTitle}>
              Discounted {language.subTotal}:{' '}
            </Text>
            <Text style={styles.itemText}>
              {/* {(
                  totalPrice+shippingPrice
                ).toFixed(2)} */}
              €{' '}
              {(parseFloat(totalPrice) + parseFloat(shippingPrice)).toFixed(2)}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    // paaddingHorizontal: 15,
    // marginVertical: 20,0
    paddingHorizontal: 10,
    paddingVertical: 20,
    // marginBottom: 10,
    backgroundColor: Colors.primary,
  },
  activity: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.backgroundColor,
  },
  screen: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
  },

  productConatiner: {
    marginTop: 20,
    marginHorizontal: 10,
    height: '80%',
    // marginVertical: 20,
  },

  bottomBar: {
    // bottom: 70,

    // alignItems: 'flex-end',
    width: '100%',
    paddingHorizontal: 5,
    // backgroundColor: 'yellow',
    // borderWidth: 1,
    // backgroundColor: 'blue',
  },
  totalContainer: {
    marginHorizontal: 5,
    // marginTop: 20,
    // backgroundColor: 'yellow',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  PriceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemText: {
    fontSize: 14,
    fontFamily: 'OpenSans-Regular',
  },
  itemTitle: {
    fontSize: 14,
    fontFamily: 'OpenSans-Bold',
  },
});

export default MyOrderDetails;
