import React, { FC } from 'react';
import { ActivityIndicator, View, ViewProps, StatusBar, SafeAreaView, RefreshControl, ScrollView, Platform, StyleSheet } from 'react-native';
import globalStyle, { PAGE_SPACE } from 'src/globalStyles';

interface Props extends ViewProps {
	noMargin?: boolean;
	backgroundColor?: string;
	isLoading?: boolean;
	enableSafeAreaView?: boolean;
	statusBarColor?: string;
	scrollable?: boolean;
	isRefreshing?: boolean;
	onRefresh?: () => void;
}

const Page: FC<Props> = (props) => {

	const wrapSafeArea = () => {
		if (props.enableSafeAreaView && Platform.OS === 'ios') {
			return (
				<SafeAreaView style={{ flex: 1, backgroundColor: globalStyle.colors.pageBackground }}>
					{props.children}
				</SafeAreaView>
			);
		} else return props.children;
	};

	const renderContent = () => {
		if (props.scrollable) {
			return (
				<ScrollView
					contentContainerStyle={{ flexGrow: 1 }}
					showsVerticalScrollIndicator={false}
					refreshControl={
						<RefreshControl
							colors={[globalStyle.colors.primary]}
							refreshing={props.isRefreshing ? props.isRefreshing : false}
							onRefresh={props.onRefresh ? props.onRefresh : () => { }}
						/>
					}
				>
					{wrapSafeArea()}
				</ScrollView>
			);
		} else return wrapSafeArea();
	};

	return (
		<View
			style={[
				styles.page,
				{
					paddingTop: !props.scrollable ? (props.noMargin ? 0 : PAGE_SPACE) : 0,
					paddingHorizontal: props.noMargin ? 0 : PAGE_SPACE,
					backgroundColor: props.backgroundColor || globalStyle.colors.pageBackground
				},
				props.style
			]}
		>
			<StatusBar
				barStyle={'light-content'}
				backgroundColor={globalStyle.colors.pageBackground}
				animated
				translucent
			/>
			{props.isLoading && (
				<View style={styles.loader}>
					<ActivityIndicator size={'large'} color={globalStyle.colors.primary} />
				</View>
			)}
			{renderContent()}
		</View>
	);
};

Page.defaultProps = {
	isLoading: false,
	noMargin: false,
	enableSafeAreaView: true,
	scrollable: false
};

const styles =  StyleSheet.create({
	page: {
		flex: 1
	},
	loader: {
		backgroundColor: globalStyle.colors.lightGrey,
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		position: 'absolute',
		opacity: 0.7,
		bottom: 0,
		left: 0,
		right: 0,
		top: 0,
		zIndex: 1000
	}
});

export default Page;
