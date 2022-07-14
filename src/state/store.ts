import {applyMiddleware, combineReducers, legacy_createStore as createStore} from 'redux';
import {TaskActionType, tasksReducer} from '../reducers/tasks-reducer';
import {TodoListActionType, todoListsReducer} from '../reducers/todoLists-reducer';
import thunk, {ThunkAction} from "redux-thunk";

// объединяя reducer-ы с помощью combineReducers,
// мы задаём структуру нашего единственного объекта-состояния
const rootReducer = combineReducers({
    tasks: tasksReducer,
    todoLists: todoListsReducer
})
// непосредственно создаём store
export const store = createStore(rootReducer, applyMiddleware(thunk));
// определить автоматически тип всего объекта состояния
export type AppRootStateType = ReturnType<typeof rootReducer>

export type AppDispatch = typeof store.dispatch

export type AppActionType = TodoListActionType | TaskActionType

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppRootStateType, unknown, AppActionType>


// а это, чтобы можно было в консоли браузера обращаться к store в любой момент
// @ts-ignore
window.store = store;