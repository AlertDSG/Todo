import React, {useCallback, useEffect, useMemo} from 'react';
import {useAppDispatch, useAppSelector} from "../../common/hooks/hooks";
import {Grid, Paper} from "@mui/material";
import {TodoList} from "../../components/TodoList";
import {UniversalFormInput} from "../../components/UniversalFormInput";
import {useNavigate} from "react-router-dom";
import {todoListsActions, todoListsSelectors} from "./index";
import {authSelectors} from "../auth";

const {setTodoListsTC, addTodoListTC} = todoListsActions

export const TodoLists = React.memo(() => {

    const todoLists = useAppSelector(todoListsSelectors.selectTodoLists)
    const isLoggedIn = useAppSelector(authSelectors.selectIsLoggedIn)
    const dispatch = useAppDispatch()

    useEffect(() => {
        if (isLoggedIn) {
            dispatch(setTodoListsTC())
        }
    }, [])

    const navigate = useNavigate()

    const addNewTodoList = useCallback((title: string) => {
        dispatch(addTodoListTC({title}))
    }, [dispatch])

    const todolistItems = useMemo(() => todoLists.map(t => {
        return (
            <Grid item key={t.id}>
                <Paper style={{margin: "20px", padding: "10px"}} elevation={3}>
                    <TodoList
                        todoList={t}
                    />
                </Paper>
            </Grid>
        )
    }), [todoLists])

    if (!isLoggedIn) {
        navigate('login')
    }

    return (
        <>
            <Grid container>
                <UniversalFormInput callBack={addNewTodoList}/>
            </Grid>
            <Grid container>
                {todolistItems}
            </Grid>
        </>
    );
})