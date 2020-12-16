import { combineReducers } from "redux";
import { default as eventReducer } from "../../features/events/eventReducer";
import { default as testReducer } from "../../features/sandbox/testReducer";

const rootReducer = combineReducers({
    test: testReducer,
    event: eventReducer
})

export default rootReducer;