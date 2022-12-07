import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  Modal,
  Alert,
  ActivityIndicator,
  FlatList,
  BackgroundImage,
  TouchableOpacity,
} from 'react-native';
import React, { useContext, useState, useCallback, useEffect } from 'react';
import Colors from '../constants/Colors';
import CommonButton from '../components/CommonButton';
import { APIURL } from '../constants/Url';
import { AuthContext } from '../context/Auth';
import Toast from 'react-native-simple-toast';
import { useFocusEffect } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import LottieView from 'lottie-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScrollView } from 'react-native-gesture-handler';
import { Checkbox } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
const ProductDetails = ({ route, navigation }) => {
  const {
    isSignin,
    AddCart,
    RemoveCart,
    cart,
    recentlyView,
    setRecentlyView,
    wishlist,
    setWishlist,
    language,
    userDetails,

    setCart,
  } = useContext(AuthContext);
  const { product } = route.params;

  const productItem = product.item;

  const [productData, setProductData] = useState(productItem);
  const [modalVisible, setModalVisible] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  // const [itemsValue, setItemsValue] = useState({
  //   items: [],
  //   addonstotalAmount: 0,
  // });
  const [selectedItem, setSelectedItem] = useState({
    items: [],
    addonstotalAmount: 0,
  });
  const [selectedDressing, setSelectedDressing] = useState([]);
  const [selectedType, setSelectedType] = useState({});

  useFocusEffect(
    useCallback(() => {
      recentlyViewItem();
    }, []),
  );
  // React.useEffect(
  //   () =>
  //     navigation.addListener('beforeRemove', e => {
  //       // Prevent default behavior of leaving the screen
  //       e.preventDefault();

  //       // Prompt the user before leaving the screen
  //     }),
  //   [navigation],
  // );
  // useFocusEffect(
  //   useCallback(() => {
  //     cart.items.map(item => {
  //       if (item.id === productItem?.id) {
  //         setProductData(item);
  //       }
  //     });
  //   }, [cart, productItem?.id]),
  // );

  // const [productData, setProductData] = useState(productItem);
  const [addons, setaddons] = useState({
    items: [productData?.addons[0]?.ao_data],
    addonstotalAmount: 0,
  });
  console.log('userDetails.user_id', userDetails.user_id);
  const recentlyViewItem = async () => {
    const index = recentlyView.findIndex(item => item === productData.id);
    const userID = userDetails.user_id ? userDetails.user_id : 999999999999;

    if (recentlyView.length < 6) {
      if (index === -1) {
        // make a copy of the index array to mutate
        const updatedItems = [...recentlyView];
        updatedItems.unshift(productData.id);
        const eliminateDuplicate = updatedItems.filter(
          (e, i, a) => a.indexOf(e) === i,
        );
        setRecentlyView(eliminateDuplicate);
        await AsyncStorage.setItem(
          `recentlyView${userID}`,
          JSON.stringify(eliminateDuplicate),
        );
      }
    } else {
      recentlyView.pop();
      const updatedItems = [...recentlyView];
      updatedItems.unshift(productData.id);
      const eliminateDuplicate = updatedItems.filter(
        (e, i, a) => a.indexOf(e) === i,
      );

      setRecentlyView(eliminateDuplicate);
      await AsyncStorage.setItem(
        `recentlyView${userID}`,
        JSON.stringify(eliminateDuplicate),
      );
    }
  };
  const addToWishList = async () => {
    const index = wishlist.findIndex(item => item === productData.id);

    if (index === -1) {
      // make a copy of the index array to mutate
      const updatedItems = [...wishlist];

      updatedItems.push(productData.id);

      AsyncStorage.setItem(
        `wishList${userDetails.user_id}`,
        JSON.stringify(updatedItems),
      );
      Toast.show(`${productData.name} added to wishlist`, Toast.SHORT);
      await setWishlist(updatedItems);
    } else {
      const filterWishlistArray = wishlist.filter(
        item => item !== productData.id,
        Toast.show(`${productData.name} removed from wishlist`, Toast.SHORT),
      );
      await setWishlist(filterWishlistArray);
      AsyncStorage.setItem(
        `wishList${userDetails.user_id}`,
        JSON.stringify(filterWishlistArray),
      );
    }
  };

  ////contexy api

  const AddProduct = () => {
    const productDataArray = [productData];
    console.log('selectedItem', selectedItem);
    const productItem = productDataArray.map(item => ({
      ...item,
      addons: selectedItem.items,
      dressing: selectedDressing,
      type: selectedType,
      totalAddonPrice: selectedItem.addonstotalAmount,
    }));

    if (productData.quantity == productData.qty) {
      Toast.show(
        `Quantity available is ${productData.qty} cannot add more`,
        Toast.LONG,
      );
    } else {
      if (productData.quantity < productData.qty);
      Toast.show(` ${productItem[0].name} added to Cart`, Toast.SHORT);
      // console.log('selected type', selectedType);
      // console.log('productItem', productItem[0]);
      // console.log(cart);
      AddCart(productItem[0]);
      setModalVisible(false);
    }
    // AddCart(productItem[0]);
    // const selectedAddons = productData.addons.filter(item =>
    //   itemsValue.includes(item.id),
    // );

    // const addonsPrice = selectedAddons.map(item =>
    //   parseFloat(item.addon_price),
    // );

    // const totalAddonPrice = addonsPrice.reduce(
    //   (previousValue, currentValue) =>
    //     parseFloat(previousValue) + parseFloat(currentValue),
    //   0,
    // );

    // if (productData.quantity == productData.qty) {
    //   Toast.show(
    //     `Quantity available is ${productData.qty} cannot add more`,
    //     Toast.LONG,
    //   );
    // } else {
    //   if (productData.quantity < productData.qty);
    //   Toast.show(` ${productItem[0].name} added to Cart`, Toast.LONG);
    //   AddCart(productItem[0]);
    // }
  };

  const SelectItemsHandler = addons => {
    const productToAdd = selectedItem.items.find(item => {
      return item.as_id === addons.as_id;
    });

    const productAlreadyAdded = selectedItem.items.includes(productToAdd);

    if (productAlreadyAdded) {
      const updatedItems = selectedItem.items.map(item => {
        if (item.as_id === productToAdd.as_id) {
          return {
            ...item,
            quantity: item.quantity + 1,
            sum: item.sum + parseFloat(addons.as_price),
          };
        }
        return item;
      });

      // eslint-disable-next-line no-unused-vars
      let itemValueDeclared = selectedItem;
      itemValueDeclared = {
        items: updatedItems,
        addonstotalAmount:
          selectedItem.addonstotalAmount + parseFloat(addons.as_price),
      };
      setSelectedItem(itemValueDeclared);
    } else {
      let itemValueDeclared = selectedItem;

      const newItems = itemValueDeclared.items.concat({
        ...addons,
        sum: parseFloat(addons.as_price),
        quantity: 1,
      });

      itemValueDeclared = {
        items: newItems,
        addonstotalAmount:
          selectedItem.addonstotalAmount + parseFloat(addons.as_price),
      };

      setSelectedItem(itemValueDeclared);
    }
  };

  const removeSelectedItems = addon => {
    // console.log(id);

    const filteditem = selectedItem.items.filter(
      item => item.as_id != addon.as_id,
    );

    setSelectedItem(prev => {
      return {
        ...prev,
        items: filteditem,
        addonstotalAmount: selectedItem.addonstotalAmount - addon.sum,
      };
    });
  };
  const selectedTypeMethod = item => {
    if (item.ts_id == selectedType.ts_id) {
      setSelectedType({});
    } else {
      setSelectedType(item);
    }
  };
  const selectedDressingMethod = async item => {
    const isFound = selectedDressing.some(element => {
      if (element.ds_id === item.ds_id) {
        return true;
      }
      return false;
    });
    if (isFound) {
      setSelectedDressing(previousEmployeeData =>
        previousEmployeeData.filter((v, index) => v.ds_id != item.ds_id),
      );
    } else {
      setSelectedDressing(prev => prev.concat(item));
    }
  };

  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View
              style={{
                backgroundColor: Colors.primary,
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'center',

                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
              }}>
              <LottieView
                style={{ width: 90, height: 90, alignSelf: 'center' }}
                source={require('../assets/LootiFile/addToCart.json')}
                autoPlay
                speed={1.5}
              // resizeMode="cover"
              />
            </View>
            <Text
              style={{
                fontSize: 16,
                fontWeight: 'bold',
                paddingTop: 20,
                paddingLeft: 10,
                marginBottom: 5,
              }}>
              {productData?.addons[0]?.ao_title}
            </Text>

            {selectedItem.items.length == 0 ? null : (
              <View
                style={{
                  backgroundColor: '#fff',
                  marginHorizontal: 10,
                  paddingVertical: 5,
                  borderRadius: 10,
                  paddingHorizontal: 5,
                }}>
                <FlatList
                  data={selectedItem.items}
                  horizontal={true}
                  keyExtractor={item => item.as_id}
                  renderItem={({ item, index }) => {
                    return (
                      <View
                        // onPress={() => {
                        //   SelectItemsHandler(item);
                        // }}
                        style={[styles.selectedaddonContainer]}>
                        <View
                          style={{
                            justifyContent: 'space-between',

                            flexDirection: 'row',
                            // width: '100%',
                          }}>
                          <View
                            style={{
                              // justifyContent: 'space-between',
                              flexDirection: 'row',

                              // width: '77%',
                            }}>
                            <Text
                              numberOfLines={1}
                              style={styles.selectedAddonNameText}>
                              {item.as_name}
                            </Text>
                            <Text style={styles.selectedAddonQuantityText}>
                              (x{item.quantity})
                            </Text>
                          </View>

                          <View
                            style={{
                              flexDirection: 'row',
                              paddingLeft: 20,
                            }}>
                            <Text style={styles.addonPriceText}>
                              € {item.sum}
                            </Text>

                            <Entypo
                              name="circle-with-cross"
                              size={18}
                              onPress={() => removeSelectedItems(item)}
                              color={Colors.secondary}
                            />
                          </View>
                        </View>
                      </View>
                    );
                  }}
                />
              </View>
            )}
            {addons?.items[0]?.length > 0 ? (
              <View
                style={{
                  paddingHorizontal: 10,
                  marginTop: 10,
                  height: '25%',
                }}>
                <FlatList
                  data={addons.items[0]}
                  // horizontal={true}

                  key={'_'}
                  numColumns={2}
                  keyExtractor={item => item.as_id}
                  renderItem={({ item, index }) => {
                    return (
                      <TouchableOpacity
                        onPress={() => {
                          SelectItemsHandler(item);
                        }}
                        style={[styles.addonContainer]}>
                        <View
                          style={{
                            justifyContent: 'space-between',
                            flexDirection: 'row',
                            width: '100%',
                          }}>
                          <View
                            style={{
                              // justifyContent: 'space-between',
                              flexDirection: 'row',
                              // width: '80%',
                            }}>
                            <Text
                              numberOfLines={1}
                              style={styles.addonNameText}>
                              {item.as_name}
                            </Text>
                          </View>
                          <Text style={styles.addonPriceText}>
                            € {item.as_price}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    );
                  }}
                />
              </View>
            ) : null}

            {productData?.type.length > 0 ? (
              <View
                style={{
                  paddingHorizontal: 10,
                  marginTop: 10,
                  height: 110,
                }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: 'bold',
                    marginBottom: 5,
                    // paddingTop: 20,
                  }}>
                  {productData?.type[0]?.type_title}
                </Text>

                <FlatList
                  data={productData?.type[0]?.type_data}
                  keyExtractor={item => item.ds_id}
                  key={'_'}
                  numColumns={2}
                  renderItem={({ item, index }) => {
                    return (
                      <TouchableOpacity
                        activeOpacity={0.4}
                        onPress={() => {
                          selectedTypeMethod(item);
                          // SelectItemsHandler(item.id);
                        }}
                        style={[
                          styles.typeContainer,
                          {
                            borderColor:
                              selectedType.ts_id == item.ts_id
                                ? Colors.primary
                                : Colors.grey,
                            borderWidth:
                              selectedType.ts_id == item.ts_id ? 1 : 0,
                          },
                        ]}>
                        {/* <Checkbox
                        status={
                          'check'
                          // itemsValue.includes(item.id) ? 'checked' : 'unchecked'
                        }
                        uncheckedColor="black"
                        color={Colors.primary}
                      /> */}
                        <MaterialCommunityIcons
                          name={
                            selectedType.ts_id == item.ts_id
                              ? 'checkbox-blank-circle'
                              : 'checkbox-blank-circle-outline'
                          }
                          color={
                            selectedType.ts_id == item.ts_id
                              ? Colors.primary
                              : 'black'
                          }
                          size={15}
                        />
                        <View
                          style={{
                            justifyContent: 'space-between',
                            flexDirection: 'row',
                            // backgroundColor: 'blue',
                            width: '80%',
                          }}>
                          <Text
                            numberOfLines={1}
                            style={{
                              fontSize: 13,
                              width: '100%',
                              paddingLeft: 5,
                              // maxWidth: '120%',
                            }}>
                            {item.ts_name}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    );
                  }}
                />
              </View>
            ) : null}
            {productData?.dressing.length > 0 ? (
              <View
                style={{
                  paddingHorizontal: 10,
                  marginTop: 10,
                }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: 'bold',
                    marginBottom: 5,
                    // paddingTop: 20,
                  }}>
                  {productData?.dressing[0]?.dressing_title}
                </Text>

                <FlatList
                  data={productData?.dressing[0]?.dressing_data}
                  keyExtractor={item => item.ds_id}
                  key={'_'}
                  numColumns={2}
                  renderItem={({ item, index }) => {
                    const CheckedDressing = selectedDressing.some(
                      dressing => dressing.ds_id === item.ds_id,
                    );
                    return (
                      <TouchableOpacity
                        onPress={() => {
                          selectedDressingMethod(item);
                          // SelectItemsHandler(item.id);
                        }}
                        style={[
                          styles.typeContainer,
                          {
                            borderColor: CheckedDressing
                              ? Colors.primary
                              : Colors.grey,
                            borderWidth: CheckedDressing ? 1 : 0,
                          },
                        ]}>
                        {/* <Checkbox
                        status={
                          'check'
                          // itemsValue.includes(item.id) ? 'checked' : 'unchecked'
                        }
                        uncheckedColor="black"
                        color={Colors.primary}
                      /> */}
                        <MaterialCommunityIcons
                          name={
                            CheckedDressing
                              ? 'checkbox-blank-circle'
                              : 'checkbox-blank-circle-outline'
                          }
                          color={CheckedDressing ? Colors.primary : 'black'}
                          size={15}
                        />
                        <View
                          style={{
                            justifyContent: 'space-between',
                            flexDirection: 'row',
                            // backgroundColor: 'blue',
                            width: '80%',
                          }}>
                          <Text
                            numberOfLines={1}
                            style={{
                              fontSize: 13,
                              width: '100%',
                              paddingLeft: 5,
                              // maxWidth: '120%',
                            }}>
                            {item.dressing_name}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    );
                  }}
                />
              </View>
            ) : null}
            {selectedItem.addonstotalAmount > 0 && (
              <Text style={styles.totalAmmountText}>
                {language.totalAddonsPrice} :{' '}
                <Text style={styles.ammountText}>
                  € {selectedItem.addonstotalAmount}{' '}
                </Text>
              </Text>
            )}

            <CommonButton
              style={{
                paddingHorizontal: 40,
                // marginTop: 20,
                paddingVertical: 5,
                // borderRadius: 10,
              }}
              onPress={() => AddProduct()}
              title={language.addToCart}
            />
            <CommonButton
              style={{
                paddingHorizontal: 30,
                marginBottom: 20,
                paddingVertical: 5,
              }}
              onPress={() => navigation.navigate('cartStack')}
              title={language.proceedToCheckOut}
            />
            {/* <Text style={{fontSize: 15}}>Product Added To Card</Text> */}
          </View>
        </View>
      </Modal>
      <View style={[styles.header]}>
        <Image
          // resizeMode="cover"
          onLoad={() => {
            setImageLoading(false);
          }}
          style={[
            styles.image,
            {
              // display: imageLoading ? 'none' : 'flex',
            },
          ]}
          resizeMode="cover"
          source={{
            uri: `${APIURL}/admin_panel/Uploads/${productItem?.image}`,
          }}
        />
        <ActivityIndicator
          animating={imageLoading}
          size="large"
          color={'green'}
          style={[{ position: 'absolute' }, styles.image]}
        />
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButtonContainer}>
          <Ionicons
            name="chevron-back-sharp"
            size={30}
            color={'rgba(255,255,255,0.7)'}
          />
        </TouchableOpacity>
        {productItem?.discount == 0 ? null : <View style={styles.discountContainer}>
          <Text style={styles.discontText}>- {productItem?.discount}%</Text>
        </View>}

      </View>
      <View style={styles.lowerlayout}>
        <View style={styles.nameConatiner}>
          <Text style={styles.productName}>{productItem?.name}</Text>
        </View>

        <FontAwesome
          name="heart"
          style={[
            styles.favouriteContainer,
            {
              backgroundColor: wishlist.includes(productData?.id)
                ? '#ffcccc'
                : '#eee',
            },
          ]}
          color={wishlist.includes(productData?.id) ? 'red' : 'grey'}
          size={23}
          onPress={() => {
            isSignin
              ? addToWishList()
              : Toast.show(`Login to add Short List`, Toast.SHORT);
          }}
        />

        <View style={styles.priceContainer}>
          <Text style={styles.productPrice}>
            €{productItem?.price}{' '}
            {productItem?.discount == 0 ? null : <Text style={styles.actualPriceText}>
              {productItem?.actualPrice}
            </Text>}
          </Text>
        </View>
        {/* <View>
          {productData.addons.map(items => {
            return <Text key={items.id}>sdasdasdsadsadsas</Text>;
          })}
        </View> */}

        <ScrollView style={{ height: '70%', marginBottom: 10 }}>
          <Text style={styles.productDescription}>
            {productItem?.description}
          </Text>
        </ScrollView>
        {/* <CommonButton onPress={() => AddProduct} title="Add to Cart" /> */}
      </View>
      <View style={{ flex: 1 }}>
        <CommonButton
          onPress={() => setModalVisible(true)}
          title={language.addToCart}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  //modal
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(52, 52, 52, 0.8)',
  },
  modalView: {
    // backgroundColor: 'gray',
    backgroundColor: Colors.backgroundColor,
    // alignItems: 'center',
    shadowColor: '#000',
    width: '95%',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    borderRadius: 10,
  },
  selectedAddonNameText: {
    fontFamily: 'Roboto-Regular',
    maxWidth: 130,
  },
  selectedAddonQuantityText: {
    fontFamily: 'Roboto-Regular',
    paddingLeft: 5,
  },
  addonNameText: {
    fontFamily: 'Roboto-Regular',
    width: '80%',
  },
  addonQuantityText: {
    fontFamily: 'Roboto-Regular',
    paddingLeft: 10,
  },
  addonPriceText: {
    fontFamily: 'Roboto-Regular',
    // fontSize: 20,
    paddingRight: 6,
  },
  selectedaddonContainer: {
    alignItems: 'center',

    borderRadius: 10,
    backgroundColor: Colors.lightprimary,
    borderWidth: 1,
    // width: 250,
    borderColor: Colors.grey,
    marginHorizontal: 2.5,
    marginBottom: 2,
    paddingHorizontal: 5,
    paddingVertical: 5,
  },
  addonContainer: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 5,
    // borderWidth: 1,
    width: '48%',
    borderColor: Colors.grey,
    marginHorizontal: 2.5,
    marginBottom: 5,
    paddingHorizontal: 5,
    paddingVertical: 5,
  },

  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 5,
    // borderWidth: 1,
    width: '48%',
    borderColor: Colors.grey,
    marginHorizontal: 2.5,
    marginBottom: 5,
    paddingHorizontal: 5,
    paddingVertical: 5,
  },
  totalAmmountText: {
    fontSize: 20,
    alignSelf: 'center',
    fontFamily: 'Roboto-Bold',
    marginVertical: 5,
    // paddingBottom: 5,
  },
  ammountText: {
    color: Colors.primary,
  },

  //screen
  //screen
  //screen
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
  },
  header: {
    flex: 2,
    // backgroundColor:""
    // justifyContent: 'center',
    backgroundColor: '#fff',
    // borderBottomRightRadius: 50,
    // borderBottomLeftRadius: 50,
  },
  image: {
    width: '100%',
    height: '109%',
    // borderRadius: 10,
    // justifyContent: 'center',
    // alignSelf: 'center',
  },
  backButtonContainer: {
    backgroundColor: 'rgba(206, 212, 218,0.6)',
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    // alignSelf: 'flex-end',
    height: 35,
    width: 35,
    top: 10,
    left: 15,
    borderRadius: 5,
  },
  discountContainer: {
    backgroundColor: 'rgba(224, 49, 49,0.75)',
    position: 'absolute',
    // alignSelf: 'flex-end',
    top: 15,
    right: 15,

    paddingHorizontal: 5,
    paddingVertical: 4,
    borderRadius: 5,
  },
  discontText: {
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
    color: 'white',
  },
  lowerlayout: {
    flex: 3,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    backgroundColor: Colors.backgroundColor,
  },
  nameConatiner: {
    paddingHorizontal: 10,
    marginTop: 20,
    alignItems: 'flex-start',
  },

  productName: {
    color: Colors.primary,
    fontSize: 20,
    fontFamily: 'Roboto-Bold',
    width: '92%',
  },
  favouriteContainer: {
    paddingRight: 10,
    paddingLeft: 15,
    paddingTop: 7,
    paddingBottom: 5,
    borderBottomLeftRadius: 20,
    borderTopLeftRadius: 20,
    alignSelf: 'flex-end',
  },
  priceContainer: {
    paddingLeft: 10,
    marginBottom: 10,
  },
  productPrice: {
    fontSize: 15,
    fontFamily: 'Roboto-Regular',
  },
  actualPriceText: {
    color: 'red',
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
  },

  productDescription: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
});
export default ProductDetails;
