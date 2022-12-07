import React, {useContext} from 'react';
import {
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  Image,
  TouchableOpacity,
} from 'react-native';
import Colors from '../constants/Colors';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import Accounts from './AccountTabs/Accounts';
import Wishlist from './AccountTabs/Wishlist';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {AuthContext} from '../context/Auth';
import {APIURL} from '../constants/Url';
// import {TouchableOpacity} from 'react-native-gesture-handler';

const renderScene = SceneMap({
  first: Accounts,
  second: Wishlist,
});
const renderTabBar = props => (
  <TabBar
    {...props}
    bounces={true}
    // scrollEnabled={true}
    activeColor={'#fff'}
    inactiveColor={'black'}
    labelStyle={{fontFamily: 'Roboto-Bold'}}
    indicatorStyle={{backgroundColor: Colors.primary}}
    style={{
      backgroundColor: '#999',
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
    }}
  />
);
const AccountSetting = ({navigation}) => {
  const layout = useWindowDimensions();
  const {userDetails, language} = useContext(AuthContext);
  const [index, setIndex] = React.useState(0);

  const [routes] = React.useState([
    {key: 'first', title: language.accounts},
    {key: 'second', title: language.myWishlist},
  ]);
  return (
    <View style={styles.container}>
      <View style={styles.upperLayout}>
        <Text style={styles.title}>{language.accountSetting}</Text>
        <View style={styles.profileContainer}>
          <Image
            style={styles.profilePicture}
            source={{
              uri: `${APIURL}/API/uploads/${userDetails.profilepic}`,
            }}
          />

          <Text style={styles.nameText}>{userDetails.name}</Text>

          <TouchableOpacity
            onPress={() => navigation.navigate('editProfile')}
            style={styles.iconsContainer}>
            <MaterialIcons
              color={'white'}
              name="edit"
              size={25}
              style={{textAlign: 'center'}}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.lowerLayout}>
        <TabView
          renderTabBar={renderTabBar}
          navigationState={{index, routes}}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{width: layout.width}}
        />
      </View>
    </View>
  );
};

export default AccountSetting;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  upperLayout: {
    // flex: 1,
    justifyContent: 'space-between',
    minHeight: 140,
  },
  title: {
    fontFamily: 'Roboto-Bold',
    fontSize: 18,
    color: Colors.textColor,
    paddingLeft: 20,
    paddingTop: 20,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingBottom: 10,
  },
  profilePicture: {
    width: 80,
    height: 80,
    borderRadius: 100,
    // alignSelf: 'center',
  },
  nameText: {
    fontFamily: 'Roboto-Bold',
    color: Colors.textColor,
    // alignSelf: 'center',
    width: '40%',
    // backgroundColor: 'blue',
    textAlign: 'center',
    fontSize: 20,
    // paddingVertical: 10,
  },
  iconsContainer: {
    padding: 5,
    borderRadius: 100,

    marginLeft: 50,

    backgroundColor: Colors.iconBackground,
  },

  lowerLayout: {
    flex: 4,
    backgroundColor: Colors.primary,

    // paddingTop: 30,
    // paddingHorizontal: 30,
  },
});
