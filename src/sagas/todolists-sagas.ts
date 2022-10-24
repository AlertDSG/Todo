import {call, put, takeEvery} from "redux-saga/effects";
import {setAppStatusAC} from "../app/app-reducer";
import {AxiosResponse} from "axios";
import {ResponseType, todoListsApi, TodoListsType} from "../api/todoList-api";
import {handleServerAppError} from "../utils/error-utils";
import {
    addTodoListAC,
    changeTodoListAC,
    changeTodolistEntityStatusAC,
    removeTodoListAC,
    setTodoListsAC
} from "../reducers/todoLists-reducer";


export function* setTodoListsWorkerSaga() {
    yield put(setAppStatusAC('loading'))
    const res: AxiosResponse<Array<TodoListsType>> = yield call(todoListsApi.getTodoLists)
    yield put(setTodoListsAC(res.data))
    yield put(setAppStatusAC('succeeded'))
}

export const setTodoLists = () => ({type: 'TODO/SET-TODO'})

export function* addTodoListWorkerSaga(action: ReturnType<typeof addTodoList>) {
    yield put(setAppStatusAC('loading'))
    const res: AxiosResponse<ResponseType<{ item: TodoListsType }>> = yield call(todoListsApi.createTodoLists, action.title)
    if (res.data.resultCode === 0) {
        yield put(addTodoListAC(res.data.data.item))
        yield put(setAppStatusAC('succeeded'))
    }
}

export const addTodoList = (title: string) => ({type: 'TODO/ADD-TODO', title})

export function* updateTodoListWorkerSaga(action: ReturnType<typeof updateTodoList>) {
    yield put(setAppStatusAC('loading'))
    const res: AxiosResponse<ResponseType> = yield call(todoListsApi.updateTodolist, action.todoId, action.title)
    if (res.data.resultCode === 0) {
        yield put(changeTodoListAC(action.todoId, action.title))
        yield put(setAppStatusAC('succeeded'))
    } else {
        handleServerAppError(res.data, put)
    }
}

export const updateTodoList = (todoId: string, title: string) => ({type: 'TODO/UPDATE-TODO', todoId, title})

export function* deleteTodoListWorkerSaga(action: ReturnType<typeof deleteTodoList>) {
    yield put(setAppStatusAC('loading'))
    yield put(changeTodolistEntityStatusAC(action.todoId, 'loading'))
    const res: AxiosResponse<ResponseType> = yield call(todoListsApi.deleteTodolist, action.todoId)
    if (res.data.resultCode === 0) {
        yield put(removeTodoListAC(action.todoId))
        yield put(setAppStatusAC('succeeded'))
    } else {
        handleServerAppError(res.data, put)
    }
}

export const deleteTodoList = (todoId: string) => ({type: 'TODO/DELETE-TODO', todoId})

export function* todoWatcherSaga() {
    yield  takeEvery('TODO/SET-TODO', setTodoListsWorkerSaga)
    yield  takeEvery('TODO/ADD-TODO', addTodoListWorkerSaga)
    yield  takeEvery('TODO/UPDATE-TODO', updateTodoListWorkerSaga)
    yield  takeEvery('TODO/DELETE-TODO', deleteTodoListWorkerSaga)
}