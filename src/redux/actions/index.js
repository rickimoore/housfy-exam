import { ActionTypes as types } from './types';

export const setControlView = payload => ({ type: types.SET_CONTROL_VIEW, ...payload });
export const setMissionView = payload => ({ type: types.SET_MISSION_VIEW, ...payload });
export const openReportModal = payload => ({ type: types.OPEN_COLLISION_REPORT, ...payload });
export const closeReportModal = payload => ({type: types.CLOSE_COLLISION_REPORT, ...payload})
export const setMissionControl = payload => ({ type: types.SET_MISSION_CONTROL, ...payload });
export const setCollisionsDetected = payload => ({type: types.SET_COLLISIONS_DETECTED, ...payload});
export const clearDetectedCollisions = () => ({type: types.CLEAR_DETECTIONS})
