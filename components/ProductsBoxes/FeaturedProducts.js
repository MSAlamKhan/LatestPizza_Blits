import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React, {useState} from 'react';
import Colors from '../../constants/Colors';
import {APIURL} from '../../constants/Url';

export default function FeaturedProducts(props) {
  const [imageLoading, setImageLoading] = useState(true);
  return (
    <TouchableOpacity onPress={props.onPress} style={styles.productBox}>
      <Image
        onLoad={() => setImageLoading(false)}
        resizeMode="cover"
        style={{
          width: '100%',
          height: 50,
        }}
        source={{
          uri: `${APIURL}/admin_panel/Uploads/${props.data.image}`,
        }}
      />
      <ActivityIndicator
        animating={imageLoading}
        color={Colors.primary}
        style={[
          {
            width: '100%',
            height: 50,
            position: 'absolute',
            display: imageLoading ? 'flex' : 'none',
          },
          styles.categoryImage,
        ]}
      />
      <Text style={styles.price}>From €{props.data.price}</Text>
      <Text numberOfLines={1} style={styles.brandName}>
        {props.data.name}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  productBox: {
    padding: 6,
    // borderWidth: 0.5,
    flex: 1,
    backgroundColor: '#fff',
    marginLeft: 10,
    width: 85,
    borderRadius: 10,
  },
  price: {
    fontFamily: 'Roboto-Bold',
    fontSize: 10,
  },
  brandName: {
    fontFamily: 'Roboto-light',
    fontSize: 10,
    color: 'green',
  },
});
