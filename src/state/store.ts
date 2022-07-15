import {applyMiddleware, combineReducers, legacy_createStore as createStore} from 'redux';
import {TaskActionType, tasksReducer} from '../reducers/tasks-reducer';
import {TodoListActionType, todoListsReducer} from '../reducers/todoLists-reducer';
import thunkMiddleware, {ThunkAction, ThunkDispatch} from "redux-thunk";
import {AppActionsType, appReducer, setAppStatusAC} from "../app/app-reducer";

// объединяя reducer-ы с помощью combineReducers,
// мы задаём структуру нашего единственного объекта-состояния
const rootReducer = combineReducers({
    tasks: tasksReducer,
    todoLists: todoListsReducer,
    app: appReducer,
})
// непосредственно создаём store
export const store = createStore(rootReducer, applyMiddleware(thunkMiddleware));
// определить автоматически тип всего объекта состояния
export type AppRootStateType = ReturnType<typeof rootReducer>


export type AppDispatch = ThunkDispatch<AppRootStateType, unknown, AppActionType>


export type AppActionType = TodoListActionType | TaskActionType | AppActionsType

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppRootStateType, unknown, AppActionType>


// а это, чтобы можно было в консоли браузера обращаться к store в любой момент
// @ts-ignore
window.store = store;