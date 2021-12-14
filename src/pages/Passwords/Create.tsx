import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useContext } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import CustomInput from 'src/components/CustomInput';
import Page from "src/components/Page"
import globalStyle, { PAGE_SPACE } from 'src/globalStyles';
import { RealmContext } from 'src/modules/db';
import Password from 'src/modules/db/schemas/Password';
import { StackParams } from 'src/navigation/AppNavigator';

type CreateNavigationProp = NativeStackNavigationProp<
    StackParams,
    'Create'
>;

const Create = () => {

    const navigation = useNavigation<CreateNavigationProp>();
    const { realm } = useContext(RealmContext);

    const { handleSubmit, control } = useForm({
        mode: 'onSubmit',
        reValidateMode: 'onChange',
        defaultValues: {
            for: '',
            username: '',
            password: '',
        },
    });


    const onAddPassword = async (data: Password) => {
        try {
            if (realm) {
                realm.write(() => {
                    realm.create('Password', Password.generate(data));
                });
                navigation.goBack();
            }
        }
        catch (e) {
            console.log(e);
            Alert.alert('Error', 'Failed to store password!');
        }

    }

    return (
        <Page>
            <View style={{ flex: 1 }}>
                <Controller
                    control={control}
                    name="for"
                    render={({
                        field: { onChange, value },
                        fieldState: { error },
                    }) => (
                        <CustomInput errorMessage={error ? error.message : ''} onChangeText={onChange} value={value} placeholder={'For'} autoCompleteType={'for'} />
                    )}
                />

                <Controller
                    control={control}
                    name="username"
                    render={({
                        field: { onChange, value },
                        fieldState: { error },
                    }) => (
                        <CustomInput errorMessage={error ? error.message : ''} onChangeText={onChange} value={value} placeholder={'Username'} autoCompleteType={'username'} />
                    )}
                />
                <Controller
                    control={control}
                    name="password"
                    render={({
                        field: { onChange, value },
                        fieldState: { error },
                    }) => (
                        <CustomInput errorMessage={error ? error.message : ''} onChangeText={onChange} value={value} placeholder={'Password'} autoCompleteType={'password'} />
                    )}
                />

            </View>
            <View style={{ justifyContent: 'flex-end', paddingBottom: PAGE_SPACE }}>
                <Pressable onPress={handleSubmit(onAddPassword)} style={styles.addButtonContainer}>
                    <Text style={styles.addButtonText}>
                        ADD PASSWORD
                    </Text>
                </Pressable>
            </View>

        </Page>
    )
}

const styles = StyleSheet.create({
    addButtonContainer: {
        backgroundColor: globalStyle.colors.primary,
        width: '100%',
        padding: PAGE_SPACE,
        borderColor: globalStyle.colors.transparent,
        borderRadius: PAGE_SPACE / 2
    },

    addButtonText: {
        fontSize: globalStyle.font.fontSize.medium,
        color: globalStyle.colors.black,
        textAlign: 'center'
    }
});


export default Create;
