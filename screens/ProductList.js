import React, { useCallback, useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import CategoryProducts from '../components/ProductsBoxes/CategoryProducts';
import Colors from '../constants/Colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ViewProducts from '../components/ProductsBoxes/ViewProducts';
import Loader from '../components/Animatedfullscreen/Loader';
import NoData from '../components/Animatedfullscreen/NoData';
import { APIURL } from '../constants/Url';
import { useFocusEffect } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import Toast from 'react-native-simple-toast';
const ProductList = ({ route, navigation }) => {
  const { subCategoryId, categoryname } = route.params;
  console.log("subCategoryId ", subCategoryId)
  const [isLoading, setLoading] = useState(false);
  const [ProductData, setProductData] = useState([]);
  const fetchProduct = useCallback(async () => {
    setLoading(true);
    setProductData([]);
    try {
      let base_url = `${APIURL}/API/get_products_by_categoryzz.php`;
      // eslint-disable-next-line no-undef

      let uploadData = new FormData();

      uploadData.append(
        'token',
        'as23rlkjadsnlkcj23qkjnfsDKJcnzdfb3353ads54vd3favaeveavgbqaerbVEWDSC',
      );

      uploadData.append('category_id', subCategoryId);
      const response = await fetch(base_url, {
        method: 'post',
        body: uploadData,
      });
      const responseData = await response.json();
      if (responseData.status === false) {
        // setProductData(null);
        setProductData('none');
        // throw new Error(responseData.Message);

      } else {
        const productDetails = responseData.data;
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

          id: parseInt(item.product_id),
          quantity: 0,
          discount: parseInt(item.discount),
          qty: item.qty,
          image: item.img,
          sub_category_id: item.sub_category_id,
          addons: item.addons.map(item => ({
            ...item,
            quantity: 0,
            sum: 0,
          })),
          dressing: item.dressing,
          type: item.types,
        }));
        // setProductData(productItem);
        // console.log('seting the data', productItem);
        setProductData(productItem);
      }
    } catch (error) {
      Toast.show(`${error}`, Toast.LONG);
    }
    setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchProduct();
    }, [fetchProduct]),
  );




  // const {mainCategoryId} = route.params;

  // const [subCategory, setSubCategory] = useState([]);

  console.log(ProductData)

  return isLoading ? (
    <Loader />
  ) : (
    <View style={styles.container}>
      <View style={styles.upperLayout}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>{categoryname}</Text>
          <Ionicons color={Colors.textColor} name="search" size={20} />
        </View>
      </View>
      <View style={styles.lowerLayout}>
        <View
          style={{
            marginVertical: 10,
          }}>
          {ProductData === 'none' ? (
            <View
              style={{
                height: '100%',
                justifyContent: 'center',
              }}>
              <LottieView
                style={{
                  width: 500,
                  height: 500,
                  alignSelf: 'center',
                  // justifyContent: 'center',
                  flex: 1,
                }}
                source={require('../assets/LootiFile/NoData.json')}
                autoPlay
                speed={1}
              // resizeMode="cover"
              />
            </View>
          ) : (
            <ScrollView
              contentContainerStyle={{
                paddingBottom: 35,
                borderTopLeftRadius: 30,
                borderTopRightRadius: 30,
              }}>
              <View style={styles.recentlyViewProducts}>
                {ProductData.map(item => {
                  return (
                    <ViewProducts
                      onPress={() =>
                        navigation.navigate('productDetail', {
                          product:  item.id ,
                        })
                        // console.log(item)
                      }
                      key={item.product_id}
                      data={item}
                    />
                  );
                })}
              </View>
            </ScrollView>
          )}

          {/* <FlatList
            data={feature}
            style={styles.recentlyViewProducts}
            contentContainerStyle={{justifyContent: 'space-around'}}
            keyExtractor={item => item.id}
            renderItem={({item}) => {
                return <ViewProducts key={item.id} data={item} />;
            }}
        /> */}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  activity: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.backgroundColor,
  },
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
  },
  lowerLayout: {
    backgroundColor: Colors.backgroundColor,
    flex: 1,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    // justifyContent: 'center',
  },

  recentlyViewProducts: {
    flexDirection: 'row',
    flexWrap: 'wrap',

    paddingLeft: 4,
    width: '100%',

    alignSelf: 'center',
    justifyContent: 'flex-start',
  },
});

export default ProductList;
