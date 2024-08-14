/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';

import {
  Platform,
  StatusBar,
  useColorScheme,
} from 'react-native';
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import HomeRoute from './components/routes/HomeRoute';
import StreamPage from './components/routes/StreamPage';

const Stack = createStackNavigator();

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
      />
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="Home" component={HomeRoute} />
        <Stack.Screen name="StreamPage" component={StreamPage} 
          options={{
            gestureDirection: 'vertical',
            cardStyleInterpolator: Platform.OS == 'ios' ? CardStyleInterpolators.forVerticalIOS : CardStyleInterpolators.forRevealFromBottomAndroid
          }} 
        />
      </Stack.Navigator>
    </>
  );
}

export default App;
