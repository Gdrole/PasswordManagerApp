import React, { FC } from "react";
import { StyleSheet, View } from "react-native";
import CustomInput from "src/components/CustomInput";
import Page from "src/components/Page";

const Main: FC = () => {
	return (
		<Page>
			<View style={styles.inputContainer}>
				<CustomInput placeholder={'Username'} autoCompleteType={'username'} />
				<CustomInput placeholder={'Password'} autoCompleteType={'password'} />
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
	}
});

export default Main;