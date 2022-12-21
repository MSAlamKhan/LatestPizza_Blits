import React, { useCallback, useEffect, useState, useContext } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Platform,
  ImageBackground,
} from 'react-native';
import Colors from '../constants/Colors';
// import { SliderBox } from 'react-native-image-slider-box';
import { Card, Title } from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
import {
  useFocusEffect,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';
import { AuthContext } from '../context/Auth';
import OneSignal from 'react-native-onesignal';
import { APIURL } from '../constants/Url';
import FeaturedProducts from '../components/ProductsBoxes/FeaturedProducts';
import ViewProducts from '../components/ProductsBoxes/ViewProducts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Wishlist from './AccountTabs/Wishlist';
import Loader from '../components/Animatedfullscreen/Loader';
import LottieView from 'lottie-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
const Dashboard = () => {
  const { language, userDetails, recentlyView, setRecentlyView, dealCart, cart } =
    useContext(AuthContext);

  const navigation = useNavigation();

  const [isLoading, setLoading] = useState(true);
  const [productItem, setProductItem] = useState([]);
  const [productItemVariation, setProductItemVariation] = useState([]);
  const [discount, setDiscount] = useState([]);
  const [initialDiscountarayyIndex, setInitialDiscountarayyIndex] = useState(0);
  const [lastDiscountarayyIndex, setLastDiscountarayyIndex] = useState(9);
  const [tenDiscountItems, setTenDiscountItems] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [categorySliderImages, setCatategorySliderImages] = useState([]);
  const [dealData, setDealData] = useState([]);
  console.log(productItem, "logo")
  const DiscountProducts = async recent => {
    setLoading(true);

    try {
      let base_url = `${APIURL}/API/productlist_by_discount.php`;

      let form = new FormData();

      form.append(
        'token',
        'as23rlkjadsnlkcj23qkjnfsDKJcnzdfb3353ads54vd3favaeveavgbqaerbVEWDSC',
      );

      const response = await fetch(base_url, {
        method: 'post',
        body: form,
      });

      const responseData = await response.json();
      const Success = responseData?.success;
      // console.log('discount', responseData)
      if (Success === false) {
        // throw new Error(responseData.Message);
      } else {
        const productDetails = responseData.Data;
        const discountItems = productDetails.map(item => ({
          name: item.name,
          description: item.description,
          actualPrice: parseFloat(item.price).toFixed(1),
          price: parseFloat(
            (
              parseFloat(item.price) -
              (parseFloat(item.price) * (parseFloat(item.discount) / 100))
            ).toFixed(2),
          ),

          id: parseInt(item.id),
          quantity: 0,
          discount: parseInt(item.discount),
          sum: 0,
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
          // dressing: item.dressing,
          // type: item.types,
        }));
        // setOffset(offset + 1);
        // const waitingforAsync = await getrecentyview();
        setDiscount(discountItems);
        if (discountItems.length > 10) {
          const tenItem = discountItems.slice(
            initialDiscountarayyIndex,
            lastDiscountarayyIndex,
          );
          setTenDiscountItems(tenItem);
        } else {
          setInitialDiscountarayyIndex(initialDiscountarayyIndex + 6);
          setTenDiscountItems(discountItems);
          setLastDiscountarayyIndex(lastDiscountarayyIndex + 6);
        }

        // console.log('ten item', tenDiscountItems);
        setLoading(false);
      }
    } catch (error) {
      // Alert.alert(error.message);
      console.log('recent error===>', error.Message);
    }
    setLoading(false);
  };

  const loadMoreDiscountedPrice = () => {
    setInitialDiscountarayyIndex(initialDiscountarayyIndex + 6);
    setLastDiscountarayyIndex(lastDiscountarayyIndex + 6);
    const tenItems = tenDiscountItems.slice(
      initialDiscountarayyIndex,
      lastDiscountarayyIndex,
    );


    setTenDiscountItems([...tenDiscountItems, ...tenItems]);
  };

  const recentlyViewApi = async recent => {
    setLoading(true);
    // console.log(recent);
    try {
      let base_url = `${APIURL}/API/get_products_by_idzz.php`;

      let form = new FormData();

      form.append(
        'token',
        'as23rlkjadsnlkcj23qkjnfsDKJcnzdfb3353ads54vd3favaeveavgbqaerbVEWDSC',
      );

      console.log('modalVisible', recent.toString());
      form.append('product_id', recent.toString());
      // console.log(recent.toString());
      // form.append('product_id', '84, 85');

      // eslint-disable-next-line no-undef
      const response = await fetch(base_url, {
        method: 'post',
        body: form,
      });

      const responseData = await response.json();
      console.log(responseData.Data, "newApi")
      const Success = responseData?.success;

      if (Success === false) {
        // throw new Error(responseData.Message);
      } else {
        const productDetails = responseData.Data;

        const productItems = productDetails.map(item => ({
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
          discount: parseInt(item.discount),
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

        // const waitingforAsync = await getrecentyview();

        setProductItem(responseData.Data);
      }
    } catch (error) {
      // Alert.alert(error.message);
      // console.log('recent error===>', error);
    }
    setLoading(false);
  };




  const getrecentyview = async () => {
    const userID = userDetails.user_id ? userDetails.user_id : 999999999999;
    const recentlyViewed = await AsyncStorage.getItem(`recentlyView${userID}`);

    recentlyViewApi(JSON.parse(recentlyViewed));
  };

  const getSubCategory = useCallback(async () => {
    setLoading(true);
    try {
      let base_url = `${APIURL}/API/getAll_subcategories.php`;
      let form = new FormData();
      form.append(
        'token',
        'as23rlkjadsnlkcj23qkjnfsDKJcnzdfb3353ads54vd3favaeveavgbqaerbVEWDSC',
      );
      // form.append('type', 'slider');

      // eslint-disable-next-line no-undef
      const response = await fetch(base_url, {
        method: 'post',
        body: form,
      });

      const responseData = await response.json();
      const Success = responseData?.success;

      if (Success == false) {
        throw new Error(responseData.Message);
      } else {
        const categoryImages = [];
        // responseData.Data.map((item, index) => {
        //   categoryImages.push(`${APIURL}/admin_panel/Uploads/${item.img}`);
        // });
        // setCatategorySliderImages(categoryImages);

        setSubCategory(responseData.Data);
      }
    } catch (error) {
      // Alert.alert(error.message);
      console.log(error.Message);
    }
    setLoading(false);
  }, []);

  const getCategorySlider = useCallback(async () => {
    // console.log('first');
    setLoading(true);
    try {
      let base_url = `${APIURL}/API/getsliders.php`;
      let form = new FormData();
      form.append(
        'token',
        'as23rlkjadsnlkcj23qkjnfsDKJcnzdfb3353ads54vd3favaeveavgbqaerbVEWDSC',
      );
      form.append('type', 'slider');

      // eslint-disable-next-line no-undef
      const response = await fetch(base_url, {
        method: 'post',
        body: form,
      });

      const responseData = await response.json();
      const Success = responseData?.success;

      if (Success === false) {
        throw new Error(responseData.Message);
      } else {
        const categoryImages = [];
        responseData.Data.map((item, index) => {
          categoryImages.push(`${APIURL}/admin_panel/Uploads/${item.img}`);
        });
        setCatategorySliderImages(categoryImages);
        // console.log(responseData.data);
      }
    } catch (error) {
      // Alert.alert(error.message);
      console.log(error.Message);
    }
    setLoading(false);

  }, []);
  const GetAllDeal = useCallback(async () => {
    // console.log('first');
    setLoading(true);
    try {
      let base_url = `${APIURL}/API/get_deals.php`;
      let form = new FormData();
      form.append(
        'token',
        'as23rlkjadsnlkcj23qkjnfsDKJcnzdfb3353ads54vd3favaeveavgbqaerbVEWDSC',
      );

      // eslint-disable-next-line no-undef
      const response = await fetch(base_url, {
        method: 'post',
        body: form,
      });

      const responseData = await response.json();
      const Success = responseData?.success;
      console.log('aaaaaaa', responseData)
      if (Success === false) {

        throw new Error(responseData.Message);
      } else {
        const dealData = responseData.deals_data.map(item => ({
          ...item,
          actualPrice: parseFloat(item.deal_cost).toFixed(0),
          price: item.deal_cost,
          discount: parseInt(
            100 -
            (parseFloat(item.deal_cost) / parseFloat(item.deal_price)) * 100,
          ),
          description: item.deal_description,
          image: item.deal_image,
          name: item.deal_name,
          //delete after api is done
          // numberofaddonAllowed: 4,
        }));

        setDealData(dealData);
      }
    } catch (error) {
      // Alert.alert(error.message);
      console.log(error.Message);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    getCategorySlider();
    DiscountProducts();
    GetAllDeal();
    recentlyViewApi()

    getrecentyview();
    getSubCategory();
  }, []);
  useFocusEffect(

    useCallback(() => {

      // recentlyViewApi();
      // DiscountProducts();


    }
      , []),
  );

  return isLoading ? (
    <Loader />
  ) : (
    <SafeAreaView
      style={[
        Platform.OS === 'android' ? styles.androidScreen : styles.iosScreen,
      ]}>
      <View style={{ backgroundColor: Colors.backgroundColor }}>
        <ImageBackground
          resizeMode="cover"
          style={{
            width: '100%',
            height: 110,
          }}
          source={require('../assets/photo.jpeg')}>
          <Text style={styles.headerTitleText}>Pizza Blitz</Text>
        </ImageBackground>
        <View style={styles.searchContainer}>
          <TouchableOpacity
            style={styles.searchInnerView}
            activeOpacity={0.6}
            onPress={() => navigation.navigate('search')}>
            <Text style={styles.searchInput}>{language.searchForMore}</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          onScroll={e => {
            var windowHeight = Dimensions.get('window').height,
              height = e.nativeEvent.contentSize.height,
              offset = e.nativeEvent.contentOffset.y;
            if (windowHeight + offset >= height) {
              loadMoreDiscountedPrice();
            }
          }}>
          <>
            <View>
              <Text style={[styles.featuredProductsText, { marginTop: 20 }]}>
                {language.subCategory}
              </Text>
            </View>
            <ScrollView
              showsHorizontalScrollIndicator={false}
              horizontal={true}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-around',
                  marginHorizontal: 10,
                  width: '100%',
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    width: '100%',
                  }}>
                  {subCategory?.map((item, index) => {
                    return (
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate('productList', {
                            subCategoryId: item.id,
                            categoryname: item.name,
                          })
                        }
                        key={index}
                        style={{
                          padding: 2,
                          borderWidth: 2,
                          borderColor: Colors.primary,
                          borderRadius: 12,
                        }}>
                        <Text
                          style={{
                            backgroundColor: Colors.primary,
                            fontWeight: 'bold',
                            textAlign: 'center',
                            paddingVertical: 10,
                            paddingHorizontal: 25,
                            borderRadius: 10,
                            color: 'white',
                          }}>
                          {item.name}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            </ScrollView>

            {/* <SliderBox
              res
              images={categorySliderImages}
              sliderBoxHeight={180}
              onCurrentImagePressed={index =>
                console.warn(`image ${index} pressed`)
              }
              dotColor="#FFEE58"
              inactiveDotColor="#90A4AE"
              paginationBoxVerticalPadding={20}
              autoplay
              circleLoop
              resizeMethod={'resize'}
              resizeMode={'cover'}
              paginationBoxStyle={{
                position: 'absolute',
                bottom: 0,
                padding: 0,
                // alignItems: 'center',
                // alignSelf: 'center',
                // justifyContent: 'center',
                // backgroundColor: 'rgba(0, 0, 0, 0.32)',
                paddingVertical: 0,
                marginBottom: 5,
              }}
              dotStyle={{
                width: 20,
                height: 3,
                borderRadius: 5,
                marginHorizontal: -5,

                backgroundColor: 'rgba(128, 128, 128, 0.92)',
              }}
              ImageComponentStyle={{ width: '95%', marginTop: 5 }}
              imageLoadingColor={Colors.primary}
            /> */}

            <Text style={styles.recentlyViewProductsText}>
              {language.recentlyViewProduct}
            </Text>
            {productItem.length == 0 ? (
              <Text style={styles.noItemText}>{language.noItemViewed}</Text>
            ) : (
              <View style={styles.recentlyViewProducts}>
                {productItem?.map(item => {
                  return (
                    <ViewProducts
                      onPress={() =>
                        navigation.navigate('productDetail', {
                          product: item.id,
                        })
                      }
                      key={item.id}
                      data={item}
                    />
                  );
                })}
              </View>
            )}
            {/* varient  */}
            {/* <Text style={styles.recentlyViewProductsText}>
              {language.deals}
            </Text> */}
            {/* {productItemVariation.length == 0 ? (
              <Text style={styles.noItemText}>{language.noDeals}</Text>
            ) : (
              <View style={styles.recentlyViewProducts}>
                {productItemVariation?.map((item, index) => {
                  return (
                    <ViewProducts
                      onPress={() =>
                        navigation.navigate('dealsDetail', {
                          product: { item },
                        })
                      }
                      key={index}
                      data={item}
                    />
                  );
                })}
              </View>
            )} */}


            {/* varient */}
            <Text style={styles.recentlyViewProductsText}>
              {language.deals}
            </Text>
            {dealData.length == 0 ? (
              <Text style={styles.noItemText}>{language.noDealsFound}</Text>
            ) : (
              <View style={styles.recentlyViewProducts}>
                {dealData?.map((item, index) => {
                  return (
                    <ViewProducts
                      onPress={() =>
                        navigation.navigate('dealsDetail', {
                          product: { item },
                        })
                      }
                      key={index}
                      data={item}
                    />
                  );
                })}
              </View>
            )}
            <Text style={styles.recentlyViewProductsText}>
              {language.discountedItems}
            </Text>
            {tenDiscountItems.length == 0 ? (
              <Text style={styles.noItemText}>No Discount Items</Text>
            ) : (
              <View style={styles.recentlyViewProducts}>
                {tenDiscountItems?.map((item, index) => {

                  return (
                    <ViewProducts
                      onPress={() =>
                        navigation.navigate('productDetail', {
                          product: item.id
                        })
                      }
                      key={index}
                      data={item}
                    />
                  );
                })}

                <View
                  style={{
                    width: '100%',
                  }}>
                  <LottieView
                    style={{
                      width: '100%',
                      height: 100,
                      alignSelf: 'center',
                      justifyContent: 'center',
                      marginBottom: 50,
                    }}
                    source={require('../assets/LootiFile/barLoader.json')}
                    autoPlay
                    speed={1}
                  />
                </View>
              </View>
            )}
          </>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  activity: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.backgroundColor,
  },
  iosScreen: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  androidScreen: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
  },
  headerTitleText: {
    color: 'white',
    fontSize: 25,
    fontFamily: 'Roboto-Bold',
    paddingLeft: 10,
    paddingTop: 10,
  },
  searchContainer: {
    // backgroundColor: 'pink',
  },

  searchInnerView: {
    marginTop: 10,
    marginHorizontal: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    paddingHorizontal: 5,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
  },
  searchInput: {
    paddingLeft: 10,
    fontFamily: 'OpenSans-Regular',
    fontSize: 14,
    color: Colors.grey,
  },
  featuredProducts: {
    // backgroundColor: 'yellow',
    marginTop: 5,
    marginBottom: 10,
  },
  featuredProductsText: {
    paddingLeft: 10,
    fontFamily: 'Roboto-Bold',
    marginBottom: 10,
  },
  recentlyViewProductsText: {
    paddingLeft: 10,
    fontFamily: 'Roboto-Bold',
    marginTop: 10,
  },
  recentlyViewProducts: {
    flexDirection: 'row',
    flexWrap: 'wrap',

    marginLeft: 3,
  },
  noItemText: {
    fontFamily: 'Roboto-Bold',
    // textAlign: 'center',
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 50,
  },
});

export default Dashboard;
