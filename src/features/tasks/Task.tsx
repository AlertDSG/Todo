import React, {ChangeEvent, useCallback} from 'react';
import {EditableSpan} from '../../components/EditableSpan';
import css from "../../components/TodoList.module.css"
import {TaskStatuses} from '../todolists/todoList-api'
import {useAppDispatch} from "../../common/hooks/hooks";
import {Checkbox, IconButton, ListItem} from "@mui/material";
import {DeleteForeverOutlined} from "@mui/icons-material"
import {TaskTypeState, taskActions} from "./index";

type OnlyTaskType ={
    task: TaskTypeState
    todoListId: string
}
const {removeTask, updateTask} = taskActions

export const Task: React.FC<OnlyTaskType> = React.memo(({task, todoListId}) => {


    const dispatch = useAppDispatch()

    const deleteTask = useCallback(() => {
         dispatch(removeTask({todoListId, taskId: task.id}))
    },[dispatch, todoListId, task.id])

    const onChangeInputCheckedHandler = useCallback((e: ChangeEvent<HTMLInputElement>) => {
         dispatch(updateTask({taskId: task.id,domainModel:{status: e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New}, todoListId}))

    },[dispatch, task.id, todoListId])

    const changeTitleForTask = useCallback((title: string) => {
        dispatch(updateTask({taskId: task.id, domainModel:{title}, todoListId}))

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
                          entityStatus={'succeeded'}/>
        </ListItem>
    )

})

