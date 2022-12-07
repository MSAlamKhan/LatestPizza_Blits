import React, {useState, useCallback} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Alert,
  TextInput,
  FlatList,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import Colors from '../constants/Colors';
import SearchComp from '../components/SearchComp';
import {useFocusEffect} from '@react-navigation/core';
import {APIURL} from '../constants/Url';
import {ScrollView} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Loader from '../components/Animatedfullscreen/Loader';

const Search = () => {
  const [searchProduct, setSearchProduct] = useState('');
  const [searchData, setSearchData] = useState([]);
  const [allProducts, setAllProducts] = useState([]);

  const [isLoading, setLoading] = useState(false);
  const navigation = useNavigation();

  const getAllProducts = useCallback(async () => {
    setSearchData([]);
    setLoading(true);
    try {
      let base_url = `${APIURL}/API/getallproducts.php`;
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

      if (Success === false) {
        throw new Error(responseData.message);
      } else {
        const productDetails = responseData.Data;
        const productItem = [];

        productDetails.forEach(item => {
          productItem.push({
            name: item.name,
            description: item.description,
            actualPrice: parseFloat(item.price).toFixed(0),
            price: parseFloat(item.cost),

            id: parseInt(item.id),
            quantity: 0,
            sum: 0,
            discount: parseFloat(100 - (item.cost / item.price) * 100).toFixed(
              2,
            ),
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
          });
        });
        setSearchData(productItem);
        setAllProducts(productItem);
      }
    } catch (error) {
      console.log(error.message);
    }
    setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      getAllProducts();
      return () => setSearchProduct('');
    }, []),
  );

  const setProducts = text => {
    setSearchProduct(text);
    if (text) {
      setSearchData(
        allProducts.filter(item =>
          item.name.toLowerCase().includes(text.toLowerCase()),
        ),
      );
    } else {
      // setAllProducts(searchData);
    }
    // setAllProducts(searchData);
  };

  return isLoading ? (
    <Loader />
  ) : (
    // <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    //   <KeyboardAvoidingView
    //     behavior={Platform.OS === 'ios' ? 'p*Qadding' : 'height'}
    //     style={styles.screen}>
    // <ScrollView style={styles.screen}>
    <View style={{flex: 1}}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            flexDirection: 'row',
            alignContent: 'center',
            alignItems: 'center',
          }}>
          <Ionicons
            style={[styles.paymentButtonText, {fontSize: 30}]}
            name="arrow-back-outline"
            color={'white'}
          />
          <Text style={{marginLeft: 10, fontWeight: 'bold', color: 'white'}}>
            Back
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.mainContainer}>
        <View style={styles.searchConatiner}>
          <Text style={styles.searchTitle}>Search At Pizza Blitz</Text>
          <View style={styles.searchArea}>
            <TextInput
              placeholder="Search..."
              value={searchProduct}
              // name="search"
              // onKeyPress={({nativeEvent}) => {
              //   nativeEvent.key === 'Backspace' && setProductsOnBack;
              // }}
              style={styles.searchInput}
              onChangeText={setProducts}
              // multiline={true}
              // onSubmitEditing={setProducts}
              placeholderTextColor="black"
            />
          </View>
        </View>

        {searchProduct != '' && (
          <View style={styles.productConatiner}>
            {/* {allProducts.map((item, index) => {
              return <SearchComp key={index} data={item} />;
            })} */}

            <FlatList
              data={searchData}
              keyExtractor={(item, index) => item.id}
              renderItem={({item}) => {
                return <SearchComp data={item} />;
              }}
            />
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    // paaddingHorizontal: 15,
    // marginVertical: 20,0
    paddingHorizontal: 10,
    paddingVertical: 20,
    marginBottom: 10,
    backgroundColor: Colors.primary,
  },
  activity: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.backgroundColor,
  },
  screen: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
  },
  mainContainer: {
    marginTop: 20,
  },
  searchConatiner: {
    marginHorizontal: 20,
  },
  searchTitle: {
    fontSize: 18,
    fontFamily: 'OpenSans-Regular',
    color: 'black',
  },
  searchArea: {
    marginTop: 10,
    width: '100%',
    borderWidth: 1.5,
    borderColor: Colors.primary,
    borderRadius: 10,
  },
  searchInput: {
    fontSize: 18,
    fontFamily: 'OpenSans-Regular',
    paddingHorizontal: 10,
    color: 'black',
  },
  productConatiner: {
    // marginTop: 30,
    marginHorizontal: 10,
    height: '82%',
    // marginVertical: 20,
    // backgroundColor: 'red',
  },
});

export default Search;
