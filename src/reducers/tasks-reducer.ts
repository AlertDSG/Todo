import {v1} from "uuid";
import {FilteredPropsType, TaskForTodoList, TodoListType} from "../App";
import {ActionType} from "./todoLists-reducer";


export const tasksReducer = (state: TaskForTodoList, action: ActionType): TaskForTodoList => {

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
        case 'CHANGE-TASK-TITLE':
            return {
                ...state,
                [action.todoListID]: state[action.todoListID].map(s => s.id === action.id ? {
                    ...s,
                    isDone: action.isDone
                } : s)
            }
        case 'ADD-TODOLIST':
            return {
            ...state,
                [action.todoListID]: []
        }
        default:
            return state
    }

}

export const removeTaskAC = (id: string, todoListID: string) => ({type: 'REMOVE-TASK', id, todoListID}) as const
export type RemoveTaskAT = ReturnType<typeof removeTaskAC>
export const addTaskAC = (title: string, todoListID: string) => ({type: 'ADD-TASK', title, todoListID}) as const
export type AddTaskAT = ReturnType<typeof addTaskAC>
export const changeTaskStatusAC = (id: string, isDone: boolean, todoListID: string) => ({
    type: 'CHANGE-TASK-TITLE',
    id,
    isDone,
    todoListID
}) as const
export type ChangeTaskAT = ReturnType<typeof changeTaskStatusAC>
// export const addTodolistAC = (id: string, filter: FilteredPropsType) => ({type: 'ADD-NEW-TODOLIST', id, filter}) as const
// export type AddNewTodolistAT = ReturnType<typeof addTodolistAC>
