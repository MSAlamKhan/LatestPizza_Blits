import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import Colors from '../constants/Colors';
import {APIURL} from '../constants/Url';

const ProductOrders = props => {
  const [imageLoading, setImageLoading] = useState(true);
  // const calculateSum = () => {
  //   if (props.addons.length > 0) {
  //     const sumOfAddonsPrice = props.addons
  //       .map(item => item.addon_price)
  //       .reduce((prev, next) => parseFloat(prev) + parseFloat(next));

  //     const sumproductandaddons = parseFloat(props.price) + sumOfAddonsPrice;
  //     return (sumproductandaddons * parseInt(props.qty)).toFixed(2);
  //   } else {
  //     return (parseInt(props.qty) * parseFloat(props.price)).toFixed(2);
  //   }
  // };
  const data = props.data;

  console.log('data======>', data.types);
  console.log('data====>', data.deal_id ? data.deal_image : data.product_image);
  return (
    <View style={{...styles.productInnerContainer, ...props.style}}>
      <View style={{width: '32%'}}>
        <Image
          onLoad={() => setImageLoading(false)}
          source={{
            uri: `${APIURL}/admin_panel/Uploads/${
              data.deal_id ? data.deal_image : data.product_image
            }`,
          }}
          style={styles.image}
        />
        <ActivityIndicator
          animating={imageLoading}
          style={[styles.image, {position: 'absolute'}]}
        />
        <View style={styles.discountContainer}>
          <Text style={styles.discontText}>
            -{' '}
            {data.deal_id
              ? ((100-((data?.deal_cost/data?.deal_price)*100)).toFixed(2))
              : (data.product_discount)}
            %
          </Text>
        </View>
      </View>
      <View style={styles.productDetails}>
        <Text style={styles.productText}>
          {data.deal_id ? data?.deal_name : data.product_name}
        </Text>

        <View style={styles.amountContainer}>
          <Text style={styles.price}>
            € {data.deal_id ? data?.deal_cost : ((data.product_price-((data.product_price*data.product_discount)/100)))}{' '}
            <Text style={styles.actualPrice}>
              {data.deal_id ? data?.deal_price : data.product_price}
            </Text>{' '}
          </Text>
        </View>
        <Text>
          {data.deal_item_title}: {data.product_name}
        </Text>
        {data.addons.length > 0 && <Text>Addons</Text>}
        <View style={{height: data.types.length == 0 ? 0 : 50}}>
          <FlatList
            data={data.addons}
            keyExtractor={item => item.as_id}
            renderItem={({item}) => (
              <>
                <View style={styles.addonsContainer}>
                  <Text style={styles.addonNameText}>
                    {item.as_name}
                    {`(x${item.quantity})`}
                  </Text>
                  <Text style={styles.addonNameText}>€ {item.as_price}</Text>
                </View>
              </>
            )}
          />
        </View>
        {data.types[0].ts_name ? (
          <View style={{height: data.types.length == 0 ? 0 : 50}}>
            <Text>Types</Text>
            <Text style={styles.addonNameText}>{data.types[0].ts_name}</Text>
          </View>
        ) : null}
        {/* <View style={{height: data.types.length == 0 ? 0 : 50}}>
          {data.types.length > 0 && <Text>Types</Text>}
          <FlatList
            data={data.types}
            keyExtractor={item => item.ts_id}
            renderItem={({item}) => (
              <>
                <View style={styles.addonsContainer}>
                  <Text style={styles.addonNameText}>{item.type_title}</Text>
                </View>
              </>
            )}
          />
        </View> */}
        <View style={{height: data.dressing.length == 0 ? 0 : 50}}>
          {data.dressing.length > 0 && <Text>Dressing</Text>}
          <FlatList
            data={data.dressing}
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
        {/* <ScrollView style={{height: 60}}>
          {props.addons.map((item, index) => {
            return (
              <>
                <View key={index} style={styles.addonsContainer}>
                  <Text>{item.addon_name}</Text>
                  <Text>€ {item.addon_price}</Text>
                </View>
              </>
            );
          })}
        </ScrollView> */}
        {/* <Text style={styles.productText}>Total:€ {calculateSum()}</Text> */}
      </View>
      {data.deal_id ? null : (
        <View style={styles.quantityContainer}>
          <Text style={styles.quantityTitle}>Qty</Text>
          <Text style={styles.quantityText}>{data.quantity}</Text>
          {/* <Text style={styles.quantityText}>132321</Text> */}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  productInnerContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: 120,
    alignSelf: 'center',
    // borderRadius: 100,
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
  productDetails: {
    marginLeft: 20,
    width: '35%',
  },
  productText: {
    fontSize: 14,
    fontFamily: 'OpenSans-Regular',
  },
  // actualPrice: {
  //   fontSize: 14,
  //   fontFamily: 'OpenSans-Regular',
  //   textDecorationLine: 'line-through',
  //   textDecorationStyle: 'solid',
  // },
  descriptionText: {
    fontSize: 14,
    fontFamily: 'OpenSans-Regular',
  },
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
  amountContainer: {
    marginVertical: 3,
    flexDirection: 'row',
    alignItems: 'center',
  },
  discountAmount: {
    fontSize: 16,
    fontFamily: 'OpenSans-Regular',
    color: Colors.accent,
    marginRight: 3,
  },

  discount: {
    marginLeft: 5,
    backgroundColor: Colors.accent,
    fontSize: 14,
    fontFamily: 'OpenSans-Regular',
    color: Colors.backgroundColor,
    padding: 2,
  },
  addonsContainer: {
    flexDirection: 'row',

    justifyContent: 'space-between',
  },
  addonNameText: {
    fontFamily: 'Roboto-Regular',
  },
  quantityContainer: {
    width: '20%',
    marginLeft: 20,
    alignItems: 'center',
  },
  quantityTitle: {
    fontSize: 14,
    fontFamily: 'OpenSans-Regular',
    marginBottom: 5,
  },
  quantityText: {
    fontSize: 16,
    fontFamily: 'OpenSans-Regular',
    color: Colors.grey,
    textAlign: 'center',
  },
});

export default ProductOrders;
