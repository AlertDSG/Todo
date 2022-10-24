import {call, put} from "redux-saga/effects";
import {GetTasksResponse, TaskPriorities, TaskStatuses, todoListsApi} from "../api/todoList-api";
import {setAppErrorAC, setAppStatusAC} from "../app/app-reducer";
import {createTasksWorkerSaga, setTasksWorkerSaga} from "./tasks-sagas";
import {setTasksAC} from "../reducers/tasks-reducer";

let data: GetTasksResponse
beforeEach(() => {
    data = {
        error: '',
        items: [{
            id: '',
            todoListId: 'todoId',
            status: TaskStatuses.New,
            order: 1,
            startDate: '',
            title: '',
            priority: TaskPriorities.Hi,
            description: '',
            deadline: '',
            addedDate: ''
        }],
        totalCount: 2
    }
})

test('setTasksWorkerSaga success flow', () => {
    const generator = setTasksWorkerSaga({type: 'TASKS/SET-TASKS', todoId: 'todoId'})
    expect(generator.next().value).toEqual(put(setAppStatusAC('loading')))
    expect(generator.next().value).toEqual(call(todoListsApi.getTasks, 'todoId'))
    expect(generator.next(data).value).toEqual(put(setTasksAC(data.items, 'todoId')))
    expect(generator.next().value).toEqual(put(setAppStatusAC('succeeded')))

})

test('createTasksWorkerSaga data success error', () => {
    const generator = createTasksWorkerSaga({type: 'TASKS/ADD-TASK', todoId: "todoId1", title: ""})
    expect(generator.next().value).toEqual(put(setAppStatusAC('loading')))
    expect(generator.next().value).toEqual(call(todoListsApi.createTask, "todoId1", ''))
    expect(generator.throw({message: 'some error'}).value).toEqual(put(setAppErrorAC('some error')))
    expect(generator.next().value).toEqual(put(setAppStatusAC('failed')))
})