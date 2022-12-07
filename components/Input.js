import React, {forwardRef} from 'react';
import {TextInput, StyleSheet, View, Text} from 'react-native';
import {useController} from 'react-hook-form';
import Colors from '../constants/Colors';

const Input = forwardRef((props, ref) => {
  const {field} = useController({
    control: props.control,
    defaultValue: '',
    name: props.name,
    rules: props.rules,
  });

  return props.type === 'special' ? (
    <View>
      <TextInput
        value={field.value}
        onChangeText={field.onChange}
        style={[styles.input, props.style]}
        placeholder={props.placeholder}
        secureTextEntry={props.secureTextEntry}
        multiline={props.multiline}
        numberOfLines={props.numberOfLines}
        returnKeyType={props.returnKeyType || 'next'}
        focusable={true}
        keyboardType={props.keyboardType}
        ref={props.ref}
        onSubmitEditing={props.onSubmitEditing}
        blurOnSubmit={props.blurOnSubmit}
        placeholderTextColor={Colors.textLighestGrey}
        maxLength={props.maxLength}
        editable={props.editable}
      />
      <Text onPress={props.update} style={styles.updateText}>
        Update
      </Text>
    </View>
  ) : (
    <TextInput
      value={field.value}
      onChangeText={field.onChange}
      style={[styles.input, props.style]}
      placeholder={props.placeholder}
      secureTextEntry={props.secureTextEntry}
      multiline={props.multiline}
      numberOfLines={props.numberOfLines}
      returnKeyType={props.returnKeyType || 'next'}
      focusable={true}
      keyboardType={props.keyboardType}
      ref={ref}
      onSubmitEditing={props.onSubmitEditing}
      blurOnSubmit={props.blurOnSubmit}
      placeholderTextColor={Colors.textLighestGrey}
      maxLength={props.maxLength}
      editable={props.editable}
    />
  );
});

const styles = StyleSheet.create({
  input: {
    // borderColor: Colors.lightBlue,
    color: Colors.textLighestGrey,
    // height: 40,
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'OpenSans-Regular',
    borderBottomWidth: 0.5,
    // borderWidth: 1,
    padding: 0,
    paddingVertical: 2,
    borderColor: Colors.textLighestGrey,
    marginBottom: 10,
  },
  updateText: {
    position: 'absolute',
    right: 10,
    top: 5,
    color: Colors.textBlue,
    fontFamily: 'Roboto-Regular',
    fontSize: 15,
  },
});

export default Input;
