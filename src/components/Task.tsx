import React, {ChangeEvent, useCallback} from 'react';
import { EditableSpan } from './EditableSpan';
import css from "./TodoList.module.css"
import {TaskStatuses} from '../api/todoList-api'
import {TaskTypeState} from "../reducers/tasks-reducer";
import {useAppDispatch, useAppSelector} from "../app/hooks/hooks";
import {Checkbox, IconButton, ListItem} from "@mui/material";
import {DeleteForeverOutlined} from "@mui/icons-material"
import {removeTask, updateTasks} from "../sagas/tasks-sagas";

type OnlyTaskType ={
    task: TaskTypeState
    todoListId: string
}

export const Task: React.FC<OnlyTaskType> = React.memo(({task, todoListId}) => {
    const taskNew = useAppSelector(state => state.tasks[todoListId].find(t => t.id === task.id))
    console.log(taskNew)

    const dispatch = useAppDispatch()

    const deleteTask = useCallback(() => {
         dispatch(removeTask(todoListId, task.id))
    },[dispatch, todoListId, task.id])

    const onChangeInputCheckedHandler = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        console.log(e.currentTarget.checked)
         dispatch(updateTasks(task.id,{status: e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New}, todoListId))

    },[dispatch, task.id, todoListId])

    const changeTitleForTask = useCallback((title: string) => {
        dispatch(updateTasks(task.id,{title}, todoListId))

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
                          title={task.title}
                          entityStatus={task.entityStatus}/>
        </ListItem>
    )

})

