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
import DropDownPicker from 'react-native-dropdown-picker';
import SelectDealsModal from '../components/modals/SelectDeals';
import { clockRunning } from 'react-native-reanimated';
const ProductDetails = ({ route, navigation }) => {
  const {
    isSignin,

    wishlist,

    language,
    dealCart,
    setDealCart,
  } = useContext(AuthContext);
  const { product } = route.params;

  console.log(product)

  const productItem = product.item;

  const [productModal, setProductModal] = useState(false);
  const [itemsProducts, setItemsProducts] = useState();
  const [imageLoading, setImageLoading] = useState(true);
  const [selectItemProduct, setSelectItemProduct] = useState([]);
  const [allSelectedCategories, setallSelectedCategories] = useState([]);
  const [addonsPrice, setAddonsPrice] = useState(0);
  const modalHandler = (item, index, productitem) => {
    // console.log(item, index);
    const arrayItem = [item];
    const selectWithIndex = arrayItem.map(item => ({
      ...item,
      index: index,
      numberOfFreeitems: productitem.num_of_free_items,
    }));

    const sameIndex = selectItemProduct.some(element => {
      if (element.index == index) {
        return true;
      } else {
        return false;
      }
    });

    if (sameIndex) {
      const filteredData = selectItemProduct.filter(
        (v, indexdata) => v.index != index,
      );
      const concatedData = filteredData.concat(selectWithIndex);
      var sortable = concatedData.slice(0);
      sortable.sort(function (a, b) {
        return a.index - b.index;
      });

      setProductModal(true);
      setSelectItemProduct(sortable);

      setItemsProducts(...selectWithIndex);
    } else {
      setSelectItemProduct(prev => prev.concat(selectWithIndex));
      setProductModal(true);
      setItemsProducts(...selectWithIndex);
    }
  };

  const get = (
    selectedAddons,
    selectedType,
    selectedDressing,
    addonstotalAmount,
    index,
  ) => {
    const allSelectedItems = [
      {
        selectedAddons: selectedAddons,
        selectedType,
        selectedDressing,
        index,
      },
    ];
    const isFound = allSelectedCategories.some(item => item.index == index);
    if (isFound) {
      const filteredData = allSelectedCategories.filter(
        item => item.index != index,
      );

      const concatedData = filteredData.concat(allSelectedItems);

      var sortable = concatedData.slice(0);
      sortable.sort(function (a, b) {
        return a.index - b.index;
      });
      const PriceofAddons = allSelectedItems.map(
        item => item.selectedAddons.addonstotalAmount,
      );

      setallSelectedCategories(sortable);

      setAddonsPrice(prev => prev + parseInt(PriceofAddons));
    } else {
      const PriceofAddons = allSelectedItems.map(
        item => item.selectedAddons.addonstotalAmount,
      );
      setAddonsPrice(prev => prev + parseInt(PriceofAddons));
      setallSelectedCategories(prev => prev.concat(allSelectedItems));
    }
    setProductModal(false);
    // console.log(selectedAddons);
  };
  console.log('');
  const removeAddonsHandler = index => {
    const updateAddons = [...allSelectedCategories];
    setAddonsPrice(
      prev => prev - updateAddons[index].selectedAddons.addonstotalAmount,
    );
    updateAddons[index].selectedAddons.addonstotalAmount = 0;
    updateAddons[index].selectedAddons.items = [];

    setallSelectedCategories(updateAddons);
  };
  const removeTypeHandler = index => {
    const updateAddons = [...allSelectedCategories];

    updateAddons[index].selectedType = [];
    setallSelectedCategories(updateAddons);
  };
  const removeDressingHandler = index => {
    const updateAddons = [...allSelectedCategories];

    updateAddons[index].selectedDressing = [];
    setallSelectedCategories(updateAddons);
  };

  const AddDealsItem = () => {
    if (productItem.deal_items.length == selectItemProduct.length) {
      // const productToAdd = selectItemProduct.map((prev, selectitemIndex) => ({
      //   ...prev,
      //   addons: prev.addons.map(addon => ({
      //     ...addon,
      //     ao_data: allSelectedCategories[selectitemIndex].selectedAddons,
      //   })),
      //   dressing: prev.dressing.map(dressing => ({
      //     ...dressing,
      //     dressing_data:
      //       allSelectedCategories[selectitemIndex].selectedDressing,
      //   })),
      //   types: prev.types.map(type => ({
      //     ...type,
      //     type_data: allSelectedCategories[selectitemIndex].selectedType,
      //   })),
      // }));

      // const productToAdd = selectItemProduct.map((prev, selectitemIndex) => ({
      //   ...prev,
      //   addons: allSelectedCategories[selectitemIndex].selectedAddons,
      //   dressing: allSelectedCategories[selectitemIndex].selectedDressing,
      //   types: allSelectedCategories[selectitemIndex].selectedType,
      // }));
      const selectedItemProductarray = selectItemProduct?.map(item => [item]);

      const productToAdd = productItem.deal_items.map(
        (prev, selectitemIndex) => ({
          ...prev,
          items_products: selectedItemProductarray[selectitemIndex].map(
            prev => ({
              ...prev,

              addons: allSelectedCategories[selectitemIndex].selectedAddons,
              dressing: allSelectedCategories[selectitemIndex].selectedDressing,
              types: allSelectedCategories[selectitemIndex].selectedType,
            }),
          ),
        }),
      );

      AddDealsCart(productToAdd, addonsPrice, productItem.price);
      Toast.show(
        `${productItem?.name} has been added to your cart`,
        Toast.LONG,
      );
      navigation.goBack();
    } else {
      Toast.show(`Please Select All the item present in the deal`, Toast.LONG);
    }
  };

  // const objectsEqual = (o1, o2) =>
  //   typeof o1 === 'object' && Object.keys(o1).length > 0
  //     ? Object.keys(o1).length === Object.keys(o2).length &&
  //       Object.keys(o1).every(p => objectsEqual(o1[p], o2[p]))
  //     : o1 === o2;
  // const arraysEqual = (a1, a2) =>
  //   a1.length === a2.length && a1.every((o, idx) => objectsEqual(o, a2[idx]));
  // const validateProductExistence = product => {
  //   let condition = false;
  //   const prodouctLength = product.length;
  //   let productCounter = 0;

  //   for (let i = 0; i < dealCart.items.length; i++) {
  //     if (dealCart?.items[i].deal_id == productItem.deal_id) {
  //       for (let j = 0; j < product.length; j++) {
  //         if (product[j].prod_id == dealCart.items[i].items[j].prod_id) {
  //           if (
  //             product[j].addons.items.length ==
  //               dealCart.items[i].items[j].addons.items.length &&
  //             product[j].dressing.length ==
  //               dealCart.items[i].items[j].dressing.length
  //           ) {
  //             if (
  //               arraysEqual(
  //                 product[j].addons.items,
  //                 dealCart.items[i].items[j].addons.items,
  //               ) &&
  //               arraysEqual(
  //                 product[j].dressing,
  //                 dealCart.items[i].items[j].dressing,
  //               ) &&
  //               arraysEqual(product[j].types, dealCart.items[i].items[j].types)
  //             ) {
  //               productCounter++;

  //               if (productCounter == prodouctLength) {
  //                 condition = true;
  //                 break;
  //               }
  //               //
  //             } else {
  //               condition = false;
  //             }
  //             // console.log('true');
  //           } else {
  //             condition = false;
  //           }
  //         } else {
  //           condition = false;
  //         }
  //       }
  //     } else {
  //       console.log('differnt dealss iddd');
  //       condition = false;
  //     }
  //     productCounter = 0;
  //   }
  //   return condition;
  // };
  console.log('deal Cart====>', dealCart);
  const AddDealsCart = (deal, totalAddonsPrice, dealprice) => {
    // console.log(product, productItem);

    {
      setDealCart(prev => {
        const newItems = prev.items.concat({
          deal_items: deal,
          addonsSum: totalAddonsPrice.toFixed(2),
          deal_name: productItem.deal_name,
          deal_cost: productItem.deal_cost,
          deal_id: productItem.deal_id,
          deal_image: productItem.deal_image,
          // is_deal: 'yes',
          deal_price: productItem.deal_price,
          description: productItem.description,
          discount: productItem.discount,
        });
        const cartDetails = JSON.stringify({
          ...prev,
          items: newItems,
          totalAmount: (
            parseFloat(dealCart.totalAmount) +
            parseFloat(dealprice) +
            totalAddonsPrice
          ).toFixed(2),
          totalAddonsPrice: (
            parseFloat(dealCart.totalAddonsPrice) + totalAddonsPrice
          ).toFixed(2),
        });
        AsyncStorage.setItem('dealcart', cartDetails);
        return {
          ...prev,
          items: newItems,
          totalAmount: (
            parseFloat(dealCart.totalAmount) +
            parseFloat(dealprice) +
            totalAddonsPrice
          ).toFixed(2),
          totalAddonsPrice: (
            parseFloat(dealCart.totalAddonsPrice) + totalAddonsPrice
          ).toFixed(2),
        };
      });
    }
    //sandsadsajdsadksakjdnsadkjsandkjsankjdsakjdsakjflkjkjfdnkjfdjhdfkjbfdkbfdkjfd

    // let condtion = validateProductExistence(product);
    // console.log('same product===>', product.type);
    // if (validateProductExistence(product)) {
    //   const productToAdd = cart.items.find(item => {
    //     return item.id === product.id;
    //   });

    //   const updatedItems = cart.items.map((item, index) => {
    //     // const updatedItemsAddOns = item.addons.map((item, index) => item.id);

    //     if (
    //       item.id === productToAdd.id &&
    //       arraysEqual(product.addons, item.addons) &&
    //       arraysEqual(product.dressing, item.dressing) &&
    //       arraysEqual(product.type, item.type)
    //     ) {
    //       return {
    //         ...item,

    //         quantity: item.quantity + 1,
    //         price: item.price,
    //         sum: (
    //           parseFloat(item.sum) +
    //           item.price +
    //           product.totalAddonPrice
    //         ).toFixed(2),
    //       };
    //     }
    //     return item;
    //   });

    //   setCart(prev => {
    //     const cartDetails = JSON.stringify({
    //       ...prev,
    //       items: updatedItems,

    //       totalAmount: (
    //         parseFloat(cart.totalAmount) +
    //         product.price +
    //         product.totalAddonPrice
    //       ).toFixed(2),
    //       addonsPrice: (cart.addonsPrice + product.totalAddonPrice).toFixed(
    //         2,
    //       ),
    //     });
    //     AsyncStorage.setItem('cart', cartDetails);
    //     return {
    //       ...prev,
    //       items: updatedItems,

    //       totalAmount: (
    //         parseFloat(cart.totalAmount) +
    //         product.price +
    //         product.totalAddonPrice
    //       ).toFixed(2),
    //       addonsPrice: (
    //         parseFloat(cart.addonsPrice) + product.totalAddonPrice
    //       ).toFixed(2),
    //     };
    //   });
    // } else {
    //   setCart(prev => {
    //     const newItems = prev.items.concat({
    //       ...product,

    //       sum: (product.price + product.totalAddonPrice).toFixed(2),
    //       quantity: 1,
    //     });
    //     const cartDetails = JSON.stringify({
    //       ...prev,

    //       items: newItems,
    //       totalAmount: (
    //         parseFloat(cart.totalAmount) +
    //         product.price +
    //         product.totalAddonPrice
    //       ).toFixed(2),
    //       addonsPrice: (
    //         parseFloat(cart.totalAddonPrice) + product.totalAddonPrice
    //       ).toFixed(2),
    //     });
    //     AsyncStorage.setItem('cart', cartDetails);
    //     return {
    //       ...prev,
    //       items: newItems,

    //       totalAmount: (
    //         parseFloat(cart.totalAmount) +
    //         product.price +
    //         product.totalAddonPrice
    //       ).toFixed(2),
    //       addonsPrice: (
    //         parseFloat(cart.totalAddonPrice) + product.totalAddonPrice
    //       ).toFixed(2),
    //     };
    //   });
    // }
  };
  // console.log('allselectedCategroies=====>', allSelectedCategories);
  // console.log(dealCart);
  return (
    <View style={styles.container}>
      <View style={[styles.header]}>
        {itemsProducts && (
          <SelectDealsModal
            data={itemsProducts}
            modalVisible={productModal}
            onClossPress={() => setProductModal(false)}
            onPressSelect={get}
          // backButton={() => setProductModal(false)}
          // onClose={() => setProductModal(false)}
          />
        )}

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

        <View style={styles.discountContainer}>
          <Text style={styles.discontText}>- {productItem?.discount}%</Text>
        </View>
      </View>
      <View style={styles.lowerlayout}>
        <ScrollView>
          <View style={styles.nameConatiner}>
            <Text style={styles.productName}>{productItem?.name}</Text>
          </View>

          <FontAwesome
            name="heart"
            style={[
              styles.favouriteContainer,
              {
                backgroundColor: wishlist.includes(productItem?.id)
                  ? '#ffcccc'
                  : '#eee',
              },
            ]}
            color={wishlist.includes(productItem?.id) ? 'red' : 'grey'}
            size={23}
            onPress={() => {
              Toast.show(`wokring on ittt`, Toast.SHORT);
            }}
          />

          <View style={styles.priceContainer}>
            <Text style={styles.productPrice}>
              €{productItem?.price}{' '}
              <Text style={styles.actualPriceText}>
                {productItem?.actualPrice}
              </Text>{' '}
            </Text>
          </View>

          <Text style={styles.productDescription}>
            {productItem?.description}
          </Text>

          {/* {[...Array(productData.quanityofitem)].map((e, i) => (
          <Text key={i}>131312</Text>
        ))} */}

          {productItem.deal_items.map((productitem, productindex) => {
            return (
              <View key={productindex}>
                <Text style={styles.itemTitleText}>
                  {productitem.item_title}
                </Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                  {productitem.items_products.map((item, index) => {
                    return (
                      <>
                        <TouchableOpacity
                          key={Math.random()}
                          activeOpacity={0.4}
                          onPress={() => {
                            // selectedTypeMethod(item);
                            modalHandler(item, productindex, productitem);
                            // SelectItemsHandler(item.id);
                          }}
                          style={[
                            styles.typeContainer,
                            {
                              borderColor:
                                selectItemProduct[productindex]?.prod_id ==
                                  item.prod_id &&
                                  selectItemProduct[productindex]?.index ==
                                  productindex
                                  ? Colors.primary
                                  : Colors.grey,
                              borderWidth:
                                selectItemProduct[productindex]?.prod_id ==
                                  item.prod_id &&
                                  selectItemProduct[productindex]?.index ==
                                  productindex
                                  ? 1
                                  : 0,
                            },
                          ]}>
                          <MaterialCommunityIcons
                            name={
                              selectItemProduct[productindex]?.prod_id ==
                                item.prod_id &&
                                selectItemProduct[productindex]?.index ==
                                productindex
                                ? 'checkbox-blank-circle'
                                : 'checkbox-blank-circle-outline'
                            }
                            color={
                              selectItemProduct[productindex]?.prod_id ==
                                item.prod_id &&
                                selectItemProduct[productindex]?.index ==
                                productindex
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
                              {item.prod_name}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      </>
                    );
                  })}
                </View>
                {allSelectedCategories[productindex]?.selectedAddons?.items
                  .length > 0 && (
                    <>
                      <Text style={styles.selectedCategoriesTitleText}>
                        Addons for {productitem.item_title}
                      </Text>
                      <View style={styles.selectedCategoriesOuterContainer}>
                        <FlatList
                          horizontal={true}
                          data={
                            allSelectedCategories[productindex]?.selectedAddons
                              ?.items
                          }
                          key={(item, index) => index}
                          renderItem={({ item }) => {
                            return (
                              <View
                                style={styles.selectedCategoriesInnerContainer}>
                                <Text>
                                  {item.as_name} (x{item.quantity})
                                </Text>
                              </View>
                            );
                          }}
                        />
                        <Entypo
                          name="circle-with-cross"
                          size={22}
                          onPress={() => removeAddonsHandler(productindex)}
                          color={Colors.secondary}
                        />
                      </View>
                    </>
                  )}
                {allSelectedCategories[productindex]?.selectedType.length >
                  0 && (
                    <>
                      <Text style={styles.selectedCategoriesTitleText}>
                        Type for {productitem.item_title}
                      </Text>
                      <View style={styles.selectedCategoriesTypeContainer}>
                        <View
                          style={{ flexDirection: 'row', alignItems: 'center' }}>
                          <MaterialCommunityIcons
                            name={'checkbox-blank-circle'}
                            color={Colors.primary}
                            size={15}
                          />
                          <Text style={{ paddingLeft: 5 }}>
                            {
                              allSelectedCategories[productindex]?.selectedType[0]
                                ?.ts_name
                            }
                          </Text>
                        </View>
                        <Entypo
                          name="circle-with-cross"
                          size={22}
                          onPress={() => removeTypeHandler(productindex)}
                          color={Colors.secondary}
                        />
                      </View>
                    </>
                  )}
                {allSelectedCategories[productindex]?.selectedDressing.length >
                  0 && (
                    <>
                      <Text style={styles.selectedCategoriesTitleText}>
                        Dressing for {productitem.item_title}
                      </Text>
                      <View style={styles.selectedCategoriesOuterContainer}>
                        <FlatList
                          horizontal={true}
                          data={
                            allSelectedCategories[productindex]?.selectedDressing
                          }
                          key={(item, index) => index}
                          renderItem={({ item }) => {
                            {
                              console.log("CCC : ",item)
                            }
                            return (
                              <View
                                style={styles.selectedCategoriesInnerContainer}>
                                <Text>{item.dressing_name}</Text>
                              </View>
                            );
                          }}
                        />
                        <Entypo
                          name="circle-with-cross"
                          size={22}
                          onPress={() => removeDressingHandler(productindex)}
                          color={Colors.secondary}
                        />
                      </View>
                    </>
                  )}
              </View>
            );
          })}
        </ScrollView>
      </View>
      {addonsPrice > 0 && (
        <Text style={styles.addonsPriceText}>
          {language.totalAddonsPrice}:{addonsPrice}
        </Text>
      )}
      <CommonButton onPress={() => AddDealsItem()} title={language.addToCart} />
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
  itemTitleText: {
    fontFamily: 'Roboto-Regular',
    paddingLeft: 10,
    fontSize: 16,
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
    width: '46%',
    marginLeft: '2.5%',
    borderColor: Colors.grey,
    marginHorizontal: 2.5,
    marginBottom: 5,
    paddingHorizontal: 5,
    paddingVertical: 10,
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
  selectedCategoriesTitleText: {
    fontSize: 15,
    fontFamily: 'Roboto-Regular',
    paddingLeft: 5,
  },
  selectedCategoriesInnerContainer: {
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
  selectedCategoriesOuterContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingVertical: 8,
    marginHorizontal: 10,
    borderRadius: 10,
    marginVertical: 2,
    paddingLeft: 10,
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  selectedCategoriesTypeContainer: {
    flexDirection: 'row',
    // alignSelf: 'flex-start',
    marginHorizontal: 10,
    borderRadius: 10,
    backgroundColor: 'white',
    paddingVertical: 10,
    alignItems: 'center',
    paddingLeft: 5,
    paddingHorizontal: 8,
    marginTop: 5,
    justifyContent: 'space-between',
  },
  addonsPriceText: {
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
    textAlign: 'center',
    marginVertical: 6,
  },
});
export default ProductDetails;
