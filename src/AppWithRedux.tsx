import {AppBar, Container, Grid, IconButton, Paper, Toolbar, Typography} from '@material-ui/core';
import {Menu} from '@material-ui/icons';
import React, {useCallback, useReducer, useState} from 'react';
import {v1} from 'uuid';
import './App.css';
import {Button} from "@material-ui/core";
import {TodoList} from "./components/TodoList";
import {UniversalFormInput} from './components/UniversalFormInput';
import {addTodoListAC} from './reducers/todoLists-reducer';
import {useDispatch, useSelector} from 'react-redux';
import {AppRootStateType} from './state/store'
import { TodoListWithRedux } from './components/TodoListWithRedux';

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
    const dispatch = useDispatch()

    const addNewTodoList = useCallback((newTodoList: string) => {
        dispatch(addTodoListAC(newTodoList))
    }, [])

    const todolistItems = todoLists.map(t => {

        return (
            <Grid item key={t.id}>
                <Paper style={{margin: "20px", padding: "10px"}} elevation={3}>
                    <TodoListWithRedux
                        todoList={t}
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
