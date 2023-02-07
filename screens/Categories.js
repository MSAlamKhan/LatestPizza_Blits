import React, { useCallback, useEffect, useState, useContext } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import CategoryProducts from '../components/ProductsBoxes/CategoryProducts';
import Colors from '../constants/Colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Loader from '../components/Animatedfullscreen/Loader';
import { APIURL } from '../constants/Url';
import { useFocusEffect } from '@react-navigation/native';
import { AuthContext } from '../context/Auth';

const Categories = ({ route, navigation }) => {
  const { language } = useContext(AuthContext);
  const [categories, setCategories] = useState([]);

  const [isLoading, setLoading] = useState();
  const getMainCategories = async () => {
    try {
      setLoading(true);
      let base_url = `${APIURL}/API/main_categories.php`;

      let uploadData = new FormData();

      uploadData.append(
        'token',
        'as23rlkjadsnlkcj23qkjnfsDKJcnzdfb3353ads54vd3favaeveavgbqaerbVEWDSC',
      );

      // eslint-disable-next-line no-undef
      const response = await fetch(base_url, {
        method: 'post',
        body: uploadData,
      });

      const responseData = await response.json();

      if (responseData.status === false) {
        throw new Error(responseData.Message);
      } else {
        setCategories(responseData.Data);
      }
    } catch (error) {
      // Alert.alert(error.message);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getMainCategories();
  }, []);

  // useFocusEffect(
  //   useCallback(() => {
  //     getMainCategories();
  //     // Upcoming();
  //   }, []),
  // );

  // const {mainCategoryId} = route.params;

  // const [subCategory, setSubCategory] = useState([]);

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
          <Text style={styles.title}>{language.allCategories}</Text>
          <TouchableOpacity onPress={() => navigation.navigate('search')}>
            <Ionicons color={Colors.textColor} name="search" size={20} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.lowerLayout}>
        <View
          style={{
            marginTop: 10,
          }}>
          <ScrollView>
            <View style={styles.categoryContainer}>
              {categories.map(item => {
                return (
                  <CategoryProducts
                    onPress={() =>
                      navigation.navigate('subCategories', {
                        categoryId: item.id,
                        categoryName: item.name,
                      })
                    }
                    key={item.id}
                    data={item}
                  />
                );
              })}
            </View>
          </ScrollView>
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
    backgroundColor: Colors.primary,
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

export default Categories;
