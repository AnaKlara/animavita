import AsyncStorage from '@react-native-community/async-storage';

export const sanitizeUsername = (name) => {
  if (name && name.length > 8) {
    return `\n ${name}`;
  }

  return name;
};

export const isEmpty = array => array instanceof Array && array.length === 0;

export const getUser = async () => JSON.parse(await AsyncStorage.getItem('@animativa:user'));