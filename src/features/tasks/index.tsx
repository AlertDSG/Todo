import {asyncActions, slice, TaskTypeState as T1} from './tasks-reducer'

const tasksReducer = slice.reducer
const actions = slice.actions

const taskActions = {
    ...actions,
    ...asyncActions
}

export type TaskTypeState = T1

export {
    tasksReducer,
    taskActions,
}