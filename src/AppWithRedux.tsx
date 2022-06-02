import {AppBar, Container, Grid, IconButton, Paper, Toolbar, Typography} from '@material-ui/core';
import {Menu} from '@material-ui/icons';
import React, {useReducer, useState} from 'react';
import {v1} from 'uuid';
import './App.css';
import {Button} from "@material-ui/core";
import {TodoList} from "./components/TodoList";
import {UniversalFormInput} from './components/UniversalFormInput';
import {
    addTodoListAC,
    changeFilterTodoListAC,
    changeTodoListAC,
    removeTodoListAC,
    todoListsReducer
} from './reducers/todoLists-reducer';
import {addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC, tasksReducer} from './reducers/tasks-reducer';
import {useDispatch, useSelector} from 'react-redux';
import {AppRootStateType} from './state/store'

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

function AppWithRedux() {

    const todoLists = useSelector<AppRootStateType, TodoListType[]>(state => state.todoLists)
    const tasks = useSelector<AppRootStateType, TaskForTodoList>(state => state.tasks)
    const dispatch = useDispatch()

    const addTask = (todoListID: string, value: string) => {
        dispatch(addTaskAC(todoListID, value))
    }

    const deleteTask = (todoListID: string, tID: string) => {
        dispatch(removeTaskAC(todoListID, tID))
    }

    const changeInputChecked = (todoListID: string, tId: string, value: boolean) => {
        dispatch(changeTaskStatusAC(todoListID, tId, value))
    }

    const changeTaskTitle = (todoListID: string, tId: string, title: string) => {
        dispatch(changeTaskTitleAC(todoListID, tId, title))
    }

    const removeTodoList = (todoListID: string) => {
        dispatch(removeTodoListAC(todoListID))
    }

    const addNewTodoList = (newTodoList: string) => {
        dispatch(addTodoListAC(newTodoList))
    }

    const changeTitleTodoLst = (todoListID: string, title: string) => {
        dispatch(changeTodoListAC(todoListID, title))
    }

    const filteredTasks = (todoListID: string, filterValue: FilteredPropsType) => {
        dispatch(changeFilterTodoListAC(todoListID, filterValue))
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

export default AppWithRedux;
