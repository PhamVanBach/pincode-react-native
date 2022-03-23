import React, { useState, useEffect, useRef } from 'react';
import {
  Text,
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
  Alert,
  Button
} from 'react-native';

function moveObjectOnArr(arr, _indexOf, _indexMoveTo){
  const myIndex = arr.map((item) => {
    return item.number;
  }).indexOf(_indexOf);
  arr.push(arr.splice(arr[myIndex], 1)[0]);
}

// to generate serial number based on count as argument
const getSerialNumbers = (count) => {
  const numbersArray = [];
  for (let i = 0; i < count; i++) {
    if(i == 10){
      numbersArray.push({
        number: '',
        isNumber: true,
        isSpace: true
      });
    }else{
      numbersArray.push({
        number: i.toString(),
        isNumber: true,
        isSpace: false
      });
    }
  }

  moveObjectOnArr(numbersArray, '0');
  return numbersArray;
};

export default function App() {
  const [passwords, setPassword] = useState(['', '', '', '', '', '']);

  useEffect(() => {
    if (!passwords.includes('')) {
      handleSubmitPassCode();
    }
  }, [passwords]);

  const onPressNumber = (num) => {
    if(!wrong){
      let tempPassCode = [...passwords];
      for (var i = 0; i < tempPassCode.length; i++) {
        if (tempPassCode[i] == '') {
          tempPassCode[i] = num;
          break;
        }else {
          continue;
        }
      }
      setPassword(tempPassCode);
    }
  };

  const onPressBack = (num) => {
    let tempPassCode = [...passwords];
    for (let i = tempPassCode.length - 1; i >= 0; i--) {
      if (tempPassCode[i] != '') {
        tempPassCode[i] = '';
        break;
      } else {
        continue;
      }
    }
    setPassword(tempPassCode);
  };

  // Number Pad FlatList render each Item
  const renderNumPadBtnItem = ({ item }) => {
    if (!item.isNumber) {
      return (
        <TouchableOpacity
          onPress={() => onPressBack()}
          style={{
            // flex: 1,
            alignItems: 'center',
            marginHorizontal: 20,
            height: 70,
            width: 70,
            // backgroundColor: item.isSpace ? 'white' : '#ccc',
            borderRadius: 35,
            justifyContent: 'center',
            alignItems: 'center'
          }}>
          <Text style={{ color: 'black', fontSize: 20 }}>Delete</Text>
        </TouchableOpacity>
      );
    }
    return (
      <View
        style={{
          // flex: 1,
          alignItems: 'center',
          marginHorizontal: 20,
          height: 70,
          width: 70,
          backgroundColor: item.isSpace ? 'transparentsr' : '#ccc',
          borderRadius: 35,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onStartShouldSetResponder={() => onPressNumber(item.number)}
        pointerEvents={wrong ? 'none' : 'auto'}
      >
        <Text style={{ color: 'black', fontSize: 24 }}>{item.number}</Text>
        {/* <Button 
          title={item.number}
          onPress={() => onPressNumber(item.number)} 
          disabled={wrong ? true : false}
        /> */}
      </View>
    );
  };

  // NumberPad FlatList
  const renderNumberKeyPad = () => {
    const numkeyPadData = getSerialNumbers(11);
    return (
      <FlatList
        numColumns={3}
        ItemSeparatorComponent={() => <View style={{ padding: 3 }} />}
        data={[...numkeyPadData, { isNumber: false }]}
        renderItem={renderNumPadBtnItem}
        keyExtractor={(item) => item.number}
      />
    );
  };

  console.log(passwords.join(''));

  const handleSubmitPassCode = () => {
    const passCodeStringVal = passwords.join('');
    if (passwords.join('') != 123456) {
      setWrong(true);
      runAnimation();
      handleClearPassCode();
    } else {
      alert(passCodeStringVal);
    }
  };

  const handleClearPassCode = () => {
    setPassword(['', '', '', '', '', '']);
  };

  const shake = useRef(new Animated.Value(0)).current;

  const [wrong, setWrong] = useState(false);

  const translateXAnim = shake.interpolate({
    inputRange: [0, .4, .8, 1.2, 1.6, 2],
    outputRange: [0, 8, -8, 8, -8, 0],
  });

  const getAnimationStyles = () => ({
    transform: [
      {
        translateX: translateXAnim,
      },
    ],
  });

  const runAnimation = () => {
    Animated.timing(shake, {
        toValue: 2,
        duration: 700,
        easing: Easing.out(Easing.sin),
        useNativeDriver: true,
    }).start((finished) => {
      shake.setValue(0);
      if(finished){  
        setWrong(false);
      }
    });
  };

  return (
    <View style={styles.containerWrap}>
      <Animated.View style={[styles.passCodeContainer, getAnimationStyles()]}>
        {passwords.map((pItem) => {
          return (
            <View
              key={pItem + Math.random()}
              style={[
                styles.passCodeBox,
                {
                  backgroundColor: pItem != '' ? '#96DED1':
                  wrong ? 'red'
                  : 'white',
                },
              ]}>
              {/* <Text
                style={{
                  color: pItem ? 'white' : 'black',
                  fontWeight: 'bold',
                  fontSize: 18,
                  opacity: pItem ? 1 : 0.2,
                }}>
                {pItem ? pItem : '0'}
              </Text> */}
            </View>
          );
        })}
      </Animated.View>

        <View style={{
          flex: 1,
          justifyContent: 'center'
        }}>
         <View style={styles.spacingM12}>{renderNumberKeyPad()}</View>
        </View>

      <TouchableOpacity
        onPress={() => handleClearPassCode()}
        style={[
          {
            alignItems: 'center',
            marginHorizontal: 3,
            backgroundColor: '#4630EB',
            padding: 12,
          },
        ]}>
        <Text style={{ color: 'white', fontWeight: 'bold' }}>
          Reset Passcode
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  containerWrap: {
    flex: 1,
  },
  passCodeContainer: {
    // backgroundColor: '#00A36C',
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    flex: .3,
    alignItems: 'center',
    paddingHorizontal: 40
  },
  passCodeBox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'green',
  },
  spacingM12: {
    flex: .7,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
