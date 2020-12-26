import { ActionTypes as types } from '../actions/types';

const initialState = {
    pos: null,
    commands: null,
    orientation: null
};


const control = (state = initialState, action) => {
    switch (action.type) {
        case types.SET_MISSION_CONTROL:
            return { ...state, pos: {x: action.x, y: action.y}, commands: action.commands, orientation: action.orientation };
        default:
            return state;
    }
};

export default control;
