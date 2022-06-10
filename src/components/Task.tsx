import {Checkbox, IconButton, ListItem } from '@material-ui/core';
import React, {ChangeEvent, useCallback} from 'react';
import { EditableSpan } from './EditableSpan';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import css from "./TodoList.module.css"
import { TasksType } from '../AppWithRedux';

type OnlyTaskType ={
    task: TasksType
    deleteTask: (tId: string) => void
    changeTaskStatus: (tId: string, value: boolean) => void
    changeTitleForTask: (tId: string, value: string) => void
}

export const Task = React.memo((props: OnlyTaskType) => {

    const deleteTask = () => {
      props.deleteTask(props.task.id)
    }

    const onChangeInputCheckedHandler = (e: ChangeEvent<HTMLInputElement>) => {
        props.changeTaskStatus(props.task.id, e.currentTarget.checked)
    }
    const changeTitleForTask = useCallback((value: string) => {
      props.changeTitleForTask(props.task.id, value)
    }, [props.task.id])

    return (
        <ListItem divider dense disableGutters className={props.task.isDone ? css.isDone : ''}>
            <IconButton onClick={deleteTask}>
                <DeleteOutlineIcon color={'secondary'} fontSize={'small'}/>
            </IconButton>
            <Checkbox
                size={'small'}
                onChange={onChangeInputCheckedHandler}
                checked={props.task.isDone}
                color={'primary'}/>
            <EditableSpan onChange={changeTitleForTask}
                          title={props.task.title}/>
        </ListItem>
    )

})

