
import React, {useCallback, useEffect} from 'react';
import './App.css';

import {UniversalFormInput} from './components/UniversalFormInput';
import {addTodoListTC, setTodoListsTC} from './reducers/todoLists-reducer';
import { TodoListWithRedux } from './components/TodoListWithRedux';
import {useAppDispatch, useAppSelector} from "./app/hooks/hooks";
import {
    AppBar,
    Button,
    Container,
    Grid,
    IconButton,
    LinearProgress, Menu,
    Paper,
    Toolbar,
    Typography
} from "@mui/material";
import {MenuTwoTone} from "@mui/icons-material";

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
    const status = useAppSelector(state => state.app.status)
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
                        <MenuTwoTone />
                    </IconButton>
                    <Typography variant="h6">
                        Todolists
                    </Typography>
                    <Button color="inherit" variant={"outlined"}>Login</Button>
                </Toolbar>
            </AppBar>
            {status === 'loading' && <LinearProgress color="secondary" />}
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
