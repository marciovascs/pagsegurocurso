import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import Home from '../screens/Home';
import Search from '../screens/Search';
import Appointments from '../screens/Appointments';
import Profile from '../screens/Profile';
import Favorites from '../screens/Favorites';

const Tab = createBottomTabNavigator();

export default () => (
  <Tab.Navigator
    screenOptions={{
      tabBarStyle: { display: 'none' }, // Esconder a barra de navegação
      headerShown: false
    }}
  >
    <Tab.Screen
      name="Profile"
      options={{headerShown: false}}
      component={Profile}
    />
    <Tab.Screen
      name="Comprar"
      options={{headerShown: false}}
      component={Home}
      initialParams={{ totalValue: 0, productList: [] }}
    />
    <Tab.Screen name="Sobre" component={Search} />
    {/* <Tab.Screen name="Appointments" component={Appointments} />
    <Tab.Screen name="Favorites" component={Favorites} />
    <Tab.Screen name="Profile" component={Profile} /> */}
  </Tab.Navigator>
);
