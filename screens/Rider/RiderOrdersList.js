import React, {useState, useContext, useCallback, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Alert,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
} from 'react-native';
import Colors from '../../constants/Colors';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {AuthContext} from '../../context/Auth';
import {Card} from 'react-native-paper';
import {APIURL} from '../../constants/Url';
import {color} from 'react-native-reanimated';
import Modal from 'react-native-modal';
import Entypo from 'react-native-vector-icons/Entypo';
import CommonButton from '../../components/CommonButton';
import OneSignal from 'react-native-onesignal';
import Loader from '../../components/Animatedfullscreen/Loader';
import LottieView from 'lottie-react-native';
const RiderOrdersList = () => {
  // const {isSignin, setIsSignin, setRole, role} = useContext(AuthContext);
  const item = [
    {
      id: 1,
      name: 'Large pizza',
      addons: [
        {name: 'ketchup', price: 200},
        {name: 'cheeze', price: 150},
      ],
      picture:
        'https://c.ndtvimg.com/2022-03/g7o39j38_pizza_625x300_30_March_22.jpg?im=FaceCrop,algorithm=dnn,width=1200,height=675',
      price: 300,
    },
    {
      id: 2,
      name: 'Small pizza',
      addons: [
        {name: 'ketchup', price: 200},
        {name: 'cheeze', price: 150},
      ],
      picture:
        'https://c.ndtvimg.com/2022-03/g7o39j38_pizza_625x300_30_March_22.jpg?im=FaceCrop,algorithm=dnn,width=1200,height=675',
      price: 100,
    },
  ];
  const {userDetails, isAuthenticated, setIsSignin, isSignin, setRole, role} =
    useContext(AuthContext);
  const [pending, setPending] = useState(true);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [pastOrders, setPastOrders] = useState([]);
  const navigation = useNavigation();
  const [isLoading, setLoading] = useState(false);
  // const [modal, setmodal] = useState(true);
  const [isModalVisible, setModalVisible] = useState(false);
  const [orderData, setOrderData] = useState();
  const [orderProduct, setOrderProduct] = useState([]);

  const toggleModal = async item => {
    setOrderData(item);
    console.log(item?.order_id);
    try {
      let base_url = `${APIURL}/API/riderorderdetails.php`;
      let form = new FormData();
      form.append(
        'token',
        'as23rlkjadsnlkcj23qkjnfsDKJcnzdfb3353ads54vd3favaeveavgbqaerbVEWDSC',
      );

      form.append('order_id', item?.order_id);

      const response = await fetch(base_url, {
        method: 'post',
        body: form,
      });

      const responseData = await response.json();
      const Success = responseData?.success;
console.log('resss===>',responseData);
      if (Success === false) {
        throw new Error(responseData.message);
      } else {
        // setOrderData(responseData.Data);
        // alert(responseData.Message);

        setOrderProduct(responseData.Data);
        setModalVisible(true);
        // setModalVisible();
      }
    } catch (error) {
      Alert.alert(error.message);
    }
    // setOrderData(item)

    // setModalVisible(!isModalVisible)
  };

  const Delivered = async () => {
    // setOrderData([]);
    setLoading(true);
    try {
      let base_url = `${APIURL}/API/updateOrderStatus.php`;
      let form = new FormData();
      form.append(
        'token',
        'as23rlkjadsnlkcj23qkjnfsDKJcnzdfb3353ads54vd3favaeveavgbqaerbVEWDSC',
      );

      form.append('order_id', orderData?.order_id);
      form.append('status', 'delivered');

      const response = await fetch(base_url, {
        method: 'post',
        body: form,
      });

      const responseData = await response.json();
      const Success = responseData?.success;

      if (Success === false) {
        throw new Error(responseData.message);
      } else {
        // setOrderData(responseData.Data);
        alert(responseData.Message);
        getPastOrders();
        getPendingOrders();
        alert(`order resached`);
        // setModalVisible();
      }
    } catch (error) {
      Alert.alert(error.message);
    }
    setModalVisible();
    setLoading(false);
  };

  const OrderComp = props => {
    console.log('asdadas', orderProduct);
    return isSignin ? (
      <>
        <Modal
          visible={isModalVisible}
          onBackButtonPress={() => setModalVisible(false)}
          onBackdropPress={() => setModalVisible(false)}
          style={styles.MainViewModal}
          animationIn="slideInRight"
          animationOut="slideOutLeft"
          animationOutTiming={200}
          animationInTiming={200}
          transparent={true}
          hideModalContentWhileAnimating={true}>
          <View
            style={{
              backgroundColor: Colors.backgroundColor,
              // flex: 1,
              flexDirection: 'column',
              // justifyContent: 'center',
              // marginHorizontal: 10,

              paddingHorizontal: 20,
              paddingVertical: 20,
              borderRadius: 15,
            }}>
            <View style={styles.PaymentStatusContainer}></View>
            <TouchableOpacity
              style={styles.crossButton}
              onPress={() => setModalVisible(false)}>
              <Entypo name="cross" color={'white'} size={20} />
            </TouchableOpacity>
            <View
              style={{
                width: '100%',
                flexDirection: 'row',
                backgroundColor: 'white',
                justifyContent: 'space-between',
                paddingVertical: 10,
                paddingHorizontal: 15,
                borderRadius: 15,
              }}>
              <Text>order ID:{orderProduct[0]?.order_id}</Text>
              <Text style={{color: 'black'}}>
                Payment Status:{orderProduct[0]?.payment_status}
              </Text>
            </View>
            <View
              style={{
                marginTop: 10,
                height: '40%',
              }}>
              <FlatList
                data={orderProduct[0]?.order_detail_data}
                nestedScrollEnabled
                listKey={(item, index) => 'D' + index.toString()}
                keyExtractor={item => item.order_detail_id}
                renderItem={({item}) => {
                  return (
                    <View style={styles.foodContainer}>
                      <View
                        style={{
                          flexDirection: 'row',
                        }}>
                          <View>
                          
                        <Image
                          style={styles.productImage}
                          source={{
                            uri: `${APIURL}/admin_panel/Uploads/${
                              item.deal_id
                                ? item.deal_image
                                : item.product_image
                            }`,
                          }}
                        />
                         <View style={styles.discountContainer}>
          <Text style={styles.discontText}>
            -{' '}
            {item.deal_id
              ? ((100-((item?.deal_cost/item?.deal_price)*100)).toFixed(2))
              : (item.product_discount)}
            %
          </Text>
        </View>
        </View>
                        <View
                          style={{
                            paddingLeft: 6,
                            width: '60%',
                          }}>
                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                              width: '85%',
                            }}>
                            <Text>
                              {item.deal_id
                                ? item?.deal_name
                                : item.product_name}
                            </Text>
                            <Text style={styles.price}>
            € {item.deal_id ? item?.deal_cost : ((item.product_price-((item.product_price*item.product_discount)/100)))}{' '}
            <Text style={styles.actualPrice}>
              {item.deal_id ? item?.deal_price : item.product_price}
            </Text>{' '}
          </Text>
                          </View>
                          <Text>
                            {item.deal_item_title}: {item.product_name}
                          </Text>
                          {item.addons.length > 0 && <Text>Addons</Text>}
                          <View
                            style={{height: item.addons.length == 0 ? 0 : 50}}>
                            <FlatList
                              data={item.addons}
                              listKey={(item, index) => 'D' + index.toString()}
                              keyExtractor={item => item.as_id}
                              renderItem={({item}) => (
                                <>
                                  <View style={styles.addonsContainer}>
                                    <Text style={styles.addonNameText}>
                                      {item.as_name}
                                      {`(x${item.quantity})`}
                                    </Text>
                                    <Text style={styles.addonNameText}>
                                      € {item.as_price}
                                    </Text>
                                  </View>
                                </>
                              )}
                            />
                          </View>
                          <View
                            style={{height: item?.types?.length == 0 ? 0 : 50}}>
                            {item?.types?.length > 0 && <Text>Types</Text>}
                            <FlatList
                              data={item.types}
                              listKey={(item, index) => 'D' + index.toString()}
                              keyExtractor={item => item.ts_id}
                              renderItem={({item}) => (
                                <>
                                  <View style={styles.addonsContainer}>
                                    <Text style={styles.addonNameText}>
                                      {item.type_title}
                                    </Text>
                                  </View>
                                </>
                              )}
                            />
                          </View>
                          <View
                            style={{
                              height: item.dressing.length == 0 ? 0 : 50,
                            }}>
                            {item.dressing.length > 0 && <Text>Dressing</Text>}
                            <FlatList
                              data={item.dressing}
                              listKey={(item, index) => 'D' + index.toString()}
                              keyExtractor={item => item.ds_id}
                              renderItem={({item}) => (
                                <>
                                  <View style={styles.addonsContainer}>
                                    <Text style={styles.addonNameText}>
                                      {item.dressing_title}
                                    </Text>
                                  </View>
                                </>
                              )}
                            />
                          </View>
                        </View>
                        {item.deal_id ? null : (
                          <Text
                            style={{
                              alignSelf: 'center',
                              justifyContent: 'center',
                              width: 55,
                            }}>
                            qty: {item.quantity}
                          </Text>
                        )}
                      </View>
                    </View>
                  );
                }}
              />
            </View>
            <View>
              <Text style={{color: '#000', fontWeight: 'bold', fontSize: 20}}>
                Address :
              </Text>
              <Text style={{color: '#000', fontSize: 16}}>
                {orderData?.address}
              </Text>
            </View>
            <View
              style={{
                marginTop: 10,
              }}>
              <Text style={{color: '#000', fontWeight: 'bold', fontSize: 20}}>
                Order Cost:
              </Text>
              <Text style={{color: '#000', fontSize: 16}}>
                € {orderData?.order_total_price}
              </Text>
              <Text style={{color: '#000', fontWeight: 'bold', fontSize: 20}}>
                Shipping Cost :
              </Text>
              <Text style={{color: '#000', fontSize: 16}}>
                € {parseFloat(orderData?.Shipping_Cost).toFixed(2)}
              </Text>
            </View>
            <View
              style={{
                marginTop: 10,
              }}>
              <Text style={{color: '#000', fontWeight: 'bold', fontSize: 20}}>
                Total Amount :
              </Text>
              <Text style={{color: '#000', fontSize: 16}}>
                €{' '}
                {(
                  parseFloat(orderData?.order_total_price) +
                  parseFloat(orderData?.Shipping_Cost)
                ).toFixed(2)}
              </Text>
            </View>
            {!props.hide && (
              <CommonButton
                onPress={() => Delivered()}
                style={{marginTop: 20}}
                title="Delivered"
              />
            )}
          </View>
        </Modal>
        <View style={styles.productConatiner}>
          <FlatList
            data={props.data}
            ListEmptyComponent={() => {
              return (
                <View>
                  <LottieView
                    style={{
                      width: 200,
                      height: 200,
                      alignSelf: 'center',
                      justifyContent: 'center',
                    }}
                    source={require('../../assets/LootiFile/noorder.json')}
                    autoPlay
                    speed={1}
                  />
                  <Text style={{textAlign: 'center', fontFamily: ''}}>
                    Ops there is noorder
                  </Text>
                </View>
              );
            }}
            keyExtractor={item => item.order_id}
            renderItem={({item}) => {
              return (
                <View style={styles.productInnerContainer}>
                  <Card style={styles.orderContainer}>
                    <TouchableOpacity
                      activeOpacity={0.6}
                      onPress={() => toggleModal(item)}
                      style={styles.orderInnerContainer}>
                      <Text style={styles.orderTitle}>
                        {item.status.charAt(0).toUpperCase() +
                          item.status.slice(1)}
                      </Text>
                      <View style={styles.addressContainer}>
                        <Text style={styles.orderAddress}>
                          <Text style={styles.addressTitle}>
                            Address: {} {}
                          </Text>
                          {item.address}
                        </Text>
                      </View>
                      <View style={styles.priceContainer}>
                        <View
                          style={[
                            styles.priceInnerContainer,
                            {
                              borderRightWidth: 2,
                              borderRightColor: 'black',
                            },
                          ]}>
                          <Text style={styles.addressTitle}>Amount</Text>
                          <Text style={styles.orderAddress}>
                            {item.order_total_price}
                          </Text>
                        </View>
                        <View
                          style={[
                            styles.priceInnerContainer,
                            {
                              borderRightWidth: 2,
                              borderRightColor: 'black',
                            },
                          ]}>
                          <Text style={styles.addressTitle}>Shipping Cost</Text>
                          <Text style={styles.orderAddress}>
                            {parseFloat(item.Shipping_Cost).toFixed(2)}
                          </Text>
                        </View>
                        <View style={styles.priceInnerContainer}>
                          <Text style={styles.addressTitle}>Sub Total</Text>
                          <Text style={styles.orderAddress}>
                            {(
                              parseFloat(item.order_total_price) +
                              parseFloat(item.Shipping_Cost)
                            ).toFixed(2)}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  </Card>
                </View>
              );
            }}
          />
        </View>
      </>
    ) : (
      <View style={styles.container}>
        <Text
          style={{fontSize: 20, alignSelf: 'center', paddingHorizontal: 30}}>
          Sign in to Access Profile and get access for Purchashing in our
          amazing store
        </Text>
        {/* <CommonButton
          onPress={() => {
            navigation.navigate('login');
            setRole(3);
            // setIsSignin(true);
          }}
          style={{marginTop: 20}}
          title="Login as a customer"
        /> */}
        <CommonButton
          onPress={() => {
            navigation.navigate('login');
            setRole(2);
            // setIsSignin(true);
          }}
          style={{marginTop: 20}}
          title="Login"
        />
      </View>
    );
  };

  const getPendingOrders = useCallback(async () => {
    setPendingOrders([]);
    setLoading(true);
    try {
      let base_url = `${APIURL}/API/riderorderslist.php`;
      let form = new FormData();
      form.append(
        'token',
        'as23rlkjadsnlkcj23qkjnfsDKJcnzdfb3353ads54vd3favaeveavgbqaerbVEWDSC',
      );

      // form.append('user_id', userDetails.user_id);
      form.append('status', 'current_orders');
      form.append('user_id', userDetails?.user_id);

      // eslint-disable-next-line no-undef
      const response = await fetch(base_url, {
        method: 'post',
        body: form,
      });

      const responseData = await response.json();
      const Success = responseData?.success;
      console.log('pending', responseData);
      if (Success === false) {
        throw new Error(responseData.message);
      } else {
        setPendingOrders(responseData.Data);
      }
    } catch (error) {
      Alert.alert(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const getPastOrders = async () => {
    setPastOrders([]);
    setLoading(true);
    try {
      let base_url = `${APIURL}/API/riderorderslist.php`;
      let form = new FormData();
      form.append(
        'token',
        'as23rlkjadsnlkcj23qkjnfsDKJcnzdfb3353ads54vd3favaeveavgbqaerbVEWDSC',
      );

      form.append('user_id', userDetails?.user_id);
      form.append('status', 'past_orders');
      // eslint-disable-next-line no-undef
      const response = await fetch(base_url, {
        method: 'post',
        body: form,
      });

      const responseData = await response.json();
      const Success = responseData?.success;
      console.log('pastorder', responseData);
      if (Success === false) {
        throw new Error(responseData.message);
      } else {
        setPastOrders(responseData.Data);
      }
    } catch (error) {
      Alert.alert(error.message);
    }
    setLoading(false);
  };
  userDetails.user_id;
  useFocusEffect(
    useCallback(() => {
      getPendingOrders(), getPastOrders();

      setPending(true);
    }, []),
  );
  useEffect(() => {
    OneSignal.setNotificationWillShowInForegroundHandler(
      notificationReceivedEvent => {
        console.log(
          'OneSignal: notification will show in foreground:',
          notificationReceivedEvent,
        );
        let notification = notificationReceivedEvent.getNotification();
        OneSignal.add;
        getPendingOrders();
        // getPastOrders()
        // setPending(true);

        const data = notification.additionalData;

        // Complete with null means don't show a notification.

        notificationReceivedEvent.complete(notification);
      },
    );
  }, []);

  return isLoading ? (
    <Loader />
  ) : (
    <View style={styles.screen}>
      <View style={styles.productTitleContainer}>
        <View style={styles.mainContainer}>
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => setPending(true)}
            style={styles.innerContainer}>
            <Text style={[styles.productTitle, pending && styles.bottomBorder]}>
              PENDING
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => setPending(false)}
            style={styles.innerContainer}>
            <View>
              <Text
                style={[styles.productTitle, !pending && styles.bottomBorder]}>
                PAST ORDER
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {pending === true ? (
        <OrderComp hide={false} data={pendingOrders} />
      ) : (
        <OrderComp hide={true} data={pastOrders} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  price: {
    fontFamily: 'Roboto-light',
    fontSize: 14,
    color: 'green',
  },
  actualPrice: {
    color: 'red',
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
  },
  discountContainer: {
    backgroundColor: '#fa5252',
    position: 'absolute',
    // alignSelf: 'flex-end',
    right:0,
    // padding: 3,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  discontText: {
    fontFamily: 'Roboto-Regular',
    fontSize: 12,
    color: 'white',
  },
  crossButton: {
    backgroundColor: Colors.buttongrad1,
    right: 0,
    top: -10,
    position: 'absolute',
    padding: 5,
    borderRadius: 100,
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
  productTitleContainer: {
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    paddingLeft: 10,
  },

  mainContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  innerContainer: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  productTitle: {
    fontSize: 14,
    fontFamily: 'OpenSans-Regular',
    color: Colors.backgroundColor,
    textAlign: 'center',
    paddingHorizontal: 5,
    paddingVertical: 5,
  },
  bottomBorder: {
    borderBottomWidth: 4,
    borderColor: Colors.backgroundColor,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  productConatiner: {
    marginTop: 30,
    // paddingHorizontal: 10,
    height: '88%',
    marginVertical: 20,
  },
  MainViewModal: {
    justifyContent: 'center',
    margin: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingHorizontal: 20,
  },
  foodContainer: {
    backgroundColor: 'white',
    marginBottom: 5,
    padding: 5,
  },
  orderContainer: {
    backgroundColor: '#fff',
    // margin: 10,
    padding: 10,
  },
  orderTitle: {
    fontSize: 16,
    fontFamily: 'OpenSans-Bold',
    marginBottom: 5,
  },
  orderInnerContainer: {
    backgroundColor: '#fff',
    // flexDirection: 'row',
    // justifyContent: 'space-between',
  },
  addonsContainer: {
    flexDirection: 'row',

    justifyContent: 'space-between',
  },
  addressContainer: {},
  addressTitle: {
    fontSize: 14,
    fontFamily: 'OpenSans-Bold',
    color: Colors.iconBackground,
  },
  priceContainer: {
    marginTop: 10,
    flexDirection: 'row',
    // alignItems: 'center',
  },
  priceInnerContainer: {
    width: '33%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  orderAddress: {
    fontSize: 14,
    fontFamily: 'OpenSans-Regular',
  },
  productInnerContainer: {
    marginHorizontal: 15,
    marginVertical: 15,
  },
  productImage: {
    width: 70,
    height: 70,
    // borderRadius: 100,
    // alignSelf: 'center',
  },
});

export default RiderOrdersList;
