import { v1 } from "uuid";
import {FilteredPropsType, TodoListType } from "../App";

const CHANGE_TODOLIST_FILTER = 'CHANGE-TODOLIST-FILTER'


export type RemoveTodoListAT = {
    type: 'REMOVE-TODOLIST'
    id: string
}
export type AddTodoListsAT = {
    type: 'ADD-TODOLIST'
    title: string
}
export type ChangeTodoListsAT = {
    type: 'CHANGE-TODOLIST-TITLE'
    id: string
    title: string
}
export type ChangeFilterTodoListsAT = {
    type: 'CHANGE-TODOLIST-FILTER'
    id: string
    filter: FilteredPropsType
}



export type ActionType = RemoveTodoListAT | AddTodoListsAT | ChangeTodoListsAT | ChangeFilterTodoListsAT

export const todoListsReducer = (todoLists: TodoListType[], action: ActionType): TodoListType[] => {

    switch (action.type) {
        case 'REMOVE-TODOLIST':
            return todoLists.filter(tl => tl.id !== action.id)
        case 'ADD-TODOLIST':
            const newID = v1()
            return [...todoLists, {id: newID, title: action.title, filter: 'all'}]
        case 'CHANGE-TODOLIST-TITLE':
            return todoLists.map(tl=> tl.id === action.id ? {...tl, title: action.title} : tl)
        case 'CHANGE-TODOLIST-FILTER':
            const filteredTodolist = todoLists.map(tl => tl.id === action.id ? {...tl, filter: action.filter} : tl)
            return filteredTodolist
        default:
            return todoLists
    }

}

export const removeTodoListAC = (id: string) => ({ type: 'REMOVE-TODOLIST', id: id})
export const addTodoListAC = (title: string) => ({ type: 'ADD-TODOLIST', title: title})
export const changeTodoListAC = (id: string, title: string) => ({ type: 'CHANGE-TODOLIST-TITLE', id, title})
export const ChangeFilterTodoListAC = (id: string, filter: string) => ({ type: CHANGE_TODOLIST_FILTER, id, filter})
