import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React, {useContext} from 'react';
import Entypo from 'react-native-vector-icons/Entypo';
import {useFocusEffect, useNavigation} from '@react-navigation/native';

import Colors from '../../constants/Colors';
import {AuthContext} from '../../context/Auth';
const Accounts = () => {
  const navigation = useNavigation();
  const {language} = useContext(AuthContext);
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() => navigation.navigate('transactions')}>
        <Text style={styles.itemTitle}>{language.transactions}</Text>
        <Entypo
          color={Colors.textLighestGrey}
          name="chevron-small-right"
          size={35}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate('addAddress')}
        style={styles.itemContainer}>
        <Text style={styles.itemTitle}>
          {/* {language.addAddress} */}
          Manage Address
        </Text>
        <Entypo
          color={Colors.textLighestGrey}
          name="chevron-small-right"
          size={35}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate('help')}
        style={styles.itemContainer}>
        <Text style={styles.itemTitle}>{language.help}</Text>
        <Entypo
          color={Colors.textLighestGrey}
          name="chevron-small-right"
          size={35}
        />
      </TouchableOpacity>

      <View style={styles.termPolicyContainer}>
        <Text
          onPress={() => navigation.navigate('terms')}
          style={styles.termPolicyText}>
          {language.termsOfUse}
        </Text>
        <Text
          onPress={() => navigation.navigate('privacy')}
          style={styles.termPolicyText}>
          {language.privacyPolicy}
        </Text>
        {/* <Text
          onPress={() => navigation.navigate('return')}
          style={styles.termPolicyText}>
          {language.returnPolicy}
        </Text> */}
      </View>
    </View>
  );
};

export default Accounts;

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: Colors.backgroundColor,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 30,
    borderBottomWidth: 0.5,
    paddingHorizontal: 20,
    alignItems: 'center',
    paddingBottom: 15,
    borderColor: Colors.textLighestGrey,
    marginTop: 20,
  },
  itemTitle: {
    fontFamily: 'Roboto-Medium',
    fontSize: 16,
    color: Colors.textBlackColor,
  },
  termPolicyContainer: {
    marginTop: 40,
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 20,
  },
  termPolicyText: {
    fontFamily: 'Roboto-Light',
    letterSpacing: -0.34,
  },
});
