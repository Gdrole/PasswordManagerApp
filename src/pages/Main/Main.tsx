import React, { FC, useContext } from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import CustomInput from "src/components/CustomInput";
import Page from "src/components/Page";
import * as Keychain from 'react-native-keychain';
import globalStyle, { PAGE_SPACE } from "src/globalStyles";
import { CommonActions, useNavigation } from "@react-navigation/native";
import { RealmContext } from "src/modules/db";
import { CONSTANTS } from "react-native-hash";
import Hashing from "src/services/Hashing";

import Sodium from 'react-native-libsodium';

interface Login {
	username: string;
	password: string;
}

const Main: FC = () => {

	const navigation = useNavigation();
	const { openRealm } = useContext(RealmContext);

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
			const c = new Uint8Array(66)
			const m = new Uint8Array(50)
			const key = new Uint8Array(32)
			const nonce = new Uint8Array(24)
			nonce.fill(1)
			key.fill(2)
		
			const x = Sodium.crypto_aead_xchacha20poly1305_ietf_keygen()
			// Sodium.crypto_aead_xchacha20poly1305_ietf_encrypt(c, m, new Uint8Array(0), null, nonce, key)
			// Sodium.crypto_aead_xchacha20poly1305_ietf_decrypt(m, null, c, new Uint8Array(0), nonce, key)
		
			// const scalar = new Uint8Array(32)
			// Sodium.crypto_core_ed25519_scalar_random(scalar)
			// Sodium.crypto_scalarmult_ed25519_base(key, scalar)
			// Sodium.crypto_core_ed25519_add(key, key, key)
		
			// Sodium.crypto_scalarmult_ed25519(key, scalar, key)
			// Sodium.crypto_scalarmult_ed25519_noclamp(key, scalar, key)
			// Sodium.crypto_scalarmult_ed25519_base_noclamp(key, scalar)
		
			// const state = new Uint8Array(384)
			// Sodium.crypto_generichash_init(state, key, 24)
			// Sodium.crypto_generichash_update(state, state)
			// Sodium.crypto_generichash_final(state, nonce)
		
			// Sodium.crypto_kdf_keygen(key)
			// Sodium.crypto_kdf_derive_from_key(nonce, 1, key.subarray(0, 8), key)
		
			// Sodium.crypto_pwhash(key, nonce, nonce.subarray(0, 16), 2, 67108864, 2)
			console.log(x)

			// await Keychain.setGenericPassword(data.username, data.password, { storage: Keychain.STORAGE_TYPE.AES });

			// const credentials = await Keychain.getGenericPassword();

			// if (credentials) {

			// 	const hash = await Hashing.hashString(data.password, CONSTANTS.HashAlgorithms.sha512);

			// 	await openRealm(hash);

			// 	navigation.dispatch(
			// 		CommonActions.reset({
			// 			index: 0,
			// 			routes: [
			// 				{ name: 'Passwords' },
			// 			]
			// 		})
			// 	);

			// }
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
