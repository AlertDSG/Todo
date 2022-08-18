import React, {useCallback, useEffect} from "react";
import css from "./TodoList.module.css"
import {UniversalFormInput} from "./UniversalFormInput";

import {EditableSpan} from "./EditableSpan";
import {
    changeFilterTodoListAC,
    deleteTodoListTC,
    TodolistDomainType,
    updateTodoListTC
} from "../reducers/todoLists-reducer";
import {Task} from "./Task";
import {useAppDispatch, useAppSelector} from "../app/hooks/hooks";
import {createTasks, fetchTasks} from "../reducers/tasks-reducer";
import {Button, IconButton, List} from "@mui/material";
import {DeleteForeverOutlined} from "@mui/icons-material";


type TodoListPropsType = {
    todoList: TodolistDomainType
}

export const TodoListWithRedux: React.FC<TodoListPropsType> = React.memo(({todoList}) => {
    useEffect(() => {
        dispatch(fetchTasks(todoList.id))
    }, [])

    let tasks = useAppSelector(state => state.tasks[todoList.id])

    const dispatch = useAppDispatch()

    if (todoList.filter === 'completed') {
        tasks = tasks.filter(t => t.status)
    }
    if (todoList.filter === 'active') {
        tasks = tasks.filter(t => !t.status)
    }

    const onClickDeleteTDHandler = useCallback(() => {
        dispatch(deleteTodoListTC({id: todoList.id}))
    }, [todoList.id])

    const changeTitleForTodoList = useCallback((title: string) => {
        dispatch(updateTodoListTC({id: todoList.id, title}))
    }, [todoList.id])

    const addTask = useCallback((title: string) => {
        const id = todoList.id
        dispatch(createTasks({id, title}))
    }, [todoList.id])

    const buttonAll = todoList.filter === 'all' ? "secondary" : 'primary'
    const buttonActive = todoList.filter === 'active' ? "secondary" : 'primary'
    const buttonCompleted = todoList.filter === 'completed' ? "secondary" : 'primary'


    return (
        <div>
            <h3>
                <IconButton onClick={onClickDeleteTDHandler} disabled={todoList.entityStatus === 'loading'}
                            className={todoList.entityStatus === 'loading' ? css.isDone : ''}>
                    <DeleteForeverOutlined color={'secondary'} fontSize={'small'}/>
                </IconButton>
                <EditableSpan onChange={changeTitleForTodoList} title={todoList.title}
                              entityStatus={todoList.entityStatus}/>
            </h3>
            <UniversalFormInput className={css.error} callBack={addTask}
                                disabled={todoList.entityStatus === 'loading'}/>
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
                            dispatch(changeFilterTodoListAC({id: todoList.id, filter: 'all'}))
                        }}>
                    All
                </Button>
                <Button color={buttonActive}
                        size={'small'}
                        onClick={() => {
                            dispatch(changeFilterTodoListAC({id: todoList.id, filter: 'active'}))
                        }}>Active</Button>
                <Button color={buttonCompleted}
                        size={'small'}
                        onClick={() => {
                            dispatch(changeFilterTodoListAC({id: todoList.id, filter: 'completed'}))
                        }}>Completed</Button>
            </div>
        </div>
    )

})