import {call, put, takeEvery} from "redux-saga/effects";
import {setAppInitializedAC} from "../app/app-reducer";
import {ResponseType} from "../api/todoList-api";

import {authApi, MeDate} from "../api/auth-api";
import {setIsLoggedInAc} from "../reducers/auth-reducer";

export function* initializeAppSagWorkerSaga() {
    const data: ResponseType<MeDate> = yield call(authApi.me)
    if (data.resultCode === 0) {
        yield put(setIsLoggedInAc(true))
    }
    yield put(setAppInitializedAC(true))
}

export const initializeApp = () => ({type: 'APP/INITIALIZE-APP'})

export function* authWatcherSaga() {
    yield  takeEvery('APP/INITIALIZE-APP', initializeAppSagWorkerSaga)
}