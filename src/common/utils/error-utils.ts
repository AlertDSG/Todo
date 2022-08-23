import {ResponseType} from "../../features/todolists/todoList-api";
import {Dispatch} from "redux";
import {appActions} from "../../app";


// generic function
export const handleServerAppError = <T>(data: ResponseType<T>, dispatch: Dispatch) => {
    if (data.messages.length) {
        dispatch(appActions.setAppErrorAC({error: data.messages[0]}))
    } else {
        dispatch(appActions.setAppErrorAC({error: 'Some error occurred'}))
    }
    dispatch(appActions.setAppStatusAC({status: 'failed'}))
}

export const handleServerNetworkError = (error: { message: string }, dispatch: Dispatch) => {
    dispatch(appActions.setAppErrorAC({error: error.message}))
    dispatch(appActions.setAppStatusAC({status: 'failed'}))
}

