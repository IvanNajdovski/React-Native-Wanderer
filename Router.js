import { createStackNavigator, createAppContainer } from 'react-navigation';
import Not from './components/Not';
import Hello from './components/Hello';

const RootStack = createStackNavigator(
    {
        Home: Hello,
        Not: Not,
    },
    {
        initialRouteName: 'Home',
    }
);

const AppContainer = createAppContainer(RootStack);

export default AppContainer;