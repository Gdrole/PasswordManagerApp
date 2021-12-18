import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { useContext } from 'react';
import { FC } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Page from "src/components/Page"
import globalStyle, { PAGE_SPACE } from 'src/globalStyles';
import { RealmContext } from 'src/modules/db';
import { StackParams } from 'src/navigation/AppNavigator';
import Clipboard from '@react-native-clipboard/clipboard';
import Password from 'src/modules/db/schemas/Password';
import _sodium from 'libsodium-wrappers';
import * as Keychain from 'react-native-keychain';
import Hashing from 'src/services/Hashing';
import { CONSTANTS } from 'react-native-hash';
import Utils from 'src/services/Utils';

type PasswordsNavigationProp = NativeStackNavigationProp<
	StackParams,
	'Passwords'
>;

const Passwords: FC = () => {

	const navigation = useNavigation<PasswordsNavigationProp>();

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
			
			await _sodium.ready;
			const sodium = _sodium;
			
			
			const x = sodium.randombytes_buf(20);
			console.log(sodium.to_hex(x));

			const credentials = await Keychain.getGenericPassword();

			if (credentials) {
				const date = new Date();


				const hash = await Hashing.hashString(credentials.password, CONSTANTS.HashAlgorithms.sha256);

				const decryptedData = sodium.crypto_aead_xchacha20poly1305_ietf_decrypt(null, sodium.from_hex(pass.password), null, sodium.from_hex(pass.nonce), new Uint8Array(Utils.stringToBytes(hash)));
				const password = sodium.to_string(decryptedData);
				console.log(new Date().getMilliseconds() - date.getMilliseconds());
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
	}

	return (
		<Page noMargin={true}>
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
