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
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import Utils from 'src/services/Utils';

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

const Create = () => {

	const navigation = useNavigation<CreateNavigationProp>();
	const { realm } = useContext(RealmContext);

	const { handleSubmit, control, setValue } = useForm<PasswordForm>({
		mode: 'onSubmit',
		reValidateMode: 'onChange',
		defaultValues: {
			for: '',
			username: '',
			password: '',
			algorithm: ''
		},
	});


	const onAddPassword = async (data: PasswordForm) => {
		try {
			const salt = new Realm.BSON.ObjectId().toHexString();
			const passwordHash = '';

			if (realm) {
				realm.write(async () => {

					realm.create('Password', Password.generate({
						salt: salt,
						passwordHash,
						username: data.username,
						for: data.for,
						algorithm: data.algorithm
					}));
				});
				navigation.goBack();
			}
		}
		catch (e) {
			console.log(e);
			Alert.alert('Error', 'Failed to store password!');
		}

	}

	const onRandomPress = () => {
		setValue('password', Utils.generateUUID().replace(/-/g, ''));
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
						<CustomInput
							rightIcon={
								<FontAwesome5Icon
									name={'random'}
									size={PAGE_SPACE}
									color={globalStyle.colors.primary}
									onPress={onRandomPress}
								/>
							}
							errorMessage={error ? error.message : ''}
							onChangeText={onChange}
							value={value}
							placeholder={'Password'}
							autoCompleteType={'password'}
						/>
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
