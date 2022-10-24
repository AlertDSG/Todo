import {initializeAppSagWorkerSaga} from "./auth-sagas";
import {authApi, MeDate} from "../api/auth-api";
import {call, put} from "redux-saga/effects";
import {ResponseType} from "../api/todoList-api";
import {setIsLoggedInAc} from "../reducers/auth-reducer";
import {setAppInitializedAC} from "../app/app-reducer";

let meResponse: ResponseType<MeDate>

beforeEach(() => {
    meResponse = {
        resultCode: 0,
        fieldsErrors: [],
        messages: [],
        data: {
            id: 1,
            email: '',
            login: ''
        }
    }
})

test('initializeAppSagWorkerSaga login success', () => {
    const generator = initializeAppSagWorkerSaga()
    expect(generator.next().value).toEqual(call(authApi.me))
    expect(generator.next(meResponse).value).toEqual(put(setIsLoggedInAc(true)))
    expect(generator.next().value).toEqual(put(setAppInitializedAC(true)))

})

test('initializeAppSagWorkerSaga login unsuccess', () => {
    const generator = initializeAppSagWorkerSaga()
    expect(generator.next().value).toEqual(call(authApi.me))
    meResponse.resultCode = 1
    expect(generator.next(meResponse).value).toEqual(put(setAppInitializedAC(true)))

})