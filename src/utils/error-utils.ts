import {AppActionsType, setAppErrorAC, setAppStatusAC,} from '../app/app-reducer'
import { Dispatch } from 'redux'
import {ResponseType} from "../api/todoList-api";


// generic function
export const handleServerAppError = <T>(data: ResponseType<T>, put: any) => {
    if (data.messages.length) {
        put(setAppErrorAC(data.messages[0]))
    } else {
        put(setAppErrorAC('Some error occurred'))
    }
    put(setAppStatusAC('failed'))
}

export const handleServerNetworkError = (error: { message: string }, dispatch: Dispatch<AppActionsType>) => {
    dispatch(setAppErrorAC(error.message))
    dispatch(setAppStatusAC('failed'))
}

