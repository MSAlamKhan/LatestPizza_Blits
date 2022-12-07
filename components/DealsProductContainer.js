import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React, {useContext} from 'react';
import {APIURL} from '../constants/Url';
import Colors from '../constants/Colors';
import {AuthContext} from '../context/Auth';

const DealsProductContainer = props => {
  const {language} = useContext(AuthContext);
  const data = props.data;

  return (
    <View style={styles.productContainer}>
      <View style={{flexDirection: 'row'}}>
        <View>
          <Image
            resizeMode="cover"
            style={styles.image}
            source={{
              uri: `${APIURL}/admin_panel/Uploads/${data.items_products[0].prod_img}`,
            }}
          />
        </View>
        <View
          style={{
            marginLeft: 10,
            // paddingLeft: 10,
            alignSelf: 'center',
            width: '53%',
          }}>
          <Text style={styles.itemTitle}>
            {data?.items_products[0]?.prod_name}
          </Text>
          {/* <Text style={styles.itemTitle}>samsung 60 inch tv </Text> */}

          {data?.items_products[0]?.addons.length == 0 ? null : (
            <>
              <Text style={styles.addonsTitle}>{language.addons}</Text>
              <ScrollView
                nestedScrollEnabled={true}
                style={{
                  maxHeight: 40,
                  borderBottomWidth: 0.5,
                  borderBottomColor: Colors.grey,
                }}>
                {data?.items_products[0].addons?.items.map((item, index) => {
                  return (
                    <View style={styles.addonsContainer} key={index}>
                      <Text
                        style={{
                          color: 'black',
                          width: '65%',
                          fontSize: 12,
                          // backgroundColor: 'pink',
                        }}>
                        {item.as_name}
                      </Text>
                      <Text style={{color: 'black', fontSize: 12}}>
                        x{item.quantity}
                      </Text>
                      {item.sum > 0 && (
                        <Text
                          numberOfLines={1}
                          style={{color: 'black', fontSize: 12}}>
                          € {item.sum}
                        </Text>
                      )}
                    </View>
                  );
                })}
              </ScrollView>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <Text style={{fontSize: 12}}>Addons Total Price:</Text>
                <Text style={{textAlign: 'right', fontSize: 12}}>
                  {data.items_products[0].addons.addonstotalAmount}
                </Text>
              </View>
            </>
          )}
          {data.items_products[0].dressing.length == 0 ? null : (
            <>
              <Text style={styles.addonsTitle}>{language.dressing}:</Text>
              <ScrollView nestedScrollEnabled={true} style={{maxHeight: 40}}>
                {data.items_products[0].dressing.map((item, index) => {
                  return (
                    <View style={styles.dressingContainer} key={index}>
                      <Text
                        style={
                          styles.addonsitemTitle
                          // backgroundColor: 'pink',
                        }>
                        {item.dressing_name}
                      </Text>
                      {/* <Text style={{color: 'black'}}>x{item.quantity}</Text> */}
                    </View>
                  );
                })}
              </ScrollView>
            </>
          )}
          {data.items_products[0].types.length == 0 ? null : (
            <>
              <Text style={styles.addonsTitle}>{language.type}</Text>
              <Text style={styles.addonsitemTitle}>
                {data.items_products[0]?.types[0]?.type_title}
              </Text>
            </>
          )}
        </View>
      </View>
    </View>
  );
};

export default DealsProductContainer;

const styles = StyleSheet.create({
  productContainer: {
    width: '100%',
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'center',
    alignItems: 'center',
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  image: {
    height: 50,
    width: 50,
    // borderRadius: 100,
    alignSelf: 'center',
    borderWidth: 0.1,
    borderColor: 'black',
    // backgroundColor: 'yellow',
  },
  itemTitle: {
    // flexWrap: 'wrap',
  },
  itemPrice: {
    color: 'green',
    fontFamily: 'Roboto-Regular',
  },
  itemOff: {
    color: 'green',
    fontFamily: 'Roboto-Regular',
  },
  addonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // backgroundColor: 'blue',
  },
  dressingContainer: {flexDirection: 'row'},

  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addonsTitle: {
    fontFamily: 'Roboto-Bold',
    fontSize: 14,
  },
  addonsitemTitle: {
    color: 'black',
    // width: '65%',
    fontSize: 12,
  },
});
