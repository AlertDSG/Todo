import {AnyAction,combineReducers} from 'redux';
import {tasksReducer} from '../reducers/tasks-reducer';
import {todoListsReducer} from '../reducers/todoLists-reducer';
import thunkMiddleware, {ThunkAction, ThunkDispatch} from "redux-thunk";
import {appReducer} from "../app/app-reducer";
import {configureStore} from "@reduxjs/toolkit";

// объединяя reducer-ы с помощью combineReducers,
// мы задаём структуру нашего единственного объекта-состояния
const rootReducer = combineReducers({
    tasks: tasksReducer,
    todoLists: todoListsReducer,
    app: appReducer,
})
// непосредственно создаём store
export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(thunkMiddleware)
})
// определить автоматически тип всего объекта состояния
export type AppRootStateType = ReturnType<typeof store.getState>


export type AppDispatch = ThunkDispatch<AppRootStateType, unknown, AnyAction>
// export type AppDispatch = typeof store.dispatch


// export type AppActionType = TodoListActionType | TaskActionType | typeof setAppStatusAC| typeof setAppErrorAC

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppRootStateType, unknown, AnyAction>


// а это, чтобы можно было в консоли браузера обращаться к store в любой момент
// @ts-ignore
window.store = store;