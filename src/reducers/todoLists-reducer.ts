import {todoListsApi, TodoListsType} from "../api/todoList-api";
import {AppThunk} from "../state/store";
import {RequestStatusType, setAppErrorAC, setAppStatusAC} from "../app/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodolistDomainType = TodoListsType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}

const initialState: TodolistDomainType[] = []

const slice = createSlice({
    name: 'todoLists',
    initialState: initialState,
    reducers: {
        setTodoListsAC: (state, action: PayloadAction<{ todoLists: TodoListsType[] }>) => {
            return action.payload.todoLists.map(tl => ({...tl, filter: 'all', entityStatus: 'succeeded'}))
        },
        removeTodoListAC: (state, action: PayloadAction<{ id: string }>) => {
            const index = state.findIndex(tl => tl.id === action.payload.id)
            index > -1 && state.splice(index, 1)
        },
        addTodoListAC: (state, action: PayloadAction<{ todoList: TodoListsType }>) => {
            state.unshift({...action.payload.todoList, filter: 'all', entityStatus: 'succeeded'})
        },
        changeTodoListAC: (state, action: PayloadAction<{ id: string, title: string }>) => {
            const index = state.findIndex(tl => tl.id === action.payload.id)
            state[index].title = action.payload.title
        },
        changeFilterTodoListAC: (state, action: PayloadAction<{ id: string, filter: FilterValuesType }>) => {
            const index = state.findIndex(tl => tl.id === action.payload.id)
            state[index].filter = action.payload.filter
        },
        changeTodolistEntityStatusAC: (state, action: PayloadAction<{ id: string, status: RequestStatusType }>) => {
            const index = state.findIndex(tl => tl.id === action.payload.id)
            state[index].entityStatus = action.payload.status
        },

    },

})
export const todoListsReducer = slice.reducer

export const {
    setTodoListsAC, changeFilterTodoListAC, addTodoListAC, changeTodolistEntityStatusAC,
    removeTodoListAC, changeTodoListAC
} = slice.actions


export const setTodoListsTC = (): AppThunk => (dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    todoListsApi.getTodoLists()
        .then(res => {
            dispatch(setTodoListsAC({todoLists:res.data}))
            dispatch(setAppStatusAC({status: 'succeeded'}))
        })

}

export const addTodoListTC = (title: string): AppThunk => (dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    todoListsApi.createTodoLists(title)
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(addTodoListAC({todoList:res.data.data.item}))
                dispatch(setAppStatusAC({status: 'succeeded'}))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch(err => {
            handleServerNetworkError(err, dispatch)
        })
}


export const updateTodoListTC = (id: string, title: string): AppThunk => (dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    todoListsApi.updateTodolist(id, title)
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(changeTodoListAC({id, title}))
                dispatch(setAppStatusAC({status: 'succeeded'}))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch(err => {
            handleServerNetworkError(err, dispatch)
        })
}

export const deleteTodoListTC = (id: string): AppThunk => (dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    dispatch(changeTodolistEntityStatusAC({status:'loading', id}))
    todoListsApi.deleteTodolist(id)
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(removeTodoListAC({id}))
                dispatch(setAppStatusAC({status: 'succeeded'}))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch(err => {
            handleServerNetworkError(err, dispatch)
        })
}