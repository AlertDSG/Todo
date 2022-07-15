import {AddTodoListsAT, changeTodolistEntityStatusAC, RemoveTodoListAT, SetTodoListsAT} from "./todoLists-reducer";
import {TaskPriorities, TaskStatuses, TaskType, todoListsApi, UpdateTaskModelType} from "../api/todoList-api";
import {AppThunk} from "../state/store";
import {setAppStatusAC} from "../app/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";

export type TaskTypeState = TaskType & { entityStatus: boolean }

export type TasksStateType = {
    [key: string]: Array<TaskTypeState>
}

export type UpdateDomainTaskModelType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}

export type TaskActionType = | RemoveTaskAT
    | AddTaskAT
    | UpdateTaskAT
    | SetTasksAT
    | SetTodoListsAT
    | RemoveTodoListAT
    | AddTodoListsAT
    | SetTasksEntityStatusAT

const initialState: TasksStateType = {}


export const tasksReducer = (state: TasksStateType = initialState, action: TaskActionType): TasksStateType => {

    switch (action.type) {
        case 'SET-TODOLISTS':
            const copyState = {...state}
            action.todoLists.forEach(tl => {
                copyState[tl.id] = []
            })
            return copyState
        case 'REMOVE-TASK':
            return {
                ...state,
                [action.todoListID]: state[action.todoListID].filter(t => t.id !== action.id)
            }
        case 'ADD-TASK':
            return {
                ...state,
                [action.task.todoListId]: [{...action.task, entityStatus: true}, ...state[action.task.todoListId]]
            }
        case 'UPDATE-TASK':
            return {
                ...state,
                [action.todolistId]: state[action.todolistId].map(s => s.id === action.taskId ? {
                    ...s,
                    ...action.model
                } : s)
            }
        case 'SET-TASKS':
            return {...state, [action.todolistId]: action.tasks.map(t => ({...t, entityStatus: true}))}
        case 'SET-TASK-ENTITY-STATUS':
            return {...state,
                [action.todolistId]: state[action.todolistId].map(t => t.id === action.taskId ? {
                    ...t,
                    entityStatus: action.entityStatus
                } : t)
            }
        case 'ADD-TODOLIST':
            return {
                ...state,
                [action.todoList.id]: []
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
export const addTaskAC = (task: TaskType) => ({type: 'ADD-TASK', task}) as const
export type AddTaskAT = ReturnType<typeof addTaskAC>
export const updateTaskAC = (taskId: string, model: UpdateDomainTaskModelType, todolistId: string) => ({
    type: 'UPDATE-TASK',
    taskId,
    model,
    todolistId
}) as const
export type UpdateTaskAT = ReturnType<typeof updateTaskAC>
export const setTasksAC = (tasks: Array<TaskType>, todolistId: string) => ({
    type: 'SET-TASKS',
    tasks,
    todolistId,
}) as const
export type SetTasksAT = ReturnType<typeof setTasksAC>
export const setTasksEntityStatusAC = (todolistId: string, taskId: string, entityStatus: boolean) => ({
    type: 'SET-TASK-ENTITY-STATUS',
    todolistId,
    taskId,
    entityStatus
}) as const
export type SetTasksEntityStatusAT = ReturnType<typeof setTasksEntityStatusAC>

export const setTasksTC = (id: string): AppThunk => (dispatch) => {
    dispatch(setAppStatusAC('loading'))
    todoListsApi.getTasks(id)
        .then(res => {
            dispatch(setTasksAC(res.data.items, id))
            dispatch(setAppStatusAC('succeeded'))
        })
}

export const createTasksTC = (id: string, title: string): AppThunk => (dispatch) => {
    dispatch(setAppStatusAC('loading'))
    todoListsApi.createTask(id, title)
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(addTaskAC(res.data.data.item))
                dispatch(setAppStatusAC('succeeded'))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch(err => {
            handleServerNetworkError(err, dispatch)
        })
}

export const updateTasksTC = (taskId: string, domainModel: UpdateDomainTaskModelType, todoListId: string): AppThunk => (dispatch, getState) => {

    dispatch(setAppStatusAC('loading'))
    dispatch(setTasksEntityStatusAC(todoListId, taskId, false))

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
                dispatch(updateTaskAC(taskId, model, todoListId))
                dispatch(setAppStatusAC('succeeded'))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch(err => {
            handleServerNetworkError(err, dispatch)
        })
        .finally(() => dispatch(setTasksEntityStatusAC(todoListId, taskId, true)))
}

export const deleteTaskTC = (todoListId: string, taskId: string): AppThunk => (dispatch) => {
    dispatch(setAppStatusAC('loading'))
    todoListsApi.deleteTask(todoListId, taskId)
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(removeTaskAC(todoListId, taskId))
                dispatch(setAppStatusAC('succeeded'))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch(err => {
            handleServerNetworkError(err, dispatch)
        })
}