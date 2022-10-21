import {call, put} from "redux-saga/effects";
import {authApi, MeDate} from "../api/auth-api";
import {AxiosResponse} from "axios";
import {ResponseType} from "../api/todoList-api";
import {setIsLoggedInAc} from "../reducers/auth-reducer";

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

const initialState = {
    status: 'succeeded' as RequestStatusType,
    error: null as null | string,
    isInitialized: false
}

type InitialStateType = typeof initialState

export const appReducer = (state: InitialStateType = initialState, action: AppActionsType): InitialStateType => {
    switch (action.type) {
        case 'APP/SET-STATUS':
            return {...state, status: action.status}
        case 'APP/SET-ERROR':
            return {...state, error: action.error}
        case 'APP/SET-INITIALIZED':
            return {...state, isInitialized: action.initial}
        default:
            return state
    }
}

export const setAppStatusAC = (status: RequestStatusType) => {
    return {
        type: 'APP/SET-STATUS',
        status
    } as const
}
export const setAppErrorAC = (error: null | string) => {
    return {
        type: 'APP/SET-ERROR',
        error
    } as const
}
export const setAppInitializedAC = (initial: boolean) => {
    return {
        type: 'APP/SET-INITIALIZED',
        initial
    } as const
}

export function* initializeAppSaga() {
    const res: AxiosResponse<ResponseType<MeDate>> = yield call(authApi.me)
    if (res.data.resultCode === 0) {
        yield put(setIsLoggedInAc(true))
    }
    yield put(setAppInitializedAC(true))
}

export const initializeApp = () => ({type: 'APP/INITIALIZE-APP'})

export type AppActionsType =
    ReturnType<typeof setAppStatusAC>
    | ReturnType<typeof setAppErrorAC>
    | ReturnType<typeof setAppInitializedAC>