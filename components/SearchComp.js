import React, {useState, useContext, useCallback} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  ToastAndroid,
  ActivityIndicator,
} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import Colors from '../constants/Colors';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {AuthContext} from '../context/Auth';
import {APIURL} from '../constants/Url';
import Toast from 'react-native-simple-toast';
import {ScrollView} from 'react-native-gesture-handler';

const SearchComp = props => {
  const [productData, setProductData] = useState(props.data);
  const [imageLoading, setImageLoading] = useState(true);
  const navigation = useNavigation();
  // useFocusEffect(
  //   useCallback(() => {
  //     cart.items.map(item => {
  //       if (item.id === props.id) {
  //         setProductData(item);
  //       }
  //     });
  //   }, [cart.items, props.id]),
  // );

  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('productDetail', {
          // product: {item: productData},
          product:  productData.id,
        })
      }
      key={productData.id}
      style={styles.productContainer}>
      <View style={{flexDirection: 'row', width: '85%'}}>
        <Image
          onLoad={() => setImageLoading(false)}
          style={styles.image}
          source={{uri: `${APIURL}/admin_panel/Uploads/${productData.image}`}}
        />
        <ActivityIndicator
          animating={imageLoading}
          color={Colors.primary}
          style={[
            {
              position: 'absolute',
            },
            styles.image,
          ]}
        />
        <View
          style={{
            marginLeft: 5,
            alignSelf: 'center',
            width: '70%',
          }}>
          <Text style={styles.itemTitle}>{productData.name}</Text>
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.itemPrice}>{productData.price} </Text>
            <Text style={styles.itemOff}>
              <Text
                style={{
                  color: Colors.textLighestGrey,
                  textDecorationLine: 'line-through',
                  textDecorationStyle: 'solid',
                }}>
                {productData.actualPrice}
              </Text>
              {productData.discount}
            </Text>
          </View>
        </View>
      </View>
      <View style={{width: '20%', marginLeft: 4}}>
        {/* <Text style={styles.quantityText}>Qty:{productData.qty}</Text> */}
        <Text style={styles.quantityText}>
          Qty:
          {Math.abs(productData.qty) > 999
            ? Math.sign(productData.qty) *
                (Math.abs(productData.qty) / 1000).toFixed(1) +
              'k'
            : Math.sign(productData.qty) * Math.abs(productData.qty)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
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
    // flex: 1,
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
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  image: {
    height: 70,
    width: '30%',
  },
  itemTitle: {
    fontFamily: 'Roboto-Bold',
  },
  itemPrice: {
    color: 'green',
    fontFamily: 'Roboto-Regular',
  },
  itemOff: {
    color: 'green',
    fontFamily: 'Roboto-Regular',
  },
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
  quantityText: {
    fontFamily: 'Monsterrat-Regular',
  },
});

export default SearchComp;
