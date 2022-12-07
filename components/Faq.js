import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Colors from '../constants/Colors';
import AntDesign from 'react-native-vector-icons/AntDesign';
const Faq = () => {
  return (
    <View style={styles.faqContaioner}>
      <Text style={styles.faqText}>Frequently Ask Questions</Text>
      <View style={styles.faqItems}>
        <Text style={styles.faqItemsText}>How to activate my LoyaltyCard?</Text>

        <AntDesign name="down" size={15} color={Colors.textLighestGrey} />
      </View>
      <Text style={styles.faqDescriptionText}>
        its goona be very long paragrapgh testing purponse its goona be very
        long paragrapgh testing purponseits goona be very long paragrapgh
        testing purponse its goona be very long paragrapgh testing purponse
      </Text>
      <Text>FAQ and Term & Conditon</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  faqContaioner: {
    marginTop: 20,
  },
  faqText: {
    paddingHorizontal: 20,
    fontFamily: 'Roboto-Bold',
    fontSize: 18,
  },
  faqItems: {
    paddingHorizontal: 20,
    paddingBottom: 10,
    borderBottomWidth: 0.5,
    color: Colors.textLighestGrey,
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  faqItemsText: {
    fontFamily: 'Roboto-Light',
    fontSize: 13,
    color: Colors.textLighestGrey,
  },
  faqDescriptionText: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
});
export default Faq;
