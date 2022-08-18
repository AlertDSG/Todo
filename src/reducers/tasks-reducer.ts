import {addTodoListAC, removeTodoListAC, setTodoListsAC,} from "./todoLists-reducer";
import {TaskPriorities, TaskStatuses, TaskType, todoListsApi, UpdateTaskModelType} from "../api/todoList-api";
import {AppRootStateType} from "../state/store";
import {RequestStatusType, setAppStatusAC} from "../app/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";

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

export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async (id: string, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
    const res = await todoListsApi.getTasks(id)
    thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
    return {tasks: res.data.items, todolistId: id}
})

export const createTasks = createAsyncThunk('tasks/createTasks', async (param: { id: string, title: string }, thunkAPI) => {
    try {
        thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
        const res = await todoListsApi.createTask(param.id, param.title)
        if (res.data.resultCode === 0) {
            thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
            return {task: res.data.data.item}
        } else {
            handleServerAppError(res.data, thunkAPI.dispatch)
            return thunkAPI.rejectWithValue({})
        }
    } catch (err: any) {
        handleServerNetworkError(err, thunkAPI.dispatch)
        return thunkAPI.rejectWithValue({})
    }

})

export const updateTask = createAsyncThunk('tasks/updateTasks', async (param: { taskId: string, domainModel: UpdateDomainTaskModelType, todoListId: string }, thunkAPI) => {
    try {
        thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
        thunkAPI.dispatch(setTasksEntityStatusAC({
            entityStatus: 'loading',
            taskId: param.taskId,
            todolistId: param.todoListId
        }))

        const state = thunkAPI.getState() as AppRootStateType
        const task = state.tasks[param.todoListId].find(t => t.id === param.taskId)

        if (!task) {
            alert('Error task')
            return thunkAPI.rejectWithValue('not found')
        }

        const model: UpdateTaskModelType = {
            ...task, ...param.domainModel
        }

        const res = await todoListsApi.updateTask(param.todoListId, param.taskId, model)

        if (res.data.resultCode === 0) {

            thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
            thunkAPI.dispatch(setTasksEntityStatusAC({
                entityStatus: 'succeeded',
                taskId: param.taskId,
                todolistId: param.todoListId
            }))
            return {taskId: param.taskId, model, todolistId: param.todoListId}
        } else {
            handleServerAppError(res.data, thunkAPI.dispatch)
            return thunkAPI.rejectWithValue({})
        }
    } catch (err: any) {
        handleServerNetworkError(err, thunkAPI.dispatch)
        return thunkAPI.rejectWithValue({})
    }
})

export const removeTask = createAsyncThunk('tasks/removeTask', async (param: { todoListId: string, taskId: string }, thunkAPI) => {
    try {
        thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
        const res = await todoListsApi.deleteTask(param.todoListId, param.taskId)
        if (res.data.resultCode === 0) {
            thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
            return {id: param.taskId, todoListID: param.todoListId}
        } else {
            handleServerAppError(res.data, thunkAPI.dispatch)
            return thunkAPI.rejectWithValue({})
        }
    } catch (err: any) {
        handleServerNetworkError(err, thunkAPI.dispatch)
        return thunkAPI.rejectWithValue({})
    }
})

const slice = createSlice({
    name: 'tasks',
    initialState: initialState,
    reducers: {
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
        builder.addCase(fetchTasks.fulfilled, (state, action) => {
            state[action.payload.todolistId] = action.payload.tasks.map(t => ({...t, entityStatus: 'succeeded'}))
        })
        builder.addCase(createTasks.fulfilled, (state, action) => {
            state[action.payload.task.todoListId].unshift({...action.payload.task, entityStatus: 'succeeded'})
        })
        builder.addCase(updateTask.fulfilled, (state, action) => {
            const index = state[action.payload.todolistId].findIndex(t => t.id === action.payload.taskId)
            state[action.payload.todolistId][index] = {...state[action.payload.todolistId][index], ...action.payload.model}
        })
        builder.addCase(removeTask.fulfilled, (state, action) => {
            const index = state[action.payload.todoListID].findIndex(t => t.id === action.payload.id)
            state[action.payload.todoListID].splice(index, 1)
        })

    }
})

export const tasksReducer = slice.reducer
export const {setTasksEntityStatusAC} = slice.actions