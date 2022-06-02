import React, {ChangeEvent} from "react";
import {FilteredPropsType, TasksType} from "../App";
import css from "./TodoList.module.css"
import {UniversalFormInput} from "./UniversalFormInput";
import {Button, Checkbox, IconButton, List, ListItem} from "@material-ui/core";
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import {EditableSpan} from "./EditableSpan";
import {useSelector, useDispatch} from "react-redux";
import {AppRootStateType} from "../state/store";
import {TodoListType } from "../AppWithRedux";
import {addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC } from "../reducers/tasks-reducer";
import {changeFilterTodoListAC, changeTodoListAC, removeTodoListAC } from "../reducers/todoLists-reducer";


type TodoListPropsType = {
    todoList: TodoListType
}

export const TodoListWithRedux : React.FC<TodoListPropsType> =  ({todoList}) => {

    let tasks = useSelector<AppRootStateType, TasksType[]>(state => state.tasks[todoList.id])
    const dispatch = useDispatch()

    if (todoList.filter === 'completed') {
        tasks = tasks.filter(t => t.isDone)
    }
    if (todoList.filter === 'active') {
        tasks = tasks.filter(t => !t.isDone)
    }

    const onChangeInputCheckedHandler = (tId: string, value: boolean) => {
        dispatch(changeTaskStatusAC(todoList.id, tId, value))
    }

    const deleteTask = (tId: string) => {
        dispatch(removeTaskAC(todoList.id, tId))
    }

    const onClickDeleteTDHandler = () => {
        dispatch(removeTodoListAC(todoList.id))
    }

    const changeTitleForTask = (tId: string, value: string) => {
        dispatch(changeTaskTitleAC(todoList.id, tId, value))
    }

    const changeTitleForTodoLst = (title: string) => {
        dispatch(changeTodoListAC(todoList.id, title))
    }

    const buttonAll = todoList.filter === 'all' ? "secondary" : 'primary'
    const buttonActive = todoList.filter === 'active' ? "secondary" : 'primary'
    const buttonCompleted = todoList.filter === 'completed' ? "secondary" : 'primary'

    return (
        <div>

            <h3>
                <IconButton onClick={onClickDeleteTDHandler}>
                    <DeleteOutlineIcon color={'secondary'}/>
                </IconButton>
                <EditableSpan onChange={changeTitleForTodoLst} title={todoList.title}/>
            </h3>
            <UniversalFormInput className={css.error} callBack={(newTask) =>  dispatch(addTaskAC(todoList.id, newTask))}/>
            <List disablePadding dense>
                {
                    tasks.map(t => {

                        return (
                            <ListItem divider dense disableGutters key={t.id} className={t.isDone ? css.isDone : ''}>
                                <IconButton onClick={() => deleteTask(t.id)}>
                                    <DeleteOutlineIcon color={'secondary'} fontSize={'small'}/>
                                </IconButton>
                                <Checkbox
                                    size={'small'}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => onChangeInputCheckedHandler(t.id, e.currentTarget.checked)}
                                    checked={t.isDone}
                                    color={'primary'}/>
                                <EditableSpan onChange={(value: string) => changeTitleForTask(t.id, value)}
                                              title={t.title}/>
                            </ListItem>
                        )
                    })
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

}