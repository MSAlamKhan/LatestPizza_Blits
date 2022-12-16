import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React, { useState } from 'react';
import { APIURL } from '../../constants/Url';
import Colors from '../../constants/Colors';
import { getPixelSizeForLayoutSize } from 'react-native/Libraries/Utilities/PixelRatio';
export default function ViewProducts(props) {
  const [imageLoading, setimageLoading] = useState(true);
  const onLoadEnd = () => {
    setimageLoading(false);
  };

  return (
    <TouchableOpacity onPress={props.onPress} style={styles.productBox}>
      <View>
        <Image
          onLoadEnd={() => onLoadEnd()}
          resizeMode="cover"
          style={{
            // display: imageLoading ? 'none' : 'flex',
            width: '100%',
            height: 100,
          }}
          source={{
            uri: `${APIURL}/admin_panel/Uploads/${props.data.image}`,
            // uri: 'https://image.shutterstock.com/image-photo/red-apple-isolated-on-white-260nw-1727544364.jpg',
          }}
        />

        <ActivityIndicator
          animating={imageLoading}
          color={Colors.primary}
          style={{
            position: 'absolute',
            width: '100%',
            height: 80,
          }}
        />

        {props.data.discount == 0 ? null : props.hideDiscount ? null : (
          <View style={styles.discountContainer}>
            <Text style={styles.discontText}>- {props.data.discount}%</Text>
          </View>
        )}
      </View>

      <View
        style={{
          justifyContent: 'space-between',
          padding: 5,
          flex: 1,
        }}>
        <Text style={styles.name}>{props.data.name}</Text>
        <Text style={styles.price}>
          € {props.data.price}{' '}
          {props.data.discount == 0 ? null : <Text style={styles.actualPrice}>€{props.data.actualPrice} </Text>}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  productBox: {
    backgroundColor: '#fff',

    marginVertical: 5,
    marginHorizontal: 5,
    width: '30%',
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
  name: {
    fontFamily: 'Roboto-Bold',
    fontSize: 12,
    color:"black"
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
});
