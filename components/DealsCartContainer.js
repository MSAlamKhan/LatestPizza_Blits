import {StyleSheet, Text, View, Image} from 'react-native';
import React, {useContext} from 'react';
import Colors from '../constants/Colors';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DealsProductContainer from './DealsProductContainer';
import {createIconSetFromFontello} from 'react-native-vector-icons';
import {AuthContext} from '../context/Auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
const DealsCartContainer = props => {
  const data = props.data;
  const {dealCart, setDealCart} = useContext(AuthContext);
  const deleteDealHandlert = index => {
    console.log(index);

    const filterData = dealCart.items.filter(
      (item, dealIndex) => dealIndex != index,
    );
    const addonsPrice = dealCart.items[index].addonsSum;
    const dealsPrice = dealCart.items[index].deal_cost;

    setDealCart(prev => {
      const cartDetails = JSON.stringify({
        ...prev,

        items: filterData,
        totalAmount:
          dealCart.totalAmount -
          parseFloat(addonsPrice) -
          parseFloat(dealsPrice),
        totalAddonsPrice: dealCart.totalAddonsPrice - parseFloat(addonsPrice),
      });

      AsyncStorage.setItem('dealcart', cartDetails);
      return {
        ...prev,
        items: filterData,
        totalAmount:
          dealCart.totalAmount -
          parseFloat(addonsPrice) -
          parseFloat(dealsPrice),
        totalAddonsPrice: dealCart.totalAddonsPrice - parseFloat(addonsPrice),
      };
    });
  };
  return (
    <>
      {data.items.map((item, index) => {
        return (
          <View style={styles.productOuterContainer} key={index}>
            <View style={styles.productContainer}>
              <View style={{flexDirection: 'row'}}>
                <View>
                  <Image
                    resizeMode="cover"
                    style={styles.image}
                    source={{
                      uri: `https://i.ytimg.com/vi/PCAwJs51D0k/maxresdefault.jpg`,
                    }}
                  />
                  <View style={styles.discountContainer}>
                    <Text style={styles.discontText}>- {item.discount}%</Text>
                  </View>
                </View>
                <View
                  style={{
                    marginLeft: 10,
                    // paddingLeft: 10,

                    //   alignSelf: 'center',
                  }}>
                  <Text style={styles.itemTitle}>{item.deal_name}</Text>
                  {/* <Text style={styles.itemTitle}>samsung 60 inch tv </Text> */}
                  <View style={{flexDirection: 'row'}}>
                    <Text style={styles.itemPrice}>€{item.deal_cost} </Text>
                    <Text style={styles.actualPrice}>€{item.deal_price} </Text>
                  </View>
                  <View
                    style={{
                      width: '80%',
                      maxWidth: 250,
                    }}>
                    <Text>{item.description}</Text>
                  </View>
                </View>
              </View>
              {/* {item.items.map((item, index) => {
                return <DealsProductContainer key={index} data={item} />;
              })} */}
              <View>
                {/* <Text style={{textAlign: 'center'}}>€{item.sum}</Text> */}
              </View>

              <View style={styles.crossIcon}>
                <Ionicons
                  name="trash"
                  size={26}
                  color={Colors.buttongrad1}
                  onPress={() => deleteDealHandlert(index)}
                />
              </View>
            </View>
            {item.deal_items.map((item, index) => {
              return <DealsProductContainer key={index} data={item} />;
            })}
          </View>
        );
      })}
    </>
  );
};

export default DealsCartContainer;

const styles = StyleSheet.create({
  productOuterContainer: {
    width: '90%',
    backgroundColor: 'white',
    // flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'center',
    alignItems: 'center',
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  productContainer: {
    width: '100%',
    // backgroundColor: Colors.buttongrad1,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'center',
    alignItems: 'center',
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },

    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
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
  actualPrice: {
    color: Colors.textLighestGrey,
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
  },
  itemOff: {
    color: 'green',
    fontFamily: 'Roboto-Regular',
  },
  crossIcon: {
    position: 'absolute',
    top: 5,
    right: 5,
    // backgroundColor: 'white',
    // borderWidth: 1,
    borderRadius: 100,
    zIndex: 99,
    elevation: 99,
    padding: 5,
  },
});
