import {setAppErrorAC, setAppStatusAC} from '../app/app-reducer'
import {ResponseType} from "../api/todoList-api";
import {put} from "redux-saga/effects";

export function* handleServerAppErrorSaga<T>(data: ResponseType<T>) {
    if (data.messages.length) {
        yield  put(setAppErrorAC(data.messages[0]))
    } else {
        yield  put(setAppErrorAC('Some error occurred'))
    }
    yield put(setAppStatusAC('failed'))
}

export function* handleServerNetworkErrorSaga(error: { message: string }) {
    yield put(setAppErrorAC(error.message))
    yield put(setAppStatusAC('failed'))
}

