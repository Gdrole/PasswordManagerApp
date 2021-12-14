import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as Pages from 'src/pages';
import globalStyle from 'src/globalStyles';

export type StackParams = {
    Main: undefined;
    Passwords: undefined;
    Create: undefined;
};

export type StackNavigation = NativeStackNavigationProp<StackParams>;

const Stack = createNativeStackNavigator<StackParams>();

export const AppNavigator = () => {

    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName={'Main'}
                screenOptions={{
                    headerStyle: {
                        backgroundColor: globalStyle.colors.pageBackground,
                        
                    },
                    headerTintColor: globalStyle.colors.primary,
                    headerTitleStyle: {
                        fontFamily: 'Roboto-Medium',
                        color: globalStyle.colors.primary,
                        fontSize: globalStyle.font.fontSize.large
                    },
                    headerTitleAlign: 'center',
                    title: 'Vault'
                }}
            >
                <Stack.Screen
                    name={'Main'}
                    component={Pages.Main}
                    options={{
                        header: () => null,
                    }}
                />
                <Stack.Screen
                    name={'Passwords'}
                    component={Pages.Passwords}

                />
                <Stack.Screen
                    name={'Create'}
                    component={Pages.Create}

                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};