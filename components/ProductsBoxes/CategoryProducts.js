import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ImageBackground,
} from 'react-native';
import React, {useState} from 'react';
import Colors from '../../constants/Colors';
import {APIURL} from '../../constants/Url';
export default function CategoryProducts(props) {
  const [imageLoading, setimageLoading] = useState(true);
  return (
    <TouchableOpacity onPress={props.onPress} style={styles.categoryCard}>
      <ImageBackground
        onLoad={() => {
          setimageLoading(false);
        }}
        style={[styles.categoryImage]}
        source={{
          uri: `${APIURL}/admin_panel/Uploads/${props.data.img}`,
        }}>
        <ActivityIndicator
          animating={imageLoading}
          color={Colors.primary}
          style={[
            {
              position: 'absolute',
            },
            styles.categoryImage,
          ]}
        />
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.7)',
            justifyContent: 'center',
          }}>
          <Text style={styles.categoryText}>{props.data.name}</Text>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  categoryCard: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 20,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,

    elevation: 10,
    overflow: 'hidden',
  },
  categoryImage: {
    width: '100%',
    // overflow: 'hidden',
    aspectRatio: 1 / 0.8,
    // height: 120,
    borderRadius: 5,
    alignSelf: 'center',
  },
  categoryText: {
    fontSize: 15,
    fontFamily: 'Roboto-Bold',
    color: 'white',
    paddingVertical: 10,
    // borderWidth: 1,
    // justifyContent: 'center',
    alignSelf: 'center',
    paddingHorizontal: 14,
  },
});
