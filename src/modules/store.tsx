import { applyMiddleware, createStore, compose, Middleware } from 'redux';
// import { logger } from 'redux-logger';
import { persistStore, persistReducer, PersistConfig } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import reducers from './reducers';

//@ts-ignore
let persistConfig: PersistConfig = {
	key: 'root',
	storage: AsyncStorage,
	blacklist: [ 'routing', 'layout' ]
};

if (__DEV__) {
	persistConfig.timeout = 0;
}

const composeEnhancers =
	//@ts-ignore
	typeof (window as any) === 'object' &&
	//@ts-ignore
	(window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
		? //@ts-ignore
			(window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
		: compose;

const configureStore = () => {
	const middlewares = [] as Array<Middleware>;

	if (__DEV__) {
		//middlewares.push(logger);
	}

	const enhancers = [ applyMiddleware(...middlewares) ];
	const persistedReducer = persistReducer(persistConfig, reducers);

	return { ...createStore(persistedReducer, composeEnhancers(...enhancers)) };
};

const createPersistedStore = () => {
	const store = configureStore();

	const persistor = persistStore(store);

	return {
		store,
		persistor
	};
};

const storeWithPersistor = createPersistedStore();

export const store = storeWithPersistor.store;
export const persistor = storeWithPersistor.persistor;
