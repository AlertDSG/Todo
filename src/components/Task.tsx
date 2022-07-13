import {Checkbox, IconButton, ListItem } from '@material-ui/core';
import React, {ChangeEvent, useCallback} from 'react';
import { EditableSpan } from './EditableSpan';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import css from "./TodoList.module.css"
import { TasksType } from '../AppWithRedux';
import { useDispatch } from 'react-redux';
import {changeTaskStatusAC, changeTaskTitleAC, removeTaskAC } from '../reducers/tasks-reducer';

type OnlyTaskType ={
    task: TasksType
    todoListId: string
}

export const Task: React.FC<OnlyTaskType> = React.memo(({task, todoListId}) => {

    const dispatch = useDispatch()

    const deleteTask = useCallback(() => {
        dispatch(removeTaskAC(todoListId, task.id))
    },[dispatch, todoListId, task.id])

    const onChangeInputCheckedHandler = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        dispatch(changeTaskStatusAC(todoListId, task.id, e.currentTarget.checked))

    },[dispatch, task.id, todoListId])

    const changeTitleForTask = useCallback((value: string) => {
        dispatch(changeTaskTitleAC(todoListId, task.id, value))

    }, [todoListId,task.id, dispatch])

    return (
        <ListItem divider dense disableGutters className={task.isDone ? css.isDone : ''}>
            <IconButton onClick={deleteTask}>
                <DeleteOutlineIcon color={'secondary'} fontSize={'small'}/>
            </IconButton>
            <Checkbox
                size={'small'}
                onChange={onChangeInputCheckedHandler}
                checked={task.isDone}
                color={'primary'}/>
            <EditableSpan onChange={changeTitleForTask}
                          title={task.title}/>
        </ListItem>
    )

})

