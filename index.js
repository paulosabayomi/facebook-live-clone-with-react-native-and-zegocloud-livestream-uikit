/**
 * @format
 */

import {AppRegistry} from 'react-native';
// import App from './App';
import {name as appName} from './app.json';
import RootProviders from './components/RootProviders';

AppRegistry.registerComponent(appName, () => RootProviders);
