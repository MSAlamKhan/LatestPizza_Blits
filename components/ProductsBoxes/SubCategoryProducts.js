import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React, {useState} from 'react';
import {APIURL} from '../../constants/Url';
import Colors from '../../constants/Colors';

export default function SubCategoryProducts(props) {
  const [imageLoading, setImageLoading] = useState(true);
  return (
    <TouchableOpacity
      onPress={props.onPress}
      style={{
        alignItems: 'center',
        marginTop: 13,

        padding: 3,
        width: '20%',
        marginHorizontal: 2,
        // justifyContent: 'space-between',
      }}>
      <Image
        // resizeMode="cover"
        onLoad={() => setImageLoading(false)}
        style={[styles.image]}
        source={{
          uri: `${APIURL}/admin_panel/Uploads/${props.data.img}`,
        }}
      />
      <ActivityIndicator
        animating={imageLoading}
        color={Colors.primary}
        style={[styles.image, {position: 'absolute'}]}
      />
      <Text
        style={{
          paddingTop: 3,
          fontFamily: 'Roboto-Regular',
          textAlign: 'center',
          fontSize: 13,
        }}>
        {props.data.name}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  image: {
    width: 70,
    height: 70,
    borderRadius: 100,
    // position: 'absolute',
    // backgroundColor: 'pink',
  },
});
