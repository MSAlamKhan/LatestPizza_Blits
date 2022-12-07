import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import Colors from '../../constants/Colors';
import Entypo from 'react-native-vector-icons/Entypo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {APIURL} from '../../constants/Url';
import {
  useFocusEffect,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';
import {useCallback} from 'react';
import Loader from '../../components/Animatedfullscreen/Loader';

import NoData from '../../components/Animatedfullscreen/NoData';
import {AuthContext} from '../../context/Auth';
const ProductContainer = props => {
  const navigation = useNavigation();

  return props.data.length == 0 ? (
    <NoData />
  ) : (
    <ScrollView>
      {props.data.map(item => {
        console.log(item)
        return (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('productDetail', {
                product: {item},
              })
            }
            key={item.id}
            style={styles.productContainer}>
            <View style={{flexDirection: 'row'}}>
              <View>

              <Image
                style={styles.image}
                source={{uri: `${APIURL}/admin_panel/Uploads/${item.image}`}}
                />
              <View style={styles.discountContainer}>
          <Text style={styles.discontText}>- {item?.discount}%</Text>
        </View>
                </View>
              <View
                style={{paddingLeft: 10, alignSelf: 'center', width: '63%'}}>
                <Text style={styles.itemTitle}>{item.name}</Text>
                <View style={{flexDirection: 'row'}}>
                  <Text style={styles.itemPrice}>€{item.price} </Text>
                  <Text style={styles.itemOff}>
                    <Text
                      style={{
                        color: 'red',
                        textDecorationLine: 'line-through',
                        textDecorationStyle: 'solid',
                      }}>
                      {item.actualPrice}{' '}
                    </Text>
                    
                  </Text>
                  <Text></Text>
                </View>
              </View>
            </View>
            <View>
              <Entypo name="chevron-small-right" size={35} />
              <Text style={styles.qtyText}>Qty:{item.qty}</Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};
const Wishlist = () => {
  const [isLoading, setLoading] = useState(true);
  const [wishListItem, setWishListItem] = useState([]);
  const {wishlist} = useContext(AuthContext);

  const isFocused = useIsFocused();

  useEffect(() => {
    // Call only when screen open or when back on screen
    if (isFocused) {
      Wishlist();
    }
  }, [isFocused]);
  const Wishlist = async () => {
    // const jsonValue = await AsyncStorage.getItem('wishList');
    // const wishList = JSON.parse(jsonValue);

    setWishListItem([]);
    setLoading(true);
    try {
      let base_url = `${APIURL}/API/get_products_by_idzz.php`;

      let form = new FormData();
      // console.log('first');
      form.append(
        'token',
        'as23rlkjadsnlkcj23qkjnfsDKJcnzdfb3353ads54vd3favaeveavgbqaerbVEWDSC',
      );
      form.append('product_id', wishlist.toString());

      // eslint-disable-next-line no-undef
      const response = await fetch(base_url, {
        method: 'post',
        body: form,
      });

      const responseData = await response.json();

      const Success = responseData?.success;

      if (Success === false) {
        // throw new Error(responseData.Message);
        console.log('false');
      } else {
        // setWishListItem(responseData.Data);
        const productDetails = responseData.Data;
        const productItem = productDetails.map(item => ({
          name: item.name,
          description: item.description,
          actualPrice: parseFloat(item.price).toFixed(0),
          price: parseFloat(
            (
              parseFloat(item.price) -
              parseFloat(item.price) * (parseFloat(item.discount) / 100)
            ).toFixed(2),
          ),

          id: parseInt(item.id),
          quantity: 0,
          sum: 0,
          discount: parseInt(item.discount) ,
          qty: item.qty,
          image: item.image,
          sub_category_id: item.sub_category_id,
          addons: item.addons.map(item => ({
            ...item,
            quantity: 0,
            sum: 0,
          })),
          dressing: item.dressing,
          type: item.types,
        }));
        setWishListItem(productItem);
        // console.log('api response=>', responseData);
      }
    } catch (error) {
      // Alert.alert(error.message);
    }
    setLoading(false);
  };

  // useFocusEffect(
  //   useCallback(() => {
  //     recentlyViewApi();
  //   }, []),
  // );

  return isLoading ? (
    <Loader />
  ) : (
    <View style={styles.container}>
      <ProductContainer data={wishListItem} />
    </View>
  );
};

export default Wishlist;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
    paddingBottom: 5,
  },
  discountContainer: {
    backgroundColor: 'rgba(224, 49, 49,0.75)',
    position: 'absolute',
    // alignSelf: 'flex-end',
    top: 0,
    right: 0,

    paddingHorizontal: 5,
    paddingVertical: 4,
    // borderRadius: 5,
  },
  discontText: {
    fontFamily: 'Roboto-Regular',
    fontSize: 12,
    color: 'white',
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
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  image: {
    height: 70,
    width: 80,
  },
  itemTitle: {fontFamily: 'Roboto-Bold'},
  itemPrice: {color: 'green', fontFamily: 'Roboto-Regular'},
  itemOff: {color: 'green', fontFamily: 'Roboto-Regular'},
  qtyText: {
    fontFamily: 'Roboto-Regular',
  },
});
