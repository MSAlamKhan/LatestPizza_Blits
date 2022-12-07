import React, {useState, useCallback} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Alert,
  SafeAreaView,
} from 'react-native';
import Colors from '../constants/Colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useFocusEffect} from '@react-navigation/native';
import {WebView} from 'react-native-webview';
import Loader from '../components/Animatedfullscreen/Loader';
import {APIURL} from '../constants/Url';
const TermsPrivacy = ({navigation}) => {
  const [loading, setLoading] = useState(false);
  const [termCondition, setTermCondition] = useState();

  const getPrivacy = async () => {
    setLoading(true);
    try {
      let base_url = `${APIURL}/API/terms_condition.php`;

      // eslint-disable-next-line no-undef
      const response = await fetch(base_url, {
        method: 'get',
        // headers: headers,
      });

      const responseData = await response.json();
      responseData.data.map(item => {
        setTermCondition(item.terms_condition);
      });
      // setPrivacy(responseData?.data);

      // console.log(responseData?.data?.terms?.content_a);
      // if (responseData.status === false) {
      //   throw new Error(responseData.message);
      // } else {
      //   //
      // }
    } catch (error) {
      Alert.alert(error.message);
    }
    setLoading(false);
  };
  useFocusEffect(
    useCallback(() => {
      getPrivacy();
    }, []),
  );

  return loading ? (
    <Loader />
  ) : (
    <SafeAreaView style={styles.container}>
      {/* <ScrollView contentContainerStyle={{flexGrow: 1, alignItems: 'center'}}> */}
      <View
        style={{
          backgroundColor: Colors.primary,
          flexDirection: 'row',
          paddingVertical: 20,
          paddingHorizontal: 10,
        }}>
        <Ionicons
          onPress={() => navigation.goBack()}
          name="arrow-back"
          size={28}
        />
        <Text
          style={{
            fontSize: 20,
            fontFamily: 'Roboto-Bold',
            paddingLeft: 10,
          }}>
          Term Conditions
        </Text>
      </View>

      <WebView
        originWhitelist={['*']}
        source={{
          html: `
            <html>
              <head>
                <meta
                  name="viewport"
                  content="width=device-width, initial-scale=1.0"
                />
              </head>
              <body >${termCondition ? termCondition : '<p> No Data</p>'}</body>
            </html>
          `,
        }}
      />

      {/* </ScrollView> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  activity: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
    // paddingHorizontal: 5,
    // paddingVertical: 10,
  },
  text: {
    paddingTop: 10,
    fontSize: 14,
    color: Colors.black,
    fontFamily: 'Roboto-Regular',
  },
});

export default TermsPrivacy;
