import { combineReducers } from "redux";
import modalUI from "./modal";
import app from "./appView";
import control from "./control";

const rootReducer = combineReducers({
    modalUI,
    app,
    control,
});

export default rootReducer;
