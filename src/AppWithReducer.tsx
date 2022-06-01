import {AppBar, Container, Grid, IconButton, Paper, Toolbar, Typography} from '@material-ui/core';
import {Menu} from '@material-ui/icons';
import React, {useReducer, useState} from 'react';
import {v1} from 'uuid';
import './App.css';
import {Button} from "@material-ui/core";
import {TodoList} from "./components/TodoList";
import {UniversalFormInput} from './components/UniversalFormInput';
import {addTodoListAC, changeFilterTodoListAC, changeTodoListAC, removeTodoListAC, todoListsReducer } from './reducers/todoLists-reducer';
import {addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC, tasksReducer } from './reducers/tasks-reducer';

export type FilteredPropsType = 'all' | 'active' | 'completed'

export type TasksType = {
    id: string
    title: string
    isDone: boolean
}

export type TaskForTodoList = {
    [todoListID: string]: TasksType[],
}

export type TodoListType = {
    id: string,
    title: string,
    filter: FilteredPropsType
}

function AppWithReducer() {

    let todoListID1 = v1();
    let todoListID2 = v1();

    const [todoLists, dispatchToTodoLists] = useReducer(todoListsReducer, [
        {id: todoListID1, title: 'What to learn', filter: 'all'},
        {id: todoListID2, title: 'What to Buy', filter: 'all'},
    ])


    const [tasks, dispatchToTasks] = useReducer(tasksReducer, {
            [todoListID1]: [
                {id: v1(), title: "HTML&CSS", isDone: true},
                {id: v1(), title: "JS", isDone: true},
                {id: v1(), title: "ReactJS", isDone: false},
                {id: v1(), title: "Rest API", isDone: false},
            ],
            [todoListID2]: [
                {id: v1(), title: "Milk", isDone: true},
                {id: v1(), title: "Bread", isDone: true},
                {id: v1(), title: "Sugar", isDone: false},
                {id: v1(), title: "Sold", isDone: false},
            ],
        }
    )

    const addTask = (todoListID: string, value: string) => {
        const newTask = {id: v1(), title: value, isDone: false}
        dispatchToTasks(addTaskAC(todoListID, value))
    }

    const deleteTask = (todoListID: string, tID: string) => {
        dispatchToTasks(removeTaskAC(todoListID, tID))
    }

    const changeInputChecked = (todoListID: string, tId: string, value: boolean) => {
        dispatchToTasks(changeTaskStatusAC(todoListID, tId, value))
    }

    const changeTaskTitle = (todoListID: string, tId: string, title: string) => {
        dispatchToTasks(changeTaskTitleAC(todoListID, tId, title))
    }

    const removeTodoList = (todoListID: string) => {
        dispatchToTasks(removeTodoListAC(todoListID))
        dispatchToTodoLists(removeTodoListAC(todoListID))

    }

    const addNewTodoList = (newTodoList: string) => {
        const action = addTodoListAC(newTodoList)
        dispatchToTasks(action)
        dispatchToTodoLists(action)
    }

    const changeTitleTodoLst = (todoListID: string, title: string) => {
        dispatchToTodoLists(changeTodoListAC(todoListID,title ))
    }

    const filteredTasks = (todoListID: string, filterValue: FilteredPropsType) => {
        dispatchToTodoLists(changeFilterTodoListAC(todoListID, filterValue))
    }

    const todolistItems = todoLists.map(t => {

        let filterTasks = tasks[t.id];

        if (t.filter === 'completed') {
            filterTasks = tasks[t.id].filter(t => t.isDone)
        }
        if (t.filter === 'active') {
            filterTasks = tasks[t.id].filter(t => !t.isDone)
        }

        return (
            <Grid item key={t.id}>
                <Paper style={{margin: "20px", padding: "10px"}} elevation={3}>
                    <TodoList
                        todoListID={t.id}
                        title={t.title}
                        tasks={filterTasks}
                        changeTitleTodoLst={changeTitleTodoLst}
                        changeTaskTitle={changeTaskTitle}
                        removeTodoList={removeTodoList}
                        deleteTask={deleteTask}
                        filteredTasks={filteredTasks}
                        addTask={addTask}
                        changeInputChecked={changeInputChecked}
                        filter={t.filter}
                    />
                </Paper>
            </Grid>
        )
    })

    return (
        <div className="App">
            <AppBar position="static">
                <Toolbar style={{justifyContent: "space-between"}}>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <Menu/>
                    </IconButton>
                    <Typography variant="h6">
                        Todolists
                    </Typography>
                    <Button color="inherit" variant={"outlined"}>Login</Button>
                </Toolbar>
            </AppBar>
            <Container fixed>
                <Grid container>
                    <UniversalFormInput callBack={addNewTodoList}/>
                </Grid>
                <Grid container>
                    {todolistItems}
                </Grid>
            </Container>
        </div>
    );
}

export default AppWithReducer;
