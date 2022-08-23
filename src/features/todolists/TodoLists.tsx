import React, {useCallback, useEffect, useMemo} from 'react';
import {useAppDispatch, useAppSelector} from "../../common/hooks/hooks";
import {addTodoListTC, setTodoListsTC} from "./todoLists-reducer";
import {Grid, Paper} from "@mui/material";
import {TodoListWithRedux} from "../../components/TodoListWithRedux";
import {UniversalFormInput} from "../../components/UniversalFormInput";
import {useNavigate} from "react-router-dom";

export const TodoLists = () => {
    const todoLists = useAppSelector(state => state.todoLists)
    const isLoggedIn = useAppSelector(state => state.auth.isLoggedIn)
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
                    <TodoListWithRedux
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
};