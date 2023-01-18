import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import Modal from 'react-native-modal';
import Colors from '../../constants/Colors';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CommonButton from '../CommonButton';

const SelectDeals = props => {
  const [selectedAddons, setSelectedAddons] = useState({
    items: [],
    selectedAddonsQuantity: 0,
    addonstotalAmount: 0,
  });
  const data = props.data;
  const [selectedDressing, setSelectedDressing] = useState([]);
  const [selectedType, setSelectedType] = useState([]);
  const SelectItemsHandler = addons => {
    const productToAdd = selectedAddons.items.find(item => {
      return item.as_id === addons.as_id;
    });

    const productAlreadyAdded = selectedAddons.items.includes(productToAdd);

    if (productAlreadyAdded) {
      const updatedItems = selectedAddons.items.map(item => {
        if (item.as_id === productToAdd.as_id) {
          return {
            ...item,
            quantity: item.quantity + 1,

            sum: item.sum + parseFloat(addons.as_price),
          };
        }
        return item;
      });
      const updatedItemsWithFreeAddons = selectedAddons.items.map(item => {
        if (item.as_id === productToAdd.as_id) {
          return {
            ...item,
            quantity: item.quantity + 1,

            sum: 0,
          };
        }
        return item;
      });

      // eslint-disable-next-line no-unused-vars
      let itemValueDeclared = selectedAddons;
      if (
        itemValueDeclared.selectedAddonsQuantity >=
        parseInt(data.numberOfFreeitems)
      ) {
        itemValueDeclared = {
          items: updatedItems,
          selectedAddonsQuantity: itemValueDeclared.selectedAddonsQuantity + 1,
          addonstotalAmount:
            itemValueDeclared.addonstotalAmount + parseFloat(addons.as_price),
        };
      } else {
        itemValueDeclared = {
          items: updatedItemsWithFreeAddons,
          selectedAddonsQuantity: itemValueDeclared.selectedAddonsQuantity + 1,
          addonstotalAmount: 0,
        };
      }
      setSelectedAddons(itemValueDeclared);
    } else {
      let itemValueDeclared = selectedAddons;

      if (
        itemValueDeclared.selectedAddonsQuantity >=
        parseInt(data.numberOfFreeitems)
      ) {
        const newItems = itemValueDeclared.items.concat({
          ...addons,
          sum: parseFloat(addons.as_price),
          quantity: 1,
        });
        itemValueDeclared = {
          items: newItems,
          selectedAddonsQuantity: itemValueDeclared.selectedAddonsQuantity + 1,
          addonstotalAmount:
            itemValueDeclared.addonstotalAmount + parseFloat(addons.as_price),
        };
      } else {
        const newItems = itemValueDeclared.items.concat({
          ...addons,
          sum: 0,
          quantity: 1,
        });
        itemValueDeclared = {
          items: newItems,
          selectedAddonsQuantity: itemValueDeclared.selectedAddonsQuantity + 1,
          addonstotalAmount: 0,
        };
      }
      setSelectedAddons(itemValueDeclared);
    }
  };
  const removeSelectedItems = (addon, item) => {
    // console.log(id);
    console.log('addons paramas', selectedAddons.selectedAddonsQuantity);

    const filteditem = selectedAddons.items.filter(
      item => item.as_id != addon.as_id,
    );

    if (
      selectedAddons.selectedAddonsQuantity - addon.quantity >
      parseInt(data.numberOfFreeitems)
    ) {
      console.log('filtttttttttttttttt', filteditem);
      setSelectedAddons(prev => {
        return {
          ...prev,
          items: filteditem,
          selectedAddonsQuantity:
            selectedAddons.selectedAddonsQuantity - addon.quantity,
          addonstotalAmount: selectedAddons.addonstotalAmount - addon.sum,
        };
      });
    } else {
      setSelectedAddons(prev => {
        const FilterItemSumNeglected = filteditem.map(prev => {
          return {
            ...prev,
            sum: 0,
          };
        });
        console.log('FilterItemSumNeglected======>', FilterItemSumNeglected);
        return {
          ...prev,
          items: FilterItemSumNeglected,
          selectedAddonsQuantity:
            selectedAddons.selectedAddonsQuantity - addon.quantity,
          addonstotalAmount: 0,
        };
      });
    }
  };
  const selectedTypeMethod = item => {
    if (item.ts_id == selectedType[0]?.ts_id) {
      setSelectedType({});
    } else {
      setSelectedType([item]);
    }
  };
  const selectedDressingMethod = async item => {
    const isFound = selectedDressing.some(element => {
      if (element.ds_id === item.ds_id) {
        return true;
      }
      return false;
    });
    if (isFound) {
      setSelectedDressing(previousEmployeeData =>
        previousEmployeeData.filter((v, index) => v.ds_id != item.ds_id),
      );
    } else {
      setSelectedDressing(prev => prev.concat(item));
    }
  };
  const clearData = () => {
    setSelectedDressing([]);
    setSelectedType([]);
    setSelectedAddons({
      items: [],
      selectedAddonsQuantity: 0,
      addonstotalAmount: 0,
    });
  };

  return (
    <Modal
      visible={props.modalVisible}
      onBackButtonPress={props.backButton}
      onBackdropPress={props.onClose}
      style={styles.MainViewModal}
      // animationIn="slideInRight"
      // animationOut="slideOutLeft"
      // animationOutTiming={200}
      // animationInTiming={200}
      transparent={true}
      hideModalContentWhileAnimating={true}>
      <View style={[styles.modalInputsBox, {}]}>
        <TouchableOpacity
          onPressOut={() => clearData()}
          onPress={props.onClossPress}
          style={styles.crossIconContainer}>
          <Entypo name="circle-with-cross" color={'red'} size={30} />
        </TouchableOpacity>
        {data.addons.length > 0 && (
          <Text
            style={{
              color: 'black',
              paddingLeft: 10,

              fontSize: 16,
              fontWeight: 'bold',
              marginBottom: 5,
            }}>
            {data.addons.length > 0 ? data.addons[0].ao_title : null}
          </Text>
        )}
        {/* <FlatList
          data={data.addons[0].ao_data}
          key={item => item.as_id}
          renderItem={({item}) => {
            return <View></View>;
          }}
        /> */}
        {selectedAddons?.items?.length == 0 ? null : (
          <View
            style={{
              backgroundColor: '#fff',
              marginHorizontal: 10,
              paddingVertical: 5,
              borderRadius: 10,
              paddingHorizontal: 5,
              marginBottom: 10,
            }}>
            <FlatList
              data={selectedAddons.items}
              horizontal={true}
              keyExtractor={item => item.as_id}
              renderItem={({ item, index }) => {
                return (
                  <View
                    // onPress={() => {
                    //   SelectItemsHandler(item);
                    // }}
                    style={[styles.selectedaddonContainer]}>
                    <View
                      style={{
                        justifyContent: 'space-between',

                        flexDirection: 'row',
                        // width: '100%',
                      }}>
                      <View
                        style={{
                          // justifyContent: 'space-between',
                          flexDirection: 'row',

                          // width: '77%',
                        }}>
                        <Text
                          numberOfLines={1}
                          style={styles.selectedAddonNameText}>
                          {item.as_name}
                        </Text>
                        <Text style={styles.selectedAddonQuantityText}>
                          (x{item.quantity})
                        </Text>
                      </View>

                      <View
                        style={{
                          flexDirection: 'row',
                          paddingLeft: 20,
                        }}>
                        <Text style={styles.addonPriceText}>€ {item.sum}</Text>

                        <Entypo
                          name="circle-with-cross"
                          size={18}
                          onPress={() => removeSelectedItems(item)}
                          color={Colors.secondary}
                        />
                      </View>
                    </View>
                  </View>
                );
              }}
            />
          </View>
        )}
        <View style={{ height: 180 }}>
          <FlatList
            data={data.addons.length > 0 ? data.addons[0].ao_data : []}
            // horizontal={true}

            key={'_'}
            numColumns={2}
            keyExtractor={item => item.as_id}
            renderItem={({ item, index }) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    SelectItemsHandler(item);
                  }}
                  style={[styles.addonContainer]}>
                  <View
                    style={{
                      justifyContent: 'space-between',
                      flexDirection: 'row',
                      width: '100%',
                    }}>
                    <View
                      style={{
                        // justifyContent: 'space-between',
                        flexDirection: 'row',
                        // width: '80%',
                      }}>
                      <Text numberOfLines={1} style={styles.addonNameText}>
                        {item.as_name}
                      </Text>
                    </View>
                    <Text style={styles.addonPriceText}>€ {item.as_price}</Text>
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        </View>
        {data?.types?.length > 0 ? (
          <View
            style={{
              paddingHorizontal: 10,
              marginTop: 10,
              height: 100,
            }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: 'bold',
                marginBottom: 5,
                // paddingTop: 20,
              }}>
              {data?.types[0]?.type_title}
            </Text>

            <FlatList
              data={data?.types[0]?.type_data}
              keyExtractor={item => item.ts_id}
              key={'_'}
              numColumns={2}
              renderItem={({ item, index }) => {
                return (
                  <TouchableOpacity
                    activeOpacity={0.4}
                    onPress={() => {
                      selectedTypeMethod(item);
                      // SelectItemsHandler(item.id);
                    }}
                    style={[
                      styles.typeContainer,
                      {
                        borderColor:
                          selectedType[0]?.ts_id == item.ts_id
                            ? Colors.primary
                            : Colors.grey,
                        borderWidth:
                          selectedType[0]?.ts_id == item.ts_id ? 1 : 0,
                      },
                    ]}>
                    {/* <Checkbox
                        status={
                          'check'
                          // itemsValue.includes(item.id) ? 'checked' : 'unchecked'
                        }
                        uncheckedColor="black"
                        color={Colors.primary}
                      /> */}
                    <MaterialCommunityIcons
                      name={
                        selectedType[0]?.ts_id == item.ts_id
                          ? 'checkbox-blank-circle'
                          : 'checkbox-blank-circle-outline'
                      }
                      color={
                        selectedType[0]?.ts_id == item.ts_id
                          ? Colors.primary
                          : 'black'
                      }
                      size={15}
                    />
                    <View
                      style={{
                        justifyContent: 'space-between',
                        flexDirection: 'row',
                        // backgroundColor: 'blue',
                        width: '80%',
                      }}>
                      <Text
                        numberOfLines={1}
                        style={{
                          fontSize: 13,
                          width: '100%',
                          paddingLeft: 5,
                          // maxWidth: '120%',
                        }}>
                        {item.ts_name}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        ) : null}
        {data?.dressing.length > 0 ? (
          <View
            style={{
              paddingHorizontal: 10,
              // marginTop: 10,
            }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: 'bold',
                marginBottom: 5,
                // paddingTop: 20,
              }}>
              {data?.dressing[0]?.dressing_title}
            </Text>

            <FlatList
              data={data?.dressing[0]?.dressing_data}
              keyExtractor={item => item.ds_id}
              key={'_'}
              numColumns={2}
              renderItem={({ item, index }) => {
                const CheckedDressing = selectedDressing.some(
                  dressing => dressing.ds_id === item.ds_id,
                );
                return (
                  <TouchableOpacity
                    onPress={() => {
                      selectedDressingMethod(item);
                      // SelectItemsHandler(item.id);
                    }}
                    style={[
                      styles.typeContainer,
                      {
                        borderColor: CheckedDressing
                          ? Colors.primary
                          : Colors.grey,
                        borderWidth: CheckedDressing ? 1 : 0,
                      },
                    ]}>
                    {/* <Checkbox
                        status={
                          'check'
                          // itemsValue.includes(item.id) ? 'checked' : 'unchecked'
                        }
                        uncheckedColor="black"
                        color={Colors.primary}
                      /> */}
                    <MaterialCommunityIcons
                      name={
                        CheckedDressing
                          ? 'checkbox-blank-circle'
                          : 'checkbox-blank-circle-outline'
                      }
                      color={CheckedDressing ? Colors.primary : 'black'}
                      size={15}
                    />
                    <View
                      style={{
                        justifyContent: 'space-between',
                        flexDirection: 'row',
                        // backgroundColor: 'blue',
                        width: '80%',
                      }}>
                      <Text
                        numberOfLines={1}
                        style={{
                          fontSize: 13,
                          width: '100%',
                          paddingLeft: 5,
                          // maxWidth: '120%',
                        }}>
                        {item.dressing_name}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        ) : null}
        <View style={styles.addonsPriceContainer}>
          <Text style={styles.addonsPriceText}>
            Free Addons: {data.numberOfFreeitems}
          </Text>

          {selectedAddons.addonstotalAmount > 0 && (
            <Text style={styles.addonsPriceText}>
              Total Addon Price:{selectedAddons.addonstotalAmount}
            </Text>
          )}
        </View>
        <CommonButton
          onPress={() => {
            props.onPressSelect(
              selectedAddons,
              selectedType,
              selectedDressing,
              selectedAddons.addonstotalAmount,
              props.data.index,
            );
            console.log('====================================');
            console.log(selectedAddons, selectedType, selectedDressing, props.data.index);
            console.log('====================================');
            clearData();
          }}
          style={{ marginTop: 10 }}
          title={'Select'}
        />
      </View>
    </Modal>
  );
};

export default SelectDeals;

const styles = StyleSheet.create({
  MainViewModal: {
    flex: 1,
    justifyContent: 'center',
    margin: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 20,
  },
  modalInputsBox: {
    // flex: 1,
    backgroundColor: Colors.backgroundColor,
    paddingVertical: 20,
    // borderRadius: 5,
    borderRadius: 20,
  },
  crossIconContainer: {
    position: 'absolute',
    right: 0,
    top: -5,
    backgroundColor: '#fff',
    borderRadius: 100,
  },
  selectedaddonContainer: {
    alignItems: 'center',

    borderRadius: 10,
    backgroundColor: Colors.lightprimary,
    borderWidth: 1,
    // width: 250,
    borderColor: Colors.grey,
    marginHorizontal: 2.5,
    marginBottom: 2,
    paddingHorizontal: 5,
    paddingVertical: 5,
  },

  addonContainer: {
    // alignItem/s: 'center',
    backgroundColor: '#fff',
    borderRadius: 5,
    // borderWidth: 1,
    width: '46%',
    borderColor: Colors.grey,
    marginLeft: '2.6%',
    marginBottom: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  addonNameText: {
    fontFamily: 'Roboto-Regular',
    width: '80%',
  },
  addonQuantityText: {
    fontFamily: 'Roboto-Regular',
    paddingLeft: 10,
  },
  addonPriceText: {
    fontFamily: 'Roboto-Regular',
    // fontSize: 20,
    paddingRight: 6,
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 5,
    // borderWidth: 1,
    width: '48%',
    borderColor: Colors.grey,
    marginHorizontal: 2.5,
    marginBottom: 5,
    paddingHorizontal: 5,
    paddingVertical: 5,
  },
  addonsPriceContainer: {
    flexDirection: 'row',
    width: '90%',
    alignSelf: 'center',
    backgroundColor: '#FFF',
    justifyContent: 'space-around',
    paddingVertical: 5,
    marginTop: 10,
    borderRadius: 10,
  },
  addonsPriceText: {
    textAlign: 'center',
    fontFamily: 'Roboto-Bold',
    fontSize: 15,
  },
});
