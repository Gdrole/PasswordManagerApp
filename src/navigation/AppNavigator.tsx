import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as Pages from 'src/pages';

export type StackParams = {
    Main: undefined;
};

export type StackNavigation = NativeStackNavigationProp<StackParams>;

const Stack = createNativeStackNavigator();

export const AppNavigator = () => {

    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName={'Main'}
                screenOptions={{
                    headerBackTitleVisible: false,
                }}
            >
                <Stack.Screen
                    name={'Main'}
                    component={Pages.Main}
                    options={{
                        header: () => null,
                    }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};
