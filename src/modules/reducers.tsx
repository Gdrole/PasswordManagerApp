import { combineReducers, AnyAction } from "redux";
import { appReducerFunction, IAppState } from "./app/reducer";

const initialState = {};

const rootReducer = (state: any = initialState, action: any = {}) => {
	const appReducer = combineReducers({
        app: appReducerFunction,
	});

	return appReducer(state, action);
};

export interface IActionWithPayload<T = any> extends AnyAction {
	payload: T;
}

export interface IMainState {
    app: IAppState;
}

export default rootReducer;
