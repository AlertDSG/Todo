import React, {useCallback, useEffect} from "react";
import css from "./TodoList.module.css"
import {UniversalFormInput} from "./UniversalFormInput";

import {EditableSpan} from "./EditableSpan";
import {
    changeFilterTodoListAC, deleteTodoListTC, TodolistDomainType,
} from "../reducers/todoLists-reducer";
import {Task} from "./Task";
import {useAppSelector, useAppDispatch} from "../app/hooks/hooks";
import {createTasksTC, setTasksTC} from "../reducers/tasks-reducer";
import {Button, IconButton, List} from "@mui/material";
import {DeleteForeverOutlined} from "@mui/icons-material";
import {updateTodoList} from "../sagas/todolists-sagas";


type TodoListPropsType = {
    todoList: TodolistDomainType
}

export const TodoListWithRedux: React.FC<TodoListPropsType> = React.memo(({todoList}) => {
    useEffect(() => {
        dispatch(setTasksTC(todoList.id))
    },[])

    let tasks = useAppSelector(state => state.tasks[todoList.id])

    const dispatch = useAppDispatch()

    if (todoList.filter === 'completed') {
        tasks = tasks.filter(t => t.status)
    }
    if (todoList.filter === 'active') {
        tasks = tasks.filter(t => !t.status)
    }

    const onClickDeleteTDHandler = useCallback(() => {
        dispatch(deleteTodoListTC(todoList.id))
    },[todoList.id])

    const changeTitleForTodoList = useCallback((title: string) => {
         dispatch(updateTodoList(todoList.id, title))
    }, [todoList.id])

    const addTask = useCallback((value: string) => {
         dispatch(createTasksTC(todoList.id,value))
    }, [todoList.id])

    const buttonAll = todoList.filter === 'all' ? "secondary" : 'primary'
    const buttonActive = todoList.filter === 'active' ? "secondary" : 'primary'
    const buttonCompleted = todoList.filter === 'completed' ? "secondary" : 'primary'


    return (
        <div>
            <h3>
                <IconButton onClick={onClickDeleteTDHandler} disabled={todoList.entityStatus === 'loading'} className={todoList.entityStatus === 'loading' ? css.isDone :''}>
                    <DeleteForeverOutlined color={'secondary'} fontSize={'small'}/>
                </IconButton>
                <EditableSpan onChange={changeTitleForTodoList} title={todoList.title}/>
            </h3>
            <UniversalFormInput className={css.error} callBack={addTask} disabled={todoList.entityStatus === 'loading'}/>
            <List disablePadding dense>
                {
                    tasks.map(t => <Task key={t.id}
                                         todoListId={todoList.id}
                                         task={t}
                    />)
                }

            </List>
            <div>
                <Button color={buttonAll}
                        size={'small'}
                        onClick={() => {
                            dispatch(changeFilterTodoListAC(todoList.id, 'all'))
                        }}>
                    All
                </Button>
                <Button color={buttonActive}
                        size={'small'}
                        onClick={() => {
                            dispatch(changeFilterTodoListAC(todoList.id, 'active'))
                        }}>Active</Button>
                <Button color={buttonCompleted}
                        size={'small'}
                        onClick={() => {
                            dispatch(changeFilterTodoListAC(todoList.id, 'completed'))
                        }}>Completed</Button>
            </div>
        </div>
    )

})