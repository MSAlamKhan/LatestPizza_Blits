import React from 'react'
import {StyleSheet, Text, View} from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Colors from '../constants/Colors'

const NotificationBox = (props) => {
  return props.data.map((items) => {
    return (
      <View key={Math.random()} style={styles.container}>
        <View style={{flexDirection: 'row'}}>
          <View
            style={{
              width: 20,
              justifyContent: 'center',
              alignItems: 'center',
            }}></View>
          <View>
            <Text style={styles.titleText}>{items.purpose}</Text>
            <Text style={styles.messageText}>{items.content}</Text>
            {/* <Text style={styles.timeText}>{items.time}</Text> */}
            {/* <Text style={styles.timeText}>12:00</Text> */}
          </View>
        </View>
      </View>
    )
  })
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderColor: Colors.textLighestGrey,
    paddingVertical: 10,
  },

  titleText: {
    fontFamily: 'Roboto-Bold',
  },
  messageText: {
    fontFamily: 'Roboto-Regular',
  },
  timeText: {
    fontFamily: 'Roboto-Reglar',
    color: Colors.textLighestGrey,
  },
})
export default NotificationBox
