import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React, {useState, useContext, useCallback} from 'react';
import Colors from '../constants/Colors';

import AntDesign from 'react-native-vector-icons/AntDesign';
import {AuthContext} from '../context/Auth';

const Help = () => {
  const [toogle, setToogle] = useState(false);
  const [toogle1, setToogle1] = useState(false);
  const [toogle2, setToogle2] = useState(false);
  const [toogle3, setToogle3] = useState(false);
  const [toogle4, setToogle4] = useState(false);

  const {language} = useContext(AuthContext);
  // console.log('userDetails.user_id', userDetails.user_id);
  return (
    <View style={styles.container}>
      <View style={styles.upperLayout}>
        <Text style={styles.title}>Help</Text>
      </View>

      <View style={styles.lowerLayout}>
        <ScrollView>
          <View style={styles.faqContaioner}>
            <Text style={styles.faqText}>{language.faq}</Text>
            <TouchableOpacity
              onPress={() => setToogle(prev => !prev)}
              style={styles.faqItems}>
              <Text style={styles.faqItemsText}>
                How to activate loyalty card ?
              </Text>

              <AntDesign name="down" size={15} color={Colors.textLighestGrey} />
            </TouchableOpacity>
            {toogle && (
              <Text style={styles.faqDescriptionText}>
                You can go to profile option from bottom bar and then loyalty
                card. After this you can simply hit Activate card to activate
                your loyalty card.
              </Text>
            )}
          </View>

          <TouchableOpacity
            onPress={() => setToogle1(prev => !prev)}
            style={styles.faqItems}>
            <Text style={styles.faqItemsText}>What does loyalty card do ?</Text>

            <AntDesign name="down" size={15} color={Colors.textLighestGrey} />
          </TouchableOpacity>
          {toogle1 && (
            <Text style={styles.faqDescriptionText}>
              By this card you can make purchase and even you can give our card
              number to other users to use your wallet balance.
            </Text>
          )}

          <TouchableOpacity
            onPress={() => setToogle2(prev => !prev)}
            style={styles.faqItems}>
            <Text style={styles.faqItemsText}>
              Why I can&apos;t place order ?
            </Text>

            <AntDesign name="down" size={15} color={Colors.textLighestGrey} />
          </TouchableOpacity>
          {toogle2 && (
            <Text style={styles.faqDescriptionText}>
              In order to make the purchase you will need to subscribe to the
              app. There is 500 INR charges to activate your subscription every
              month.
            </Text>
          )}

          <TouchableOpacity
            onPress={() => setToogle3(prev => !prev)}
            style={styles.faqItems}>
            <Text style={styles.faqItemsText}>What is referral program ?</Text>

            <AntDesign name="down" size={15} color={Colors.textLighestGrey} />
          </TouchableOpacity>
          {toogle3 && (
            <Text style={styles.faqDescriptionText}>
              The referral program is a way to share and earn basically you can
              share your referral code to others and if they singed up using
              your referral code then you will get benefit.
            </Text>
          )}

          <TouchableOpacity
            onPress={() => setToogle4(prev => !prev)}
            style={styles.faqItems}>
            <Text style={styles.faqItemsText}>
              What is the benefit of referral program ?
            </Text>

            <AntDesign name="down" size={15} color={Colors.textLighestGrey} />
          </TouchableOpacity>
          {toogle4 && (
            <Text style={styles.faqDescriptionText}>
              Every month whoever used your referral code when signed up will
              renew there subscription you will get 250 INR.
            </Text>
          )}
          <Text style={styles.FaqTermText}>{language.faqAndTerm}</Text>
        </ScrollView>
      </View>
    </View>
  );
};

export default Help;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  upperLayout: {
    flex: 1,
  },
  title: {
    fontFamily: 'Roboto-Bold',
    fontSize: 18,
    color: Colors.textColor,
    paddingLeft: 20,
    paddingTop: 20,
  },

  lowerLayout: {
    flex: 10,
    backgroundColor: Colors.backgroundColor,
  },
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
  FaqTermText: {
    fontFamily: 'Roboto-Bold',
    textAlign: 'center',
    marginVertical: 20,
  },
});
