import {
    addTodoListTC, changeFilterTodoListAC, deleteTodoListTC,
    FilterValuesType,
    TodolistDomainType,
    todoListsReducer, updateTodoListTC
} from './todoLists-reducer';
import {v1} from 'uuid';

let todolistId1: string;
let todolistId2: string;

let startState: Array<TodolistDomainType>

beforeEach(() => {
    todolistId1 = v1();
    todolistId2 = v1();

    startState = [
        {id: todolistId1, title: "What to learn", filter: "all", entityStatus: 'idle', order: 0, addedDate: ''},
        {id: todolistId2, title: "What to buy", filter: "all", entityStatus: 'idle', order: 0, addedDate: ''}
    ]
})

test('correct todolist should be removed', () => {

    const endState = todoListsReducer(startState, deleteTodoListTC.fulfilled({id: todolistId1}, 'requestId', {id: todolistId1}))

    expect(endState.length).toBe(1);
    expect(endState[0].id).toBe(todolistId2);
});

test('correct todolist should be added', () => {

    let newTodolistTitle = {id: v1(), title: "Bla", filter: "all", entityStatus: 'idle', order: 0, addedDate: ''};

    const endState = todoListsReducer(startState, addTodoListTC.fulfilled({todoList: newTodolistTitle},'responseId',{title: "Bla"} ))

    expect(endState.length).toBe(3);
    expect(endState[0].title).toBe("Bla");
});

test('correct todolist should change its name', () => {

    let newTodolistTitle = "New Todolist";

    const endState = todoListsReducer(startState, updateTodoListTC.fulfilled({id:todolistId2, title: newTodolistTitle}, 'requestId', {title: newTodolistTitle, id: todolistId2}));

    expect(endState[0].title).toBe("What to learn");
    expect(endState[1].title).toBe(newTodolistTitle);
});

test('correct filter of todolist should be changed', () => {

    let newFilter: FilterValuesType = "completed";

    const endState = todoListsReducer(startState, changeFilterTodoListAC({filter: newFilter, id: todolistId2}));

    expect(endState[0].filter).toBe("all");
    expect(endState[1].filter).toBe(newFilter);
});

