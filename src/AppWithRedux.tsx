import {AppBar, Container, Grid, IconButton, Paper, Toolbar, Typography} from '@material-ui/core';
import {Menu} from '@material-ui/icons';
import React, {useCallback, useEffect} from 'react';
import './App.css';
import {Button} from "@material-ui/core";
import {UniversalFormInput} from './components/UniversalFormInput';
import {addTodoListTC, setTodoListsTC} from './reducers/todoLists-reducer';
import { TodoListWithRedux } from './components/TodoListWithRedux';
import {useAppDispatch, useAppSelector} from "./app/hooks/hooks";

export type FilteredPropsType = 'all' | 'active' | 'completed'

export type TasksType = {
    id: string
    title: string
    isDone: boolean
}

export type TodoListType = {
    id: string,
    title: string,
    filter: FilteredPropsType
}

function AppWithRedux() {

    const todoLists = useAppSelector(state => state.todoLists)
    const dispatch = useAppDispatch()

    useEffect(() => {

        dispatch(setTodoListsTC())
    },[dispatch])

    const addNewTodoList = useCallback((newTodoList: string) => {
        dispatch(addTodoListTC(newTodoList))
    }, [dispatch])

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
