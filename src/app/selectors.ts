import {AppRootStateType} from "./store";

export const selectStatus = (state: AppRootStateType) => state.app.status
export const selectError = (state: AppRootStateType) => state.app.error
export const selectInitialize = (state: AppRootStateType) => state.app.initialized