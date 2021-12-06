import React, { FC } from "react";
import { Input, InputProps } from 'react-native-elements';
import globalStyle from "src/globalStyles";

interface Props extends InputProps {
	autoCompleteType: string;
}

const CustomInput: FC<Props> = (props) => {
	return (
		<Input
			placeholderTextColor={globalStyle.colors.lightGrey}
			containerStyle={{ borderBottomColor: globalStyle.colors.lightGrey }}
			labelStyle={{
				fontSize: globalStyle.font.fontSize.medium,
				color: globalStyle.colors.white,
			}}
			inputStyle={{
				fontSize: globalStyle.font.fontSize.medium,
				color: globalStyle.colors.white,
			}}
			errorStyle={{ marginHorizontal: -10, color: globalStyle.colors.crimsonRed }}
			{...props}
		/>
	)
}


export default CustomInput;