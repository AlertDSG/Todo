import {v1} from "uuid";
import {FilteredPropsType, TaskForTodoList, TodoListType} from "../App";
import {ActionType} from "./todoLists-reducer";

const initialState: TaskForTodoList = {}


export const tasksReducer = (state: TaskForTodoList = initialState, action: ActionType): TaskForTodoList => {

    switch (action.type) {
        case 'REMOVE-TASK':
            return {
                ...state,
                [action.todoListID]: state[action.todoListID].filter(t => t.id !== action.id)
            }
        case 'ADD-TASK':
            return {
                ...state,
                [action.todoListID]: [{id: v1(), title: action.title, isDone: false}, ...state[action.todoListID]]
            }
        case 'CHANGE-TASK-STATUS':
            return {
                ...state,
                [action.todoListID]: state[action.todoListID].map(s => s.id === action.id ? {
                    ...s,
                    isDone: action.isDone
                } : s)
            }
        case 'CHANGE-TASK-TITLE':
            return {
                ...state,
                [action.todoListID]: state[action.todoListID].map(s => s.id === action.id ? {
                    ...s,
                    title: action.title
                } : s)
            }
        case 'ADD-TODOLIST':
            return {
            ...state,
                [action.todoListID]: []
        }
        case 'REMOVE-TODOLIST': {
            const copyTasks = {...state}
            delete copyTasks[action.id]
            return copyTasks
        }
        default:
            return state
    }

}

export const removeTaskAC = (todoListID: string, id: string) => ({type: 'REMOVE-TASK', id, todoListID}) as const
export type RemoveTaskAT = ReturnType<typeof removeTaskAC>
export const addTaskAC = (todoListID: string, title: string) => ({type: 'ADD-TASK', title, todoListID}) as const
export type AddTaskAT = ReturnType<typeof addTaskAC>
export const changeTaskStatusAC = (todoListID: string, id: string, isDone: boolean) => ({
    type: 'CHANGE-TASK-STATUS',
    id,
    isDone,
    todoListID
}) as const
export type ChangeTaskAT = ReturnType<typeof changeTaskStatusAC>
export const changeTaskTitleAC = (todoListID: string, id: string, title: string) => ({
    type: 'CHANGE-TASK-TITLE',
    id,
    title,
    todoListID
}) as const
export type ChangeTaskTitleAT = ReturnType<typeof changeTaskTitleAC>
// export const addTodolistAC = (id: string, filter: FilteredPropsType) => ({type: 'ADD-NEW-TODOLIST', id, filter}) as const
// export type AddNewTodolistAT = ReturnType<typeof addTodolistAC>
