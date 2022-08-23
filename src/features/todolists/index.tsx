import {asyncActions , slice, TodolistDomainType as T1} from './todoLists-reducer'
import * as todoListsSelectors from './selectors'

const todoListsActions = {
    ...asyncActions,
    ...slice.actions
}


const todoListsReducer  = slice.reducer

export type TodolistDomainType = T1

export {
    todoListsActions,
    todoListsReducer,
    todoListsSelectors
}