import React, { useCallback, useContext, useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  ScrollView,
  addons,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '../constants/Colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import { AuthContext } from '../context/Auth';
import LottieView from 'lottie-react-native';

import { useFocusEffect, useNavigation } from '@react-navigation/native';

import CommonButton from '../components/CommonButton';
import { APIURL } from '../constants/Url';
import EnterUserDetails from '../components/modals/EnterUserDetails';
import LoginModal from '../components/modals/LoginModal';
import DealsCartContainer from '../components/DealsCartContainer';
const ProductContainer = props => {
  const [productData, setProductData] = useState(props.data);
  const {
    AddCart,
    RemoveCart,
    cart,
    setCart,
    isSignin,
    setIsSignin,
    userDetails,
  } = useContext(AuthContext);



  useFocusEffect(
    useCallback(() => {
      setProductData(cart);
    }, [cart]),
  );
  const incrementQuanity = async index => {
    const product = productData.items[index];

    product.quantity == product.qty &&
    alert(`Quantity available is ${product.qty}`);
    if (product.quantity < product.qty) {
      AddCart(product);

      setProductData(cart);
    }
  };

  const decrementQuanity = async index => {
    const product = productData.items[index];
    RemoveCart(product, index);
    setProductData(cart);

    // setProductData(cart);
  };

  const { language } = useContext(AuthContext);

  return productData.items.map((item, index) => {
    return (
      <View key={index} style={styles.productContainer}>
        <View style={{ flexDirection: 'row' }}>
          <View>
            <Image
              resizeMode="cover"
              style={styles.image}
              source={{ uri: `${APIURL}/admin_panel/Uploads/${item.image}` }}
            />
            <View style={styles.discountContainer}>
              <Text style={styles.discontText}>- {item.discount}%</Text>
            </View>
          </View>
          <View
            style={{
              marginLeft: 10,
              // paddingLeft: 10,
              alignSelf: 'center',
              width: '53%',
            }}>
            <Text style={styles.itemTitle}>{item.name}</Text>
            {/* <Text style={styles.itemTitle}>samsung 60 inch tv </Text> */}
            <View style={{ flexDirection: 'row' }}>
              <Text style={styles.itemPrice}>€{item.price} </Text>
              <Text style={styles.itemOff}>
                <Text
                  style={{
                    color: Colors.textLighestGrey,
                    textDecorationLine: 'line-through',
                    textDecorationStyle: 'solid',
                  }}>
                  {item.actualPrice}{' '}
                </Text>
              </Text>
            </View>

            {item.addons.length == 0 ? null : (
              <ScrollView nestedScrollEnabled={true} style={{ maxHeight: 40 }}>
                {item.addons.map((item, index) => {
                  return (
                    <View style={styles.addonsContainer} key={index}>
                      <Text
                        style={{
                          color: 'black',
                          width: '65%',
                          // backgroundColor: 'pink',
                        }}>
                        {item.as_name}
                      </Text>
                      <Text style={{ color: 'black' }}>x{item.quantity}</Text>

                      <Text>€ {item.sum}</Text>
                    </View>
                  );
                })}
              </ScrollView>
            )}
            {item.dressing.length == 0 ? null : (
              <>
                <Text>{language.dressing}</Text>
                <ScrollView nestedScrollEnabled={true} style={{ maxHeight: 40 }}>
                  {item.dressing.map((item, index) => {
                    return (
                      <View style={styles.dressingContainer} key={index}>
                        <Text
                          style={{
                            color: 'black',
                            width: '65%',
                            // backgroundColor: 'pink',
                          }}>
                          {item.dressing_name}
                        </Text>
                        {/* <Text style={{color: 'black'}}>x{item.quantity}</Text> */}
                      </View>
                    );
                  })}
                </ScrollView>
              </>
            )}
            {/* {item.type[0].length == 0 ? null : (
              <>
                <Text>{language.type}</Text>
                <Text>{item?.type[0]?.ts_name}</Text>
              </>
            )} */}
            {item?.type?.ts_name ? <Text>{language.type}</Text> : null}
            {item?.type?.ts_name ? <Text>{item?.type?.ts_name}</Text> : null}
          </View>
        </View>
        <View>
          <View style={styles.quantityContainer}>
            <TouchableOpacity
              onPress={() => {
                decrementQuanity(index);
              }}>
              <Entypo name="minus" size={20} />
            </TouchableOpacity>
            <View style={styles.numberContainer}>
              <Text style={styles.numberText}>{item.quantity}</Text>
            </View>
            <TouchableOpacity onPress={() => incrementQuanity(index)}>
              <Entypo name="plus" size={20} />
            </TouchableOpacity>
          </View>
          <Text style={{ textAlign: 'center' }}>€{item.sum}</Text>
        </View>
      </View>
    );
  });
};

const Cart = () => {
  const { cart, isSignin, setTotalPayment, language, setCardDetail, dealCart } =
    useContext(AuthContext);
  const [loginModal, setLoginModal] = useState(false);
  const [userDetailsForm, setUserDetailsForm] = useState(false);
  const navigation = useNavigation();
  const modalHandler = () => {
    // setLoginModal(true);
    // isSignin === false && alert('login to acccess to this feature ');
    if (isSignin) {
      navigation.navigate('Address', {
        price: (
          parseFloat(cart.totalAmount) + parseFloat(dealCart.totalAmount)
        ).toFixed(2),
      });
      setLoginModal(false);
    } else {
      setLoginModal(true);
    }
  };

  return (
    <View style={styles.container}>
      <LoginModal
        modalVisible={loginModal}
        onClose={() => setLoginModal(false)}
        onPress={() => {
          navigation.navigate('Profile');
          setLoginModal(false);
        }}
        backButton={() => setLoginModal(false)}
        title={language.signin}
      />
      <View style={styles.upperLayout}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>{language.yourCart}</Text>
          {/* <Ionicons name="search" size={20} /> */}
        </View>
      </View>
      {cart.items.length + dealCart.items.length == 0 ? (
        <View
          style={{
            height: '90%',
            justifyContent: 'center',
            backgroundColor: Colors.backgroundColor,
          }}>
          <LottieView
            style={{
              width: 200,
              height: 200,
              alignSelf: 'center',
              marginTop: '-10%',
              // justifyContent: 'center',
              // flex: 1,
            }}
            source={require('../assets/LootiFile/empty.json')}
            autoPlay
            speed={1}
          // resizeMode="cover"
          />
          <Text style={styles.cartEmptyText}>{language.cartIsEmpty}</Text>
        </View>
      ) : (
        <>
          <View style={styles.lowerLayout}>
            <View style={{ marginVertical: 2 }}></View>
            <ScrollView>
              <View style={{ paddingBottom: 10 }}>
                <ProductContainer data={cart} />
              </View>

              <View style={{ paddingBottom: 10 }}>
                <DealsCartContainer data={dealCart} />
              </View>
            </ScrollView>
            <View>
              <Text style={styles.totalAmmountText}>
                {language.totalAmount} :{' '}
                <Text style={styles.ammountText}>
                  €{' '}
                  {(
                    parseFloat(cart.totalAmount) +
                    parseFloat(dealCart.totalAmount)
                  ).toFixed(2)}{' '}
                </Text>
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => {
              setTotalPayment(cart.totalAmount);
              setCardDetail(cart);
            }}>
            <CommonButton
              onPress={() => { modalHandler() }}
              style={{ marginTop: 20 }}
              title={language.proceedToCheckOut}
            />
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  discountContainer: {
    backgroundColor: '#fa5252',
    position: 'absolute',
    alignSelf: 'flex-end',
    // padding: 3,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  discontText: {
    fontFamily: 'Roboto-Regular',
    fontSize: 12,
    color: 'white',
  },
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  upperLayout: {
    height: 90,
    // alignItems: 'center',
    justifyContent: 'center',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontFamily: 'Roboto-Bold',
    fontSize: 18,
    color: Colors.textColor,
    // paddingLeft: 20,
    // paddingTop: 20,
  },
  lowerLayout: {
    backgroundColor: Colors.backgroundColor,
    flex: 1,
    // marginTop: 10,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    // paddingTop: 30,
    // paddingHorizontal: 30,
  },
  cartEmptyText: {
    alignSelf: 'center',
    color: 'green',
    fontSize: 30,
  },
  productContainer: {
    width: '90%',
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'center',
    alignItems: 'center',
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  image: {
    height: 80,
    width: 80,
    // borderRadius: 100,
    alignSelf: 'center',
    borderWidth: 0.1,
    borderColor: 'black',
    // backgroundColor: 'yellow',
  },
  itemTitle: {
    fontFamily: 'Roboto-Bold',
    // flexWrap: 'wrap',
  },
  itemPrice: {
    color: 'green',
    fontFamily: 'Roboto-Regular',
  },
  itemOff: {
    color: 'green',
    fontFamily: 'Roboto-Regular',
  },
  addonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dressingContainer: { flexDirection: 'row' },

  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  numberContainer: {
    borderWidth: 1,
    paddingHorizontal: 2,
    paddingVertical: 1,
  },
  numberText: {
    fontSize: 10,
  },
  totalAmmountText: {
    fontSize: 20,
    alignSelf: 'center',
    fontFamily: 'Roboto-Bold',
    paddingBottom: 5,
  },
  ammountText: {
    color: Colors.primary,
  },
});

export default Cart;