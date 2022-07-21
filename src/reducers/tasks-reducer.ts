import {
    addTodoListAC,
    removeTodoListAC,
    setTodoListsAC,
} from "./todoLists-reducer";
import {
    TaskPriorities,
    TaskStatuses,
    TaskType,
    todoListsApi,
    UpdateTaskModelType
} from "../api/todoList-api";
import {AppThunk} from "../state/store";
import {RequestStatusType, setAppStatusAC} from "../app/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export type TaskTypeState = TaskType & { entityStatus: RequestStatusType }

export type TasksStateType = {
    [key: string]: Array<TaskTypeState>
}
const initialState: TasksStateType = {}


export type UpdateDomainTaskModelType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}

const slice = createSlice({
    name: 'tasks',
    initialState: initialState,
    reducers: {
        setTasksAC: (state, action: PayloadAction<{ tasks: Array<TaskType>, todolistId: string }>) => {
            state[action.payload.todolistId] = action.payload.tasks.map(t => ({...t, entityStatus: 'succeeded'}))

        },
        removeTaskAC: (state, action: PayloadAction<{ todoListID: string, id: string }>) => {
            const index = state[action.payload.todoListID].findIndex(t => t.id === action.payload.id)
            state[action.payload.todoListID].splice(index, 1)
        },
        addTaskAC: (state, action: PayloadAction<{task: TaskType }>) => {
            state[action.payload.task.todoListId].unshift({...action.payload.task, entityStatus: 'succeeded'})
        },
        updateTaskAC: (state, action: PayloadAction<{ taskId: string, model: UpdateDomainTaskModelType, todolistId: string }>) => {
            const index = state[action.payload.todolistId].findIndex(t => t.id === action.payload.taskId)
            state[action.payload.todolistId][index] = {...state[action.payload.todolistId][index], ...action.payload.model}
        },

        setTasksEntityStatusAC: (state, action: PayloadAction<{ todolistId: string, taskId: string, entityStatus: RequestStatusType }>) => {
            const index = state[action.payload.todolistId].findIndex(t => t.id === action.payload.taskId)
            state[action.payload.todolistId][index].entityStatus = action.payload.entityStatus
        },

    }, extraReducers: (builder) => {
        builder.addCase(setTodoListsAC, (state, action) => {
            action.payload.todoLists.forEach(t => state[t.id] = [])
        })
        builder.addCase(addTodoListAC, (state, action) => {
            state[action.payload.todoList.id] = []
        })
        builder.addCase(removeTodoListAC, (state, action) => {
            delete state[action.payload.id]
        })

    }
})

export const tasksReducer = slice.reducer
export const {setTasksAC, addTaskAC, updateTaskAC, removeTaskAC, setTasksEntityStatusAC} = slice.actions

export const setTasksTC = (id: string): AppThunk => (dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    todoListsApi.getTasks(id)
        .then(res => {
            dispatch(setTasksAC({tasks: res.data.items, todolistId: id}))
            dispatch(setAppStatusAC({status: 'succeeded'}))
        })
}

export const createTasksTC = (id: string, title: string): AppThunk => (dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    todoListsApi.createTask(id, title)
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(addTaskAC({task: res.data.data.item}))
                dispatch(setAppStatusAC({status: 'succeeded'}))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch(err => {
            handleServerNetworkError(err, dispatch)
        })
}

export const updateTasksTC = (taskId: string, domainModel: UpdateDomainTaskModelType, todoListId: string): AppThunk => (dispatch, getState) => {

    dispatch(setAppStatusAC({status: 'loading'}))
    dispatch(setTasksEntityStatusAC({entityStatus: 'loading', taskId, todolistId: todoListId}))

    const state = getState()
    const task = state.tasks[todoListId].find(t => t.id === taskId)

    if (!task) {
        alert('Error task')
        return
    }

    const model: UpdateTaskModelType = {
        ...task, ...domainModel
    }

    todoListsApi.updateTask(todoListId, taskId, model)
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(updateTaskAC({taskId: taskId, model: model, todolistId: todoListId}))
                dispatch(setAppStatusAC({status: 'succeeded'}))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch(err => {
            handleServerNetworkError(err, dispatch)
        })
        .finally(() => dispatch(setTasksEntityStatusAC({entityStatus: 'succeeded', taskId, todolistId: todoListId})))
}

export const deleteTaskTC = (todoListId: string, taskId: string): AppThunk => (dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    todoListsApi.deleteTask(todoListId, taskId)
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(removeTaskAC({id: taskId, todoListID: todoListId}))
                dispatch(setAppStatusAC({status: 'succeeded'}))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch(err => {
            handleServerNetworkError(err, dispatch)
        })
}