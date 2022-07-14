import React, {ChangeEvent, useCallback} from 'react';
import { EditableSpan } from './EditableSpan';
import css from "./TodoList.module.css"
import {TaskStatuses, TaskType} from '../api/todoList-api'
import {deleteTaskTC, updateTasksTC} from "../reducers/tasks-reducer";
import {useAppDispatch} from "../app/hooks/hooks";
import {Checkbox, IconButton, ListItem} from "@mui/material";
import {DeleteForeverOutlined} from "@mui/icons-material"

type OnlyTaskType ={
    task: TaskType
    todoListId: string
}

export const Task: React.FC<OnlyTaskType> = React.memo(({task, todoListId}) => {

    const dispatch = useAppDispatch()

    const deleteTask = useCallback(() => {
         dispatch(deleteTaskTC(todoListId, task.id))
    },[dispatch, todoListId, task.id])

    const onChangeInputCheckedHandler = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        console.log(e.currentTarget.checked)
         dispatch(updateTasksTC(task.id,{status: e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New}, todoListId))

    },[dispatch, task.id, todoListId])

    const changeTitleForTask = useCallback((title: string) => {
        dispatch(updateTasksTC(task.id,{title}, todoListId))

    }, [todoListId,task.id, dispatch])

    return (
        <ListItem divider dense disableGutters className={task.status === TaskStatuses.Completed ? css.isDone : ''}>
            <IconButton onClick={deleteTask}>
                <DeleteForeverOutlined color={'secondary'} fontSize={'small'}/>
            </IconButton>
            <Checkbox
                size={'small'}
                onChange={onChangeInputCheckedHandler}
                checked={task.status === TaskStatuses.Completed}
                color={'primary'}/>
            <EditableSpan onChange={changeTitleForTask}
                          title={task.title}/>
        </ListItem>
    )

})

