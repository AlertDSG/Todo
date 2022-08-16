import {addTaskAC, removeTaskAC, tasksReducer, TasksStateType, updateTaskAC} from './tasks-reducer';
import {addTodoListAC} from './todoLists-reducer'
import {TaskPriorities, TaskStatuses} from "../api/todoList-api";


let startState: TasksStateType

beforeEach(() => {
    startState = {
        "todolistId1": [
            {
                description: '',
                title: 'css',
                status: TaskStatuses.New,
                priority: 0,
                startDate: '',
                deadline: '',
                id: '1',
                todoListId: "todolistId1",
                order: 0,
                addedDate: '',
                entityStatus: 'succeeded',
            },
            {
                description: '',
                title: 'react',
                status: TaskStatuses.New,
                priority: 0,
                startDate: '',
                deadline: '',
                id: '2',
                todoListId: "todolistId1",
                order: 0,
                addedDate: '',
                entityStatus: 'succeeded',
            },
        ],
        "todolistId2": [
            {description: '',
                title: 'milk',
                status: TaskStatuses.New,
                priority: 0,
                startDate: '',
                deadline: '',
                id: '1',
                todoListId: "todolistId2",
                order: 0,
                addedDate: '',
                entityStatus: 'succeeded',},
            {description: '',
                title: 'bread',
                status: TaskStatuses.New,
                priority: 0,
                startDate: '',
                deadline: '',
                id: '2',
                todoListId: "todolistId2",
                order: 0,
                addedDate: '',
                entityStatus: 'succeeded',},
            {description: '',
                title: 'sugar',
                status: TaskStatuses.New,
                priority: 0,
                startDate: '',
                deadline: '',
                id: '3',
                todoListId: "todolistId2",
                order: 0,
                addedDate: '',
                entityStatus: 'succeeded',}
        ]
    };
})

test('correct task should be deleted from correct array', () => {

    const action = removeTaskAC({id: '2', todoListID: 'todolistId2'});

    const endState = tasksReducer(startState, action)

    expect(endState['todolistId2'].length).toBe(2)

});

test('correct task should be added to correct array', () => {

    const task = {
        id: "1",
        title: "juce",
        todoListId: 'todolistId2',
        status: TaskStatuses.New,
        addedDate: '',
        deadline: '',
        description: '',
        order: 0,
        startDate: '',
        priority: 0
    }

    const action = addTaskAC(task);

    const endState = tasksReducer(startState, action)

    expect(endState["todolistId1"].length).toBe(2);
    expect(endState["todolistId2"].length).toBe(4);
    expect(endState["todolistId2"][0].title).toBe("juce");
})

test('status of specified task should be changed', () => {

    const action = updateTaskAC({taskId: '2', todolistId: "todolistId2", model: {status: TaskStatuses.New}});

    const endState = tasksReducer(startState, action)

    expect(endState["todolistId1"][1].id).toBe("2");
});

test('title of specified task should be changed', () => {

    const action = updateTaskAC({taskId: '2', todolistId:"todolistId2", model: {title:'Blabla'}});

    const endState = tasksReducer(startState, action)

    expect(endState["todolistId2"][1].title).toBe('Blabla');
    expect(endState["todolistId1"][1].id).toBe("2");
});

test('new array should be added when new todolist is added', () => {
    const todoList = {
        id: 'todolistId3',
        addedDate: '',
        order: 0,
        title: "new todolist",
    }

    const action = addTodoListAC({todoList});

    const endState = tasksReducer(startState, action)


    const keys = Object.keys(endState);
    const newKey = keys.find(k => k != "todolistId1" && k != "todolistId2");
    if (!newKey) {
        throw Error("new key should be added")
    }

    expect(keys.length).toBe(3);
    expect(endState[newKey]).toEqual([]);
});


// import { legacy_createStore as createStore} from 'redux'
