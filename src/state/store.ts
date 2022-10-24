import {applyMiddleware, combineReducers, legacy_createStore as createStore} from 'redux';
import {TaskActionType, tasksReducer} from '../reducers/tasks-reducer';
import {
    TodoListActionType,
    todoListsReducer
} from '../reducers/todoLists-reducer';
import thunkMiddleware, {ThunkAction, ThunkDispatch} from "redux-thunk";
import {AppActionsType, appReducer} from "../app/app-reducer";
import createSagaMiddleware from 'redux-saga'
import {authReducer} from "../reducers/auth-reducer";
import {todoWatcherSaga} from "../sagas/todolists-sagas";
import {tasksWatcherSaga} from "../sagas/tasks-sagas";
import {authWatcherSaga} from "../sagas/auth-sagas";

// объединяя reducer-ы с помощью combineReducers,
// мы задаём структуру нашего единственного объекта-состояния
const rootReducer = combineReducers({
    tasks: tasksReducer,
    todoLists: todoListsReducer,
    app: appReducer,
    auth: authReducer
})

const sagaMiddleware = createSagaMiddleware()
// непосредственно создаём store
export const store = createStore(rootReducer, applyMiddleware(thunkMiddleware, sagaMiddleware));

sagaMiddleware.run(rootWatcher)

function* rootWatcher() {
    yield* authWatcherSaga()
    yield* todoWatcherSaga()
    yield* tasksWatcherSaga()
}

// определить автоматически тип всего объекта состояния
export type AppRootStateType = ReturnType<typeof rootReducer>


export type AppDispatch = ThunkDispatch<any, unknown, any>


export type AppActionType = TodoListActionType | TaskActionType | AppActionsType

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppRootStateType, unknown, AppActionType>


// а это, чтобы можно было в консоли браузера обращаться к store в любой момент
// @ts-ignore
window.store = store;