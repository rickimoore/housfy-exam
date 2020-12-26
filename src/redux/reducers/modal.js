import { ActionTypes as types } from '../actions/types';

const initialState = {
    isCollisionReportModal: null,
    detectedObjects: null,
};


const modalUI = (state = initialState, action) => {
    switch (action.type) {
        case types.OPEN_COLLISION_REPORT:
            return { ...state, isCollisionReportModal: true};
        case types.CLOSE_COLLISION_REPORT:
            return { ...state, isCollisionReportModal: false};
        case types.SET_COLLISIONS_DETECTED:
            return { ...state, detectedObjects: action.detectedObjects}
        case types.CLEAR_DETECTIONS:
            return initialState;
        default:
            return state;
    }
};

export default modalUI;
