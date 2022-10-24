import {call, put, takeEvery, select} from "redux-saga/effects";
import {setAppStatusAC} from "../app/app-reducer";
import {AxiosResponse} from "axios";
import {GetTasksResponse, ResponseType, TaskType, todoListsApi, UpdateTaskModelType} from "../api/todoList-api";
import {
    addTaskAC, removeTaskAC,
    setTasksAC,
    setTasksEntityStatusAC, TasksStateType,
    UpdateDomainTaskModelType, updateTaskAC,
} from "../reducers/tasks-reducer";
import {AppRootStateType} from "../state/store";

export function* setTasksWorkerSaga(action: ReturnType<typeof setTasks>) {
    yield put(setAppStatusAC('loading'))
    const res: AxiosResponse<GetTasksResponse> = yield call(todoListsApi.getTasks, action.todoId)
    yield put(setTasksAC(res.data.items, action.todoId))
    yield put(setAppStatusAC('succeeded'))
}

export const setTasks = (todoId: string) => ({type: 'TASKS/SET-TASKS', todoId})

export function* createTasksWorkerSaga(action: ReturnType<typeof createTasks>) {
    yield put(setAppStatusAC('loading'))
    const res: AxiosResponse<ResponseType<{ item: TaskType }>> = yield call(todoListsApi.createTask, action.todoId, action.title)
    if (res.data.resultCode === 0) {
        yield put(addTaskAC(res.data.data.item))
        yield put(setAppStatusAC('succeeded'))
    }
    // yield put(setTasksAC(res.data.items, action.todoId))
    // yield put(setAppStatusAC('succeeded'))
}

export const createTasks = (todoId: string, title: string) => ({type: 'TASKS/ADD-TASK', todoId, title})

const tasks = (state: AppRootStateType) => state.tasks

export function* updateTasksWorkerSaga(action: ReturnType<typeof updateTasks>) {
    yield put(setAppStatusAC('loading'))
    yield put(setTasksEntityStatusAC(action.todoListId, action.taskId, false))
    const newTasks: TasksStateType= yield select(tasks)
    const task = newTasks[action.todoListId].find(t => t.id === action.taskId)
    console.log(task)

    if (!task) {
        alert('Error task')
        return
    }

    const model: UpdateTaskModelType = {
        ...task,
         ...action.domainModel
    }

    const res: AxiosResponse<ResponseType<{ item: TaskType }>> = yield call(todoListsApi.updateTask, action.todoListId, action.taskId, model)
    if (res.data.resultCode === 0) {
        yield put(updateTaskAC(action.taskId, model, action.todoListId))
        yield put(setAppStatusAC('succeeded'))
    }
}

export const updateTasks = (taskId: string, domainModel: UpdateDomainTaskModelType, todoListId: string) => ({type: 'TASKS/UPDATE-TASK', taskId, domainModel, todoListId})

export function* deleteTaskWorkerSaga(action: ReturnType<typeof removeTask>) {
    yield put(setAppStatusAC('loading'))
    const res: AxiosResponse<ResponseType> = yield call(todoListsApi.deleteTask, action.todoId, action.taskId)
    if (res.data.resultCode === 0) {
        yield put(removeTaskAC(action.todoId, action.taskId))
        yield put(setAppStatusAC('succeeded'))
    }
}

export const removeTask = (todoId: string, taskId: string) => ({type: 'TASKS/DELETE-TASK', todoId, taskId})

export function* tasksWatcherSaga() {
    yield  takeEvery('TASKS/SET-TASKS', setTasksWorkerSaga)
    yield  takeEvery('TASKS/ADD-TASK', createTasksWorkerSaga)
    yield  takeEvery('TASKS/UPDATE-TASK', updateTasksWorkerSaga)
    yield  takeEvery('TASKS/DELETE-TASK', deleteTaskWorkerSaga)
}