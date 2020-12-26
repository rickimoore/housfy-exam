import { ActionTypes as types } from '../actions/types';
import {MISSION, CONTROL} from "../../helpers/constants";

const initialState = {
    view: CONTROL,
};


const app = (state = initialState, action) => {
    switch (action.type) {
        case types.SET_MISSION_CONTROL:
            return { ...state, view: MISSION};
        case types.SET_CONTROL_VIEW:
            return { ...state, view: CONTROL}
        default:
            return state;
    }
};

export default app;
