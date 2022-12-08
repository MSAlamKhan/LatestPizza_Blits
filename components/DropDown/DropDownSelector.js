import React from 'react';
import Colors from '../../constants/Colors';
import {SelectList} from 'react-native-dropdown-select-list';
import {StyleSheet} from 'react-native';

const DropDownSelector = (props) =>  {
  return (
    <SelectList
      onSelect={props.onSelect}
      setSelected={props.setSelected}
      data={props.data}
      placeholder={props.placeholder}
      inputStyles={styles.inputStyles}
      boxStyles={styles.boxStyles}
      dropdownStyles={styles.dropdownStyles}
      dropdownTextStyles={styles.dropdownTextStyles}
      //   search={false}
    />
  );
}

const styles = StyleSheet.create({
  dropdownStyles: {backgroundColor: 'white', borderWidth: 0},
  inputStyles: {
    fontSize: 15,
    // fontFamily: 'Roboto-Medium',
    paddingVertical: 2,
    color: Colors.textLighestGrey,

    // marginBottom: -5,
    // paddingVertical: 10,
  },
  boxStyles: {
    backgroundColor: 'white',
    borderColor: 'white',
    borderBottomColor: '#E1E1E1',
    paddingVertical: 3,
    paddingHorizontal: 10,
    marginHorizontal: 22,
    borderBottomWidth: 1,
    borderRadius: 0,
  },
  dropdownTextStyles: {
    fontSize: 15,
    fontFamily: 'Roboto-Medium',
    // paddingVertical: 2,
    color: Colors.textLighestGrey,
    borderBottomColor: Colors.textLighestGrey,
    borderBottomWidth: 1,
  },
});


export default DropDownSelector;