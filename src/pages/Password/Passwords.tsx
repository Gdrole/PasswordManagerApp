import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { useContext } from 'react';
import { FC } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View, NativeModules } from "react-native";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Page from "src/components/Page"
import globalStyle, { PAGE_SPACE } from 'src/globalStyles';
import { RealmContext } from 'src/modules/db';
import { StackParams } from 'src/navigation/AppNavigator';
import Clipboard from '@react-native-clipboard/clipboard';
import Password from 'src/modules/db/schemas/Password';
import _sodium from 'libsodium-wrappers';
import * as Keychain from 'react-native-keychain';
import Utils from 'src/services/Utils';

var Aes = NativeModules.Aes;

type PasswordsNavigationProp = NativeStackNavigationProp<
	StackParams,
	'Passwords'
>;

const Passwords: FC = () => {

	const navigation = useNavigation<PasswordsNavigationProp>();
	const [isLoading, setIsLoading] = useState(false);
	const { passwords, realm } = useContext(RealmContext);

	const onDeletePress = (id: Realm.BSON.ObjectId) => {
		if (realm) {
			realm.write(() => {
				realm.delete(realm.objectForPrimaryKey('Password', id));
			});
		}
	}

	const onShowPassword = async (pass: Password) => {

		try {
			setIsLoading(true);
			await _sodium.ready;
			const sodium = _sodium;

			const credentials = await Keychain.getGenericPassword();

			if (credentials) {
				
				// const keySetupDate = new Date();
				// const key = await Aes.pbkdf2(credentials.password, '', 10000, 128);
				// const key = await Aes.pbkdf2(credentials.password, '', 10000, 192);
				// const key = await Aes.pbkdf2(credentials.password, '', 10000, 256);
				// console.log(`Key setup time: ${new Date().getMilliseconds() - keySetupDate.getMilliseconds()}ms`);
				
				// const date = new Date();
				// const password = await Aes.decrypt(pass.password, key, pass.nonce, 'aes-128-cbc');
				// const password = await Aes.decrypt(pass.password, key, pass.nonce, 'aes-192-cbc');
				// const password = await Aes.decrypt(pass.password, key, pass.nonce, 'aes-256-cbc');
				// console.log(`Decryption time: ${new Date().getMilliseconds() - date.getMilliseconds()}ms`);

				const keySetupDate = new Date();
				const key = await Aes.pbkdf2(credentials.password, '', 10000, 256);
				console.log(`Key setup time: ${new Date().getMilliseconds() - keySetupDate.getMilliseconds()}ms`);
				const date = new Date();
				const password = sodium.to_string(sodium.crypto_aead_xchacha20poly1305_ietf_decrypt(null, sodium.from_hex(pass.password), null, sodium.from_hex(pass.nonce), new Uint8Array(Utils.stringToBytes(key))));
				console.log(`Decryption time: ${new Date().getMilliseconds() - date.getMilliseconds()}ms`);

				Alert.alert(
					"Password",
					password,
					[
						{ text: "Copy", onPress: () => Clipboard.setString(password) }
					], {
					cancelable: true
				}
				);
			}

		}
		catch (e) {
			console.log(e);
			Alert.alert('Error', 'Failed to reveal password!');
		}
		finally {
			setIsLoading(false);
		}
	}

	return (
		<Page noMargin={true} isLoading={isLoading}>
			<ScrollView style={{ padding: PAGE_SPACE }}>
				{
					passwords.map((x, index) => {
						return (
							<Pressable key={index} onLongPress={() => onShowPassword(x)} style={styles.passwordContainer}>
								<Text style={{ color: globalStyle.colors.primary, fontSize: globalStyle.font.fontSize.small, marginBottom: 5 }}>
									{x.for.toUpperCase()}
								</Text>
								<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
									<View style={{ flexDirection: 'column' }}>
										<Text style={{ color: globalStyle.colors.white, fontSize: globalStyle.font.fontSize.medium }}>
											{x.username}
										</Text>
										<Text style={{ color: globalStyle.colors.white, fontSize: globalStyle.font.fontSize.medium }}>
											{new Realm.BSON.ObjectId().toHexString().replace(/./g, '*')}
										</Text>
									</View>
									<MaterialCommunityIcons name={'trash-can-outline'} color={globalStyle.colors.crimsonRed} size={PAGE_SPACE * 2} onPress={() => onDeletePress(x._id)} />
								</View>

							</Pressable>
						);
					})
				}
			</ScrollView>

			<Pressable onPress={() => navigation.navigate('Create')} style={styles.addButtonContainer}>
				<MaterialCommunityIcons name={'plus'} color={globalStyle.colors.black} size={PAGE_SPACE * 2} />
			</Pressable>
		</Page>
	)
}

const styles = StyleSheet.create({
	addButtonContainer: {
		position: 'absolute',
		bottom: 20,
		right: 20,
		justifyContent: 'center',
		alignItems: 'center',
		width: 60,
		height: 60,
		backgroundColor: globalStyle.colors.primary,
		padding: PAGE_SPACE,
		borderRadius: 30
	},

	passwordRowContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between'
	},

	passwordContainer: {
		flexDirection: 'column',
		justifyContent: 'center',
		height: 100,
		backgroundColor: globalStyle.colors.terciary,
		paddingHorizontal: PAGE_SPACE,
		marginBottom: PAGE_SPACE,
		borderRadius: PAGE_SPACE
	}
});


export default Passwords;
