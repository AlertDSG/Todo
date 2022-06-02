import {v1} from "uuid";
import {FilteredPropsType, TodoListType} from "../App";
import {AddTaskAT, ChangeTaskAT, ChangeTaskTitleAT, RemoveTaskAT} from "./tasks-reducer";


export type ActionType =
    RemoveTodoListAT
    | AddTodoListsAT
    | ChangeTodoListsAT
    | ChangeFilterTodoListsAT
    | RemoveTaskAT
    | AddTaskAT
    | ChangeTaskAT
    | ChangeTaskTitleAT

const initialState : TodoListType[] = []

export const todoListsReducer = (todoLists: TodoListType[] = initialState, action: ActionType): TodoListType[] => {

    switch (action.type) {
        case 'REMOVE-TODOLIST':
            return todoLists.filter(tl => tl.id !== action.id)
        case 'ADD-TODOLIST':
            return [...todoLists, {id: action.todoListID, title: action.title, filter: 'all'}]
        case 'CHANGE-TODOLIST-TITLE':
            return todoLists.map(tl => tl.id === action.id ? {...tl, title: action.title} : tl)
        case 'CHANGE-TODOLIST-FILTER':
            const filteredTodolist = todoLists.map(tl => tl.id === action.id ? {...tl, filter: action.filter} : tl)
            return filteredTodolist
        default:
            return todoLists
    }

}

export const removeTodoListAC = (id: string) => ({type: 'REMOVE-TODOLIST', id: id}) as const
export type RemoveTodoListAT = ReturnType<typeof removeTodoListAC>
export const addTodoListAC = (title: string) => ({type: 'ADD-TODOLIST', title, todoListID: v1()}) as const
export type AddTodoListsAT = ReturnType<typeof addTodoListAC>
export const changeTodoListAC = (id: string, title: string) => ({
    type: 'CHANGE-TODOLIST-TITLE',
    id,
    title
}) as const
export type ChangeTodoListsAT = ReturnType<typeof changeTodoListAC>
export const changeFilterTodoListAC = (id: string, filter: FilteredPropsType) => ({
    type: 'CHANGE-TODOLIST-FILTER',
    id,
    filter
}) as const
export type ChangeFilterTodoListsAT = ReturnType<typeof changeFilterTodoListAC>
