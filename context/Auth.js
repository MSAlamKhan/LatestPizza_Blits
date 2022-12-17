import React, { createContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, ToastAndroid, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { english, german } from '../constants/Language';
import { createIconSetFromFontello } from 'react-native-vector-icons';
import { APIURL } from '../constants/Url';
import { add } from 'react-native-reanimated';

export const AuthContext = createContext({});

export const AuthProvider = props => {
  const [isLoading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userDetails, setUserDetails] = useState([]);
  const [subCategoryId, setSubCategoryId] = useState();
  const [selectedLanguage, setSelectedLanguage] = useState();
  const [language, setLanguage] = useState(english);
  const [isSignin, setIsSignin] = useState(false);
  const [paymentData, setPaymentData] = useState({});
  const [paymentPreviousData, setPaymentPreviousData] = useState([]);
  const [totalPayment, setTotalPayment] = useState();
  const [cardDetail, setCardDetail] = useState([]);
  const [locationData, setLocationData] = useState({});
  const [role, setRole] = useState('2');
  const [userData, setUserData] = useState({});
  const [addressList, setAddressList] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibleLoyal, setModalVisibleLoyal] = useState(false);
  const [thankyouScreen, setThankyouScreen] = useState(false);
  const [index, setIndex] = useState(null);
  const [selected, setSelected] = useState('');
  const [paypalToken, setPaypalToken] = useState(
    'eyJ2ZXJzaW9uIjoyLCJhdXRob3JpemF0aW9uRmluZ2VycHJpbnQiOiJleUowZVhBaU9pSktWMVFpTENKaGJHY2lPaUpGVXpJMU5pSXNJbXRwWkNJNklqSXdNVGd3TkRJMk1UWXRjMkZ1WkdKdmVDSXNJbWx6Y3lJNkltaDBkSEJ6T2k4dllYQnBMbk5oYm1SaWIzZ3VZbkpoYVc1MGNtVmxaMkYwWlhkaGVTNWpiMjBpZlEuZXlKbGVIQWlPakUyTmpVeU5ESTVNallzSW1wMGFTSTZJakF4T0RNME1tWmlMVGszTURndE5HTTBZaTFoWVRobExUVXhObUV6Tnpnek1URXpNaUlzSW5OMVlpSTZJbVJqY0hOd2VUSmljbmRrYW5JemNXNGlMQ0pwYzNNaU9pSm9kSFJ3Y3pvdkwyRndhUzV6WVc1a1ltOTRMbUp5WVdsdWRISmxaV2RoZEdWM1lYa3VZMjl0SWl3aWJXVnlZMmhoYm5RaU9uc2ljSFZpYkdsalgybGtJam9pWkdOd2MzQjVNbUp5ZDJScWNqTnhiaUlzSW5abGNtbG1lVjlqWVhKa1gySjVYMlJsWm1GMWJIUWlPblJ5ZFdWOUxDSnlhV2RvZEhNaU9sc2liV0Z1WVdkbFgzWmhkV3gwSWwwc0luTmpiM0JsSWpwYklrSnlZV2x1ZEhKbFpUcFdZWFZzZENKZExDSnZjSFJwYjI1eklqcDdmWDAuMXVZZlVYZ1YwVm9ySDJBZWZkVzhEMk5oSXJxYjZnWUJPaVZCb0pBdmxNSWNqeVZ4Y3JmVFZwZEtyZ0R2X19Lc25obWU1Xzl4WmphOHo5aW9rdXpOSmciLCJjb25maWdVcmwiOiJodHRwczovL2FwaS5zYW5kYm94LmJyYWludHJlZWdhdGV3YXkuY29tOjQ0My9tZXJjaGFudHMvZGNwc3B5MmJyd2RqcjNxbi9jbGllbnRfYXBpL3YxL2NvbmZpZ3VyYXRpb24iLCJncmFwaFFMIjp7InVybCI6Imh0dHBzOi8vcGF5bWVudHMuc2FuZGJveC5icmFpbnRyZWUtYXBpLmNvbS9ncmFwaHFsIiwiZGF0ZSI6IjIwMTgtMDUtMDgiLCJmZWF0dXJlcyI6WyJ0b2tlbml6ZV9jcmVkaXRfY2FyZHMiXX0sImNsaWVudEFwaVVybCI6Imh0dHBzOi8vYXBpLnNhbmRib3guYnJhaW50cmVlZ2F0ZXdheS5jb206NDQzL21lcmNoYW50cy9kY3BzcHkyYnJ3ZGpyM3FuL2NsaWVudF9hcGkiLCJlbnZpcm9ubWVudCI6InNhbmRib3giLCJtZXJjaGFudElkIjoiZGNwc3B5MmJyd2RqcjNxbiIsImFzc2V0c1VybCI6Imh0dHBzOi8vYXNzZXRzLmJyYWludHJlZWdhdGV3YXkuY29tIiwiYXV0aFVybCI6Imh0dHBzOi8vYXV0aC52ZW5tby5zYW5kYm94LmJyYWludHJlZWdhdGV3YXkuY29tIiwidmVubW8iOiJvZmZsaW5lIiwiY2hhbGxlbmdlcyI6WyJjdnYiLCJwb3N0YWxfY29kZSJdLCJ0aHJlZURTZWN1cmVFbmFibGVkIjp0cnVlLCJhbmFseXRpY3MiOnsidXJsIjoiaHR0cHM6Ly9vcmlnaW4tYW5hbHl0aWNzLXNhbmQuc2FuZGJveC5icmFpbnRyZWUtYXBpLmNvbS9kY3BzcHkyYnJ3ZGpyM3FuIn0sImFwcGxlUGF5Ijp7ImNvdW50cnlDb2RlIjoiVVMiLCJjdXJyZW5jeUNvZGUiOiJVU0QiLCJtZXJjaGFudElkZW50aWZpZXIiOiJtZXJjaGFudC5jb20uYnJhaW50cmVlcGF5bWVudHMuYXBwbGUtcGF5LWRlbW8uQnJhaW50cmVlLURlbW8iLCJzdGF0dXMiOiJtb2NrIiwic3VwcG9ydGVkTmV0d29ya3MiOlsidmlzYSIsIm1hc3RlcmNhcmQiLCJhbWV4IiwiZGlzY292ZXIiLCJtYWVzdHJvIl19LCJwYXlwYWxFbmFibGVkIjp0cnVlLCJicmFpbnRyZWVfYXBpIjp7InVybCI6Imh0dHBzOi8vcGF5bWVudHMuc2FuZGJveC5icmFpbnRyZWUtYXBpLmNvbSIsImFjY2Vzc190b2tlbiI6ImV5SjBlWEFpT2lKS1YxUWlMQ0poYkdjaU9pSkZVekkxTmlJc0ltdHBaQ0k2SWpJd01UZ3dOREkyTVRZdGMyRnVaR0p2ZUNJc0ltbHpjeUk2SW1oMGRIQnpPaTh2WVhCcExuTmhibVJpYjNndVluSmhhVzUwY21WbFoyRjBaWGRoZVM1amIyMGlmUS5leUpsZUhBaU9qRTJOalV5TkRJM09UUXNJbXAwYVNJNklqVTRObVF6T0RObUxXRTJOR010TkRSbE9DMDVNbVpqTFRReFl6SmpNMlEzWm1SbE5pSXNJbk4xWWlJNkltUmpjSE53ZVRKaWNuZGthbkl6Y1c0aUxDSnBjM01pT2lKb2RIUndjem92TDJGd2FTNXpZVzVrWW05NExtSnlZV2x1ZEhKbFpXZGhkR1YzWVhrdVkyOXRJaXdpYldWeVkyaGhiblFpT25zaWNIVmliR2xqWDJsa0lqb2laR053YzNCNU1tSnlkMlJxY2pOeGJpSXNJblpsY21sbWVWOWpZWEprWDJKNVgyUmxabUYxYkhRaU9uUnlkV1Y5TENKeWFXZG9kSE1pT2xzaWRHOXJaVzVwZW1VaUxDSnRZVzVoWjJWZmRtRjFiSFFpWFN3aWMyTnZjR1VpT2xzaVFuSmhhVzUwY21WbE9sWmhkV3gwSWwwc0ltOXdkR2x2Ym5NaU9udDlmUS5rT3M0ZEtwaThGT3BERGlId2FLYlNYX2laY3dHTThhdHdGSWZfU0lmLUZBWWpEMUcwWlRJTFBCN3pWQ3pteHNxX2JhZ1gtQWdDRlRiTEdJTUNneFM2dyJ9LCJwYXlwYWwiOnsiYmlsbGluZ0FncmVlbWVudHNFbmFibGVkIjp0cnVlLCJlbnZpcm9ubWVudE5vTmV0d29yayI6dHJ1ZSwidW52ZXR0ZWRNZXJjaGFudCI6ZmFsc2UsImFsbG93SHR0cCI6dHJ1ZSwiZGlzcGxheU5hbWUiOiJBY21lIFdpZGdldHMsIEx0ZC4gKFNhbmRib3gpIiwiY2xpZW50SWQiOiJBYjRUanJISXI2ajFoSVVjVGFaWkJiZkxlQVo5cV9RQVJqUGFFVTV2ek0xUFJiX2RFM0dOM1pPS0hMb3JfZUlnWkVrM1dPM0sxV1QxOVRYNiIsInByaXZhY3lVcmwiOiJodHRwOi8vZXhhbXBsZS5jb20vcHAiLCJ1c2VyQWdyZWVtZW50VXJsIjoiaHR0cDovL2V4YW1wbGUuY29tL3RvcyIsImJhc2VVcmwiOiJodHRwczovL2Fzc2V0cy5icmFpbnRyZWVnYXRld2F5LmNvbSIsImFzc2V0c1VybCI6Imh0dHBzOi8vY2hlY2tvdXQucGF5cGFsLmNvbSIsImRpcmVjdEJhc2VVcmwiOm51bGwsImVudmlyb25tZW50Ijoib2ZmbGluZSIsImJyYWludHJlZUNsaWVudElkIjoibWFzdGVyY2xpZW50MyIsIm1lcmNoYW50QWNjb3VudElkIjoic3RjaDJuZmRmd3N6eXR3NSIsImN1cnJlbmN5SXNvQ29kZSI6IlVTRCJ9fQ==',
  );
  // const [addressList, setAddressList] = useState(false);
  const [cart, setCart] = useState({
    items: [],
    totalAmount: 0,
    addonsPrice: 0,
  });
  const [dealCart, setDealCart] = useState({
    items: [],
    totalAmount: 0,
    totalAddonsPrice: 0,
  });
  const [wishlist, setWishlist] = useState([]);
  const [recentlyView, setRecentlyView] = useState([]);
  const objectsEqual = (o1, o2) =>
    typeof o1 === 'object' && Object.keys(o1).length > 0
      ? Object.keys(o1).length === Object.keys(o2).length &&
      Object.keys(o1).every(p => objectsEqual(o1[p], o2[p]))
      : o1 === o2;
  const arraysEqual = (a1, a2) =>
    a1.length === a2.length && a1.every((o, idx) => objectsEqual(o, a2[idx]));
  const validateProductExistence = product => {
    console.log('products', product);
    let condition = false;
    for (let i = 0; i < cart.items.length; i++) {
      if (product.id == cart.items[i].id) {
        console.log(product.type);
        console.log(cart.items[i].type);

        console.log(
          'arraytype',
          JSON.stringify(product.type) === JSON.stringify(cart.items[i].type),
        );
        if (
          product.addons.length == cart.items[i].addons.length &&
          product.dressing.length == cart.items[i].dressing.length
        ) {
          if (
            arraysEqual(product.addons, cart.items[i].addons) &&
            arraysEqual(product.dressing, cart.items[i].dressing) &&
            JSON.stringify(product.type) === JSON.stringify(cart.items[i].type)
            // && JSON.stringify(product.types) == JSON.stringify(cart.items[i].dressing)
          ) {
            condition = true;
            break;
          } else {
            condition = false;
          }
          // console.log('true');
        } else {
          condition = false;
        }
        // console.log(true);
      } else {
        condition = false;
      }
    }
    return condition;
  };

  const AddCart = useCallback(
    product => {

      console.log('condtion======>', validateProductExistence(product));
      if (validateProductExistence(product)) {
        const productToAdd = cart.items.find(item => {
          return item.id === product.id;
        });

        const updatedItems = cart.items.map((item, index) => {
          // const updatedItemsAddOns = item.addons.map((item, index) => item.id);

          if (
            item.id === productToAdd.id &&
            arraysEqual(product.addons, item.addons) &&
            arraysEqual(product.dressing, item.dressing) &&
            JSON.stringify(product.type) === JSON.stringify(item.type)
            // arraysEqual(product.type, item.type)
          ) {
            console.log('quanitity add');
            return {
              ...item,
              quantity: item.quantity + 1,
              price: item.price,
              sum: (
                parseFloat(item.sum) +
                item.price +
                product.totalAddonPrice
              ).toFixed(2),
            };
          }
          return item;
        });

        setCart(prev => {
          const cartDetails = JSON.stringify({
            ...prev,
            items: updatedItems,

            totalAmount: (
              parseFloat(cart.totalAmount) +
              product.price +
              product.totalAddonPrice
            ).toFixed(2),
            addonsPrice: cart.addonsPrice + product.totalAddonPrice,
          });
          AsyncStorage.setItem('cart', cartDetails);
          return {
            ...prev,
            items: updatedItems,

            totalAmount: (
              parseFloat(cart.totalAmount) +
              product.price +
              product.totalAddonPrice
            ).toFixed(2),
            addonsPrice: (
              parseFloat(cart.addonsPrice) + product.totalAddonPrice
            ).toFixed(2),
          };
        });
      } else {
        setCart(prev => {
          const newItems = prev.items.concat({
            ...product,
            // is_deal: 'no',
            sum: (product.price + product.totalAddonPrice).toFixed(2),
            quantity: 1,
          });
          const cartDetails = JSON.stringify({
            ...prev,

            items: newItems,
            totalAmount: (
              parseFloat(cart.totalAmount) +
              product.price +
              product.totalAddonPrice
            ).toFixed(2),
            addonsPrice: (
              parseFloat(cart.addonsPrice) + product.totalAddonPrice
            ).toFixed(2),
          });
          AsyncStorage.setItem('cart', cartDetails);
          return {
            ...prev,
            items: newItems,

            totalAmount: (
              parseFloat(cart.totalAmount) +
              product.price +
              product.totalAddonPrice
            ).toFixed(2),
            addonsPrice: (
              parseFloat(cart.addonsPrice) + product.totalAddonPrice
            ).toFixed(2),
          };
        });
      }
    },
    [cart],
  );

  const RemoveCart = useCallback(
    (product, indexitem) => {
      const productToRemove = cart.items.find(item => {
        return item.id === product.id;
      });
      const productAlreadyPresent = cart.items.includes(productToRemove);

      if (productAlreadyPresent) {
        ///fix updatedItems

        if (product.quantity > 1) {
          const reduceQuantity = cart.items.map(item => {
            if (
              item.id === product.id &&
              arraysEqual(product.addons, item.addons)
            ) {
              return {
                ...item,
                quantity: item.quantity - 1,
                price: item.price,
                sum: (
                  parseFloat(item.sum) -
                  item.price -
                  product.totalAddonPrice
                ).toFixed(2),
              };
            }
            return item;
          });
          setCart(prev => {
            const cartDetails = JSON.stringify({
              ...prev,
              items: reduceQuantity,
              totalAmount: (
                parseFloat(cart.totalAmount) -
                product.price -
                product.totalAddonPrice
              ).toFixed(2),
              addonsPrice: (
                parseFloat(cart.addonsPrice) - product.totalAddonPrice
              ).toFixed(2),
            });
            AsyncStorage.setItem('cart', cartDetails);
            return {
              ...prev,
              items: reduceQuantity,
              totalAmount: (
                parseFloat(cart.totalAmount) -
                product.price -
                product.totalAddonPrice
              ).toFixed(2),
              addonsPrice: (
                parseFloat(cart.addonsPrice) - product.totalAddonPrice
              ).toFixed(2),
            };
          });
        } else {
          setCart(prev => {
            const filterItems = prev.items.filter(
              (item, index) => index !== indexitem,
            );
            console.log('filetered items=====>', filterItems);

            const cartDetails = JSON.stringify({
              ...prev,
              items: filterItems,
              totalAmount: (
                parseFloat(prev.totalAmount) -
                product.price -
                product.addonsPrice
              ).toFixed(2),
              addonsPrice: (
                parseFloat(cart.addonsPrice) - product.totalAddonPrice
              ).toFixed(2),
            });
            AsyncStorage.setItem('cart', cartDetails);

            return {
              ...prev,
              items: filterItems,
              totalAmount: (
                parseFloat(prev.totalAmount) -
                product.price -
                product.totalAddonPrice
              ).toFixed(2),
              addonsPrice: (
                parseFloat(cart.addonsPrice) - product.totalAddonPrice
              ).toFixed(2),
            };
          });
        }
      }
    },

    [cart],
  );

  const RemoveProduct = useCallback(
    product => {
      const productToRemove = cart.items.find(item => {
        return item.id === product.id;
      });
      const productAlreadyPresent = cart.items.includes(productToRemove);

      if (productAlreadyPresent) {
        ///fix updatedItems
        if (productToRemove) {
          setCart(prev => {
            const filterItems = prev.items.filter(
              item => item.id !== productToRemove.id && product,
            );

            const cartDetails = JSON.stringify({
              ...prev,
              items: filterItems,
              totalAmount: (
                parseFloat(prev.totalAmount) -
                parseFloat(productToRemove.sum) -
                product.totalAddonPrice
              ).toFixed(2),
            });
            AsyncStorage.setItem('cart', cartDetails);

            return {
              ...prev,
              items: filterItems,
              totalAmount: (
                parseFloat(prev.totalAmount) -
                parseFloat(productToRemove.sum) -
                product.totalAddonPrice
              ).toFixed(2),
            };
          });
        }
      }
    },

    [cart.items],
  );

  const Logout = async () => {
    setLoading(true);
    try {
      await AsyncStorage.removeItem('userDetails');
      setUserDetails({});
      setIsAuthenticated(false);

      let base_url = `${APIURL}/API/login.php`;
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
    } catch (error) {
      Alert.alert(error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    const getDealsCart = async () => {
      const cartDealsDetails = await AsyncStorage.getItem('dealcart');

      if (cartDealsDetails != null) {
        setDealCart(JSON.parse(cartDealsDetails));
      }
    };
    const getLocalCart = async () => {
      const cartDetails = await AsyncStorage.getItem('cart');

      if (cartDetails != null) {
        setCart(JSON.parse(cartDetails));
      }
    };
    const getwishList = async () => {
      const wishListAsync = await AsyncStorage.getItem(
        `wishList${userDetails.user_id}`,
      );

      if (wishListAsync != null) {
        setWishlist(JSON.parse(wishListAsync));
      }
    };
    const getrecentyview = async () => {
      const userID = userDetails.user_id ? userDetails.user_id : 999999999999;
      console.log('userIDdddasdadsa', userID);
      const recentlyViewed = await AsyncStorage.getItem(
        `recentlyView${userID}`,
      );
      if (recentlyViewed != null) {
        setRecentlyView(JSON.parse(recentlyViewed));
      }
    };
    // const selectedLanguageAsync = async () => {
    //   const selectedlanguage = await AsyncStorage.getItem('language');

    //   if (selectedlanguage != null) {
    //     setSelectedLanguage(selectedlanguage);
    //     selectedlanguage == 'english'
    //       ? setLanguage(english)
    //       : setLanguage(german);
    //   }
    // };
    const AddressListAsync = async () => {
      const addresslist = await AsyncStorage.getItem(
        `Address${userDetails.user_id}`,
      );

      if (addresslist != null) {
        setAddressList(JSON.parse(addresslist));
      }
    };
    AddressListAsync();
    getrecentyview();
    getwishList();
    getLocalCart();
    getDealsCart();
    // selectedLanguageAsync();
  }, [userDetails.user_id]);

  const getUserDetails = useCallback(async () => {
    try {
      const UserDetailsJson = await AsyncStorage.getItem('userDetails');

      if (UserDetailsJson != null) {
        const UserDetails = JSON.parse(UserDetailsJson);
        setUserDetails(UserDetails);
        setIsSignin(true);
      }
    } catch (error) {
      Alert.alert(error.message);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        recentlyView,
        setRecentlyView,
        wishlist,
        setWishlist,
        selectedLanguage,
        setSelectedLanguage,
        isSignin,
        setIsSignin,
        language,
        setLanguage,
        AddCart,
        cart,
        setCart,
        RemoveCart,
        RemoveProduct,
        userDetails,
        setUserDetails,
        getUserDetails,
        isAuthenticated,
        subCategoryId,
        setSubCategoryId,
        Logout,
        setIsAuthenticated,
        isLoading,
        setPaymentData,
        paymentData,
        setPaymentPreviousData,
        paymentPreviousData,
        setTotalPayment,
        totalPayment,
        setCardDetail,
        cardDetail,
        setLocationData,
        locationData,
        setRole,
        role,
        setUserData,
        userData,
        addressList,
        setAddressList,
        modalVisible,
        setModalVisible,
        modalVisibleLoyal,
        setModalVisibleLoyal,
        thankyouScreen,
        setThankyouScreen,
        index,
        setIndex,
        selected,
        setSelected,
        paypalToken,
        dealCart,
        setDealCart,
      }}>
      {props.children}
    </AuthContext.Provider>
  );
};