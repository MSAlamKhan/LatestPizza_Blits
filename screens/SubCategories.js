import { StyleSheet, Text, View, ScrollView } from 'react-native';
import React, { useState, useCallback, useContext } from 'react';
// import SubCategoryProducts from '../components/ProductsBoxes/SubCategoryProducts';
import CategoryProducts from '../components/ProductsBoxes/CategoryProducts';
import Colors from '../constants/Colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { APIURL } from '../constants/Url';
import { useFocusEffect } from '@react-navigation/native';
import Loader from '../components/Animatedfullscreen/Loader';
import NoData from '../components/Animatedfullscreen/NoData';
import { NativeScreenNavigationContainer } from 'react-native-screens';
import { AuthContext } from '../context/Auth';
// import {ScrollView} from 'react-native-gesture-handler';
export default function Categories({ route, navigation }) {
  const { categoryId, categoryName } = route.params;

  const [subCategory, setSubCategory] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const { language } = useContext(AuthContext);
  const getSubCategories = useCallback(async () => {
    setLoading(true);

    setSubCategory('noData');
    try {
      // console.log('check');
      let base_url = `${APIURL}/API/sub_categories.php`;

      let uploadData = new FormData();

      uploadData.append(
        'token',
        'as23rlkjadsnlkcj23qkjnfsDKJcnzdfb3353ads54vd3favaeveavgbqaerbVEWDSC',
      );

      uploadData.append('main_category_id', categoryId);

      // eslint-disable-next-line no-undef
      const response = await fetch(base_url, {
        method: 'post',
        body: uploadData,
      });

      const responseData = await response.json();

      if (responseData.status === true) {
        // throw new Error(responseData.Message);

        setSubCategory(responseData.Data);
      } else {
        setSubCategory('nodata');
      }
    } catch (error) {
      // console.log(error);
      alert(error.message);
    }
    setLoading(false);
  }, [categoryId]);

  useFocusEffect(
    useCallback(() => {
      getSubCategories();
    }, [getSubCategories]),
  );
  console.log('subc', subCategory);

  return isLoading ? (
    <Loader />
  ) : (
    <View style={styles.container}>
      <View style={styles.upperLayout}>
        <View style={styles.headerContainer}>
          <Ionicons
            color={Colors.textColor}
            name="arrow-back"
            size={30}
            onPress={() => navigation.goBack()}
          />
          <Text style={styles.title}>{categoryName}</Text>
          <Ionicons
            color={Colors.textColor}
            name="search"
            size={20}
            onPress={() => navigation.navigate('search')}
          />
        </View>
      </View>
      <View style={styles.lowerLayout}>
        <ScrollView style={{ flex: 1 }}>
          <View
            style={{
              marginTop: 10,
            }}>
            {subCategory === 'nodata' ? (
              <NoData />
            ) : (
              <View style={styles.categoryContainer}>
                {subCategory.map(item => {
                  return (
                    <CategoryProducts
                      onPress={() =>
                        navigation.navigate('productList', {
                          subCategoryId: item.id,
                          categoryname: item.name,
                        })
                        // console.log(item.id)
                      }
                      key={item.id}
                      data={item}
                    />
                  );
                })}
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

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
  lowerLayout: {
    backgroundColor: Colors.backgroundColor,
    flex: 1,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    // justifyContent: 'center',
  },
  title: {
    fontFamily: 'Roboto-Bold',
    fontSize: 18,
    color: Colors.textColor,
  },
  categoryContainer: {
    marginHorizontal: 15,
    paddingBottom: 20,
    flexDirection: 'row',
    flex: 1,

    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});
