import {todoListsApi, TodoListsType} from "../api/todoList-api";
import {AppThunk} from "../state/store";
import {setAppStatusAC} from "../app/app-reducer";

export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodolistDomainType = TodoListsType & {
    filter: FilterValuesType
}


export type TodoListActionType =
    RemoveTodoListAT
    | AddTodoListsAT
    | ChangeTodoListsAT
    | ChangeFilterTodoListsAT
    | SetTodoListsAT

const initialState: TodolistDomainType[] = []

export const todoListsReducer = (state: TodolistDomainType[] = initialState, action: TodoListActionType): TodolistDomainType[] => {

    switch (action.type) {
        case 'SET-TODOLISTS':
            return action.todoLists.map(tl => ({...tl, filter: 'all'}))
        case 'REMOVE-TODOLIST':
            return state.filter(tl => tl.id !== action.id)
        case 'ADD-TODOLIST':
            return [{...action.todoList, filter: 'all'}, ...state]
        case 'CHANGE-TODOLIST-TITLE':
            return state.map(tl => tl.id === action.id ? {...tl, title: action.title} : tl)
        case 'CHANGE-TODOLIST-FILTER':
            return state.map(tl => tl.id === action.id ? {...tl, filter: action.filter} : tl)
        default:
            return state
    }

}

export const removeTodoListAC = (id: string) => ({type: 'REMOVE-TODOLIST', id}) as const
export type RemoveTodoListAT = ReturnType<typeof removeTodoListAC>
export const addTodoListAC = (todoList: TodoListsType) => ({type: 'ADD-TODOLIST', todoList}) as const
export type AddTodoListsAT = ReturnType<typeof addTodoListAC>
export const changeTodoListAC = (id: string, title: string) => ({
    type: 'CHANGE-TODOLIST-TITLE',
    id,
    title
}) as const
export type ChangeTodoListsAT = ReturnType<typeof changeTodoListAC>
export const changeFilterTodoListAC = (id: string, filter: FilterValuesType) => ({
    type: 'CHANGE-TODOLIST-FILTER',
    id,
    filter
}) as const
export type ChangeFilterTodoListsAT = ReturnType<typeof changeFilterTodoListAC>

export const setTodoListsAC = (todoLists: TodoListsType[]) => ({
    type: 'SET-TODOLISTS',
    todoLists
}) as const
export type SetTodoListsAT = ReturnType<typeof setTodoListsAC>

export const setTodoListsTC = (): AppThunk => (dispatch) => {
    dispatch(setAppStatusAC('loading'))
    todoListsApi.getTodoLists()
        .then(res => {
            dispatch(setTodoListsAC(res.data))
            dispatch(setAppStatusAC('succeeded'))
        })

}

export const addTodoListTC = (title: string): AppThunk => (dispatch) => {
    dispatch(setAppStatusAC('loading'))
    todoListsApi.createTodoLists(title)
        .then(res => {
            dispatch(addTodoListAC(res.data.data.item))
            dispatch(setAppStatusAC('succeeded'))
        })

}


export const updateTodoListTC = (id: string, title: string): AppThunk => (dispatch) => {
    dispatch(setAppStatusAC('loading'))
    todoListsApi.updateTodolist(id, title)
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(changeTodoListAC(id, title))
                dispatch(setAppStatusAC('succeeded'))
            }
        })
}

export const deleteTodoListTC = (id: string): AppThunk => (dispatch) => {
    dispatch(setAppStatusAC('loading'))
    todoListsApi.deleteTodolist(id)
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(removeTodoListAC(id))
                dispatch(setAppStatusAC('succeeded'))
            }
        })
}