import {todoListsApi, TodoListsType} from "../api/todoList-api";
import {RequestStatusType, setAppStatusAC} from "../app/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";

export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodolistDomainType = TodoListsType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}

const initialState: TodolistDomainType[] = []

export const setTodoListsTC = createAsyncThunk('todolist/setTodoLists', async (param, {dispatch}) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    console.log('todo')
    const res = await todoListsApi.getTodoLists()
    dispatch(setAppStatusAC({status: 'succeeded'}))
    return {todoLists: res.data}
})
export const addTodoListTC = createAsyncThunk('todolist/addTodoList', async (param: { title: string }, {
    dispatch,
    rejectWithValue
}) => {
    try {
        dispatch(setAppStatusAC({status: 'loading'}))
        const res = await todoListsApi.createTodoLists(param.title)
        if (res.data.resultCode === 0) {
            dispatch(setAppStatusAC({status: 'succeeded'}))
            return {todoList: res.data.data.item}
        } else {
            handleServerAppError(res.data, dispatch)
            return rejectWithValue({})
        }
    } catch (err: any) {
        handleServerNetworkError(err, dispatch)
        return rejectWithValue({})
    }
})
export const updateTodoListTC = createAsyncThunk('todolist/updateTodoList', async (param: { id: string, title: string }, {
    dispatch,
    rejectWithValue
}) => {
    try {
        dispatch(setAppStatusAC({status: 'loading'}))
        const res = await todoListsApi.updateTodolist(param.id, param.title)
        if (res.data.resultCode === 0) {
            dispatch(setAppStatusAC({status: 'succeeded'}))
            return {id: param.id, title: param.title}
        } else {
            handleServerAppError(res.data, dispatch)
            return rejectWithValue({})
        }
    } catch (err: any) {
        handleServerNetworkError(err, dispatch)
        return rejectWithValue({})
    }
})
export const deleteTodoListTC = createAsyncThunk('todolist/deleteTodoList', async (param: { id: string }, {
    dispatch,
    rejectWithValue
}) => {
    try {
        dispatch(setAppStatusAC({status: 'loading'}))
        dispatch(changeTodolistEntityStatusAC({status: 'loading', id: param.id}))
        const res = await todoListsApi.deleteTodolist(param.id)
        console.log(res)
        if (res.data.resultCode === 0) {
            dispatch(setAppStatusAC({status: 'succeeded'}))
            return {id: param.id}
        } else {
            handleServerAppError(res.data, dispatch)
            return rejectWithValue({})
        }

    } catch (err: any) {
        handleServerNetworkError(err, dispatch)
        return rejectWithValue({})
    }
})


const slice = createSlice({
    name: 'todoLists',
    initialState: initialState,
    reducers: {
        // removeTodoListAC: (state, action: PayloadAction<{ id: string }>) => {
        //     const index = state.findIndex(tl => tl.id === action.payload.id)
        //     index > -1 && state.splice(index, 1)
        // },
        changeFilterTodoListAC: (state, action: PayloadAction<{ id: string, filter: FilterValuesType }>) => {
            const index = state.findIndex(tl => tl.id === action.payload.id)
            state[index].filter = action.payload.filter
        },
        changeTodolistEntityStatusAC: (state, action: PayloadAction<{ id: string, status: RequestStatusType }>) => {
            const index = state.findIndex(tl => tl.id === action.payload.id)
            state[index].entityStatus = action.payload.status
        },
    },
    extraReducers: builder => {
        builder.addCase(setTodoListsTC.fulfilled, (state, action) => {
            return action.payload.todoLists.map(tl => ({...tl, filter: 'all', entityStatus: 'succeeded'}))
        })
        builder.addCase(addTodoListTC.fulfilled, (state, action) => {
            state.unshift({...action.payload.todoList, filter: 'all', entityStatus: 'succeeded'})
        })
        builder.addCase(updateTodoListTC.fulfilled, (state, action) => {
            const index = state.findIndex(tl => tl.id === action.payload.id)
            state[index].title = action.payload.title
        })
        builder.addCase(deleteTodoListTC.fulfilled, (state, action) => {
            const index = state.findIndex(tl => tl.id === action.payload.id)
            index > -1 && state.splice(index, 1)
        })
    }

})
export const todoListsReducer = slice.reducer

export const {
    changeFilterTodoListAC, changeTodolistEntityStatusAC
} = slice.actions

// export const deleteTodoListTC_ = (id: string): AppThunk => (dispatch) => {
//     dispatch(setAppStatusAC({status: 'loading'}))
//     dispatch(changeTodolistEntityStatusAC({status: 'loading', id}))
//     todoListsApi.deleteTodolist(id)
//         .then(res => {
//             if (res.data.resultCode === 0) {
//                 dispatch(removeTodoListAC({id}))
//                 dispatch(setAppStatusAC({status: 'succeeded'}))
//             } else {
//                 handleServerAppError(res.data, dispatch)
//             }
//         })
//         .catch(err => {
//             handleServerNetworkError(err, dispatch)
//         })
// }