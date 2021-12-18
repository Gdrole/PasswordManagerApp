import React, { FC } from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import CustomInput from "src/components/CustomInput";
import Page from "src/components/Page";
import * as Keychain from 'react-native-keychain';
import globalStyle, { PAGE_SPACE } from "src/globalStyles";
import { CommonActions, useNavigation } from "@react-navigation/native";

interface Login {
	username: string;
	password: string;
}

const Main: FC = () => {

	const navigation = useNavigation();

	const { handleSubmit, control } = useForm({
		mode: 'onSubmit',
		reValidateMode: 'onChange',
		defaultValues: {
			username: '',
			password: ''
		},
	});

	const onLoginPress = async (data: Login) => {

		try {	
			await Keychain.setGenericPassword(data.username, data.password);

			const credentials = await Keychain.getGenericPassword();

			if (credentials) {

				navigation.dispatch(
					CommonActions.reset({
						index: 0,
						routes: [
							{ name: 'Passwords' },
						]
					})
				);

			}
		} catch (error) {
			console.log(error);
			Alert.alert('Error', 'Failed to login!');
		}
	}

	return (
		<Page>
			<View style={styles.inputContainer}>
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
						<CustomInput secureTextEntry={true} errorMessage={error ? error.message : ''} onChangeText={onChange} value={value} placeholder={'Password'} autoCompleteType={'password'} />
					)}
				/>

				<Pressable onPress={handleSubmit(onLoginPress)} style={styles.loginButtonContainer}>
					<Text style={styles.loginButtonText}>
						LOGIN
					</Text>
				</Pressable>

			</View>
		</Page>
	);
}

const styles = StyleSheet.create({
	inputContainer: {
		alignItems: 'center',
		justifyContent: 'center',
		flex: 1,
		flexDirection: 'column'
	},

	loginButtonContainer: {
		backgroundColor: globalStyle.colors.primary,
		width: '100%',
		padding: PAGE_SPACE,
		borderColor: globalStyle.colors.transparent,
		borderRadius: PAGE_SPACE / 2
	},

	loginButtonText: {
		fontSize: globalStyle.font.fontSize.medium,
		color: globalStyle.colors.black,
		textAlign: 'center'
	}
});

export default Main;
