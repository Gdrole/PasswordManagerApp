import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useContext, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, Pressable, StyleSheet, Text, View, NativeModules } from "react-native";
import CustomInput from 'src/components/CustomInput';
import Page from "src/components/Page"
import globalStyle, { PAGE_SPACE } from 'src/globalStyles';
import { RealmContext } from 'src/modules/db';
import Password from 'src/modules/db/schemas/Password';
import { StackParams } from 'src/navigation/AppNavigator';
import Utils from 'src/services/Utils';
import * as Keychain from 'react-native-keychain';
import _sodium from 'libsodium-wrappers';
import { FC } from 'react';
import { useEffect } from 'react';
import { Slider, Switch } from 'react-native-elements';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

var Aes = NativeModules.Aes;

type CreateNavigationProp = NativeStackNavigationProp<
	StackParams,
	'Create'
>;

interface PasswordForm {
	for: string;
	username: string;
	password: string;
	algorithm: string;
}

const symbols = "!#$%&()*+,-./:;<=>?@{}[]|";

const Create: FC = () => {

	const navigation = useNavigation<CreateNavigationProp>();
	const { realm } = useContext(RealmContext);

	const [passwordLength, setPasswordLength] = useState(15);

	const [useSymbols, setUseSymbols] = useState(true);
	const [isStrong, setIsStrong] = useState(true);

	const { handleSubmit, control, setValue, watch } = useForm<PasswordForm>({
		mode: 'onSubmit',
		reValidateMode: 'onChange',
		defaultValues: {
			for: '',
			username: '',
			password: '',
			algorithm: ''
		},
	});

	useEffect(() => {
		onRandomPress();

		if (watch().password.length < 15 && !useSymbols) {
			setIsStrong(false);
		}
		else setIsStrong(true);
	}, [passwordLength, useSymbols]);

	const onAddPassword = async (data: PasswordForm) => {
		try {
			await _sodium.ready;
			const sodium = _sodium;

			const credentials = await Keychain.getGenericPassword();

			if (credentials) {
				const date = new Date();
				const keySetupDate = new Date();
				
				const key = await Aes.pbkdf2(credentials.password, '', 10000, 128);
				// const key = await Aes.pbkdf2(credentials.password, '', 10000, 192);
				// const key = await Aes.pbkdf2(credentials.password, '', 10000, 256);
				console.log(`Key setup time: ${new Date().getMilliseconds() - keySetupDate.getMilliseconds()}ms`);

				const iv = await Aes.randomKey(16);
				const encryptedData = await Aes.encrypt(data.password, key, iv, 'aes-128-cbc');
				// const encryptedData = await Aes.encrypt(data.password, key, iv, 'aes-192-cbc');
				// const encryptedData = await Aes.encrypt(data.password, key, iv, 'aes-256-cbc');
				console.log(`Encrpytion time: ${new Date().getMilliseconds() - date.getMilliseconds()}ms`);

				if (realm) {
					realm.write(async () => {

						realm.create('Password', Password.generate({
							nonce: iv,
							password: encryptedData,
							username: data.username,
							for: data.for,
							algorithm: data.algorithm
						}));
					});
					navigation.goBack();
				}

				// const key = await Aes.pbkdf2(credentials.password, '', 10000, 256);
				//console.log(`Key setup time: ${new Date().getMilliseconds() - keySetupDate.getMilliseconds()}ms`);
				// const nonce = sodium.randombytes_buf(sodium.crypto_box_NONCEBYTES)
				// const encryptedData = sodium.crypto_aead_xchacha20poly1305_ietf_encrypt(data.password, null, null, nonce, new Uint8Array(Utils.stringToBytes(key)));
				//console.log(`Encrpytion time: ${new Date().getMilliseconds() - date.getMilliseconds()}ms`);

				// if (realm) {
				// 	realm.write(async () => {

				// 		realm.create('Password', Password.generate({
				// 			nonce: sodium.to_hex(nonce),
				// 			password: sodium.to_hex(encryptedData),
				// 			username: data.username,
				// 			for: data.for,
				// 			algorithm: data.algorithm
				// 		}));
				// 	});
				// 	navigation.goBack();
				// }
			}
		}
		catch (e) {
			console.log(e);
			Alert.alert('Error', 'Failed to store password!');
		}

	}

	const onRandomPress = async () => {
		await _sodium.ready;
		const sodium = _sodium;

		const randomPassword = sodium.randombytes_buf(passwordLength);

		if (useSymbols) {

			const hexPassword = sodium.to_hex(randomPassword);

			let password = hexPassword;

			for (let i = 0; i < 5; i++) {
				const symbolIndex = Math.floor(Math.random() * symbols.length);
				const passwordCharIndex = Math.floor(Math.random() * hexPassword.length);

				const replacement = symbols[symbolIndex];
				password = password.substr(0, passwordCharIndex) + replacement + password.substr(passwordCharIndex + replacement.length)
			}

			setValue('password', password);
			console.log(password);
		}
		else {
			const hexPassword = sodium.to_hex(randomPassword);
			setValue('password', hexPassword);
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
						<View style={{ flexDirection: 'column' }}>
							<CustomInput
								errorMessage={error ? error.message : ''}
								onChangeText={onChange}
								value={value}
								placeholder={'Password'}
								autoCompleteType={'password'}
								errorStyle={{ height: 0 }}
							/>
							{
								isStrong ? (
									<View style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: PAGE_SPACE / 1.85 }}>
										<MaterialCommunityIcons
											name={'shield-check'}
											color={globalStyle.colors.green}
											size={PAGE_SPACE * 1.5}
										/>
										<Text style={styles.strongPassword}>
											Strong
										</Text>
									</View>
								) : (
									<View style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: PAGE_SPACE / 1.85 }}>
										<MaterialCommunityIcons
											name={'shield-alert'}
											color={globalStyle.colors.orange}
											size={PAGE_SPACE * 1.5}
										/>
										<Text style={styles.moderatePassword}>
											Moderate
										</Text>
									</View>
								)
							}

						</View>

					)}
				/>

				<View style={styles.passwordOptionsContainer}>
					<View style={styles.rowContainer}>
						<View style={styles.optionContainer}>
							<Text style={styles.label}>
								Length: {watch().password.length}
							</Text>
						</View>
						<View style={styles.optionContainer}>
							<Slider
								value={passwordLength}
								onValueChange={setPasswordLength}
								maximumValue={50}
								minimumValue={5}
								step={1}
								trackStyle={{ height: 10, backgroundColor: globalStyle.colors.primary }}
								thumbStyle={{ height: 20, width: 20, backgroundColor: globalStyle.colors.primary }}
							/>
						</View>
					</View>
					<View style={styles.rowContainer}>
						<View style={styles.optionContainer}>
							<Text style={styles.label}>
								Use symbols
							</Text>
						</View>
						<View style={styles.optionContainer}>
							<Switch value={useSymbols} onChange={() => setUseSymbols(!useSymbols)} color={globalStyle.colors.primary} />
						</View>
					</View>
				</View>

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
	},

	label: {
		color: globalStyle.colors.white,
		fontSize: globalStyle.font.fontSize.medium
	},

	rowContainer: {
		justifyContent: 'center',
		flexDirection: 'row'
	},

	passwordOptionsContainer: {
		paddingTop: PAGE_SPACE,
		justifyContent: 'center',
		flexDirection: 'column',
		paddingHorizontal: PAGE_SPACE / 1.5
	},

	optionContainer: {
		flex: 1,
		justifyContent: 'center'
	},

	strongPassword: {
		color: globalStyle.colors.green,
		fontSize: globalStyle.font.fontSize.medium
	},

	moderatePassword: {
		color: globalStyle.colors.orange,
		fontSize: globalStyle.font.fontSize.medium
	}
});


export default Create;
