import React, {ChangeEvent} from "react";
import {FilteredPropsType, TasksType} from "../App";
import css from "./TodoList.module.css"
import {UniversalFormInput} from "./UniversalFormInput";
import {Button, Checkbox, IconButton,List, ListItem} from "@material-ui/core";
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';



type TodoListPropsType = {
    title: string
    todoListID: string
    tasks: TasksType[]
    filter: FilteredPropsType
    removeTodoList: (todoListID: string) => void
    deleteTask: (todoListID: string, tId: string) => void
    addTask: (todoListID: string, newTask: string) => void
    filteredTasks: (todoListID: string, filterValue: FilteredPropsType) => void
    changeInputChecked: (todoListID: string, tId: string, value: boolean) => void
}

export const TodoList = (props: TodoListPropsType) => {

    const onChangeInputCheckedHandler = (tId: string, value: boolean) => {
        props.changeInputChecked(props.todoListID, tId, value)
    }

    const deleteTask = (tId: string) => {
        props.deleteTask(props.todoListID, tId)
    }

    const onClickDeleteTDHandler = () => {
        props.removeTodoList(props.todoListID)
    }

    const buttonAll = props.filter === 'all' ? "secondary" : 'primary'
    const buttonActive = props.filter === 'active' ? "secondary" : 'primary'
    const buttonCompleted = props.filter === 'completed' ? "secondary" : 'primary'

    return (
        <div>

            <h3><IconButton onClick={onClickDeleteTDHandler}>
                <DeleteOutlineIcon color={'secondary'}/>
            </IconButton>{props.title}</h3>
            <UniversalFormInput className={css.error} callBack={(newTask) => props.addTask(props.todoListID, newTask)}/>
            <List disablePadding dense>
                {
                    props.tasks.map(t => {

                        return (
                            <ListItem divider dense disableGutters key={t.id} className={t.isDone ? css.isDone : ''}>
                                <IconButton onClick={() => deleteTask(t.id)}>
                                    <DeleteOutlineIcon color={'secondary'} fontSize={'small'} />
                                </IconButton>
                                <Checkbox
                                    size={'small'}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => onChangeInputCheckedHandler(t.id, e.currentTarget.checked)}
                                    checked={t.isDone}
                                    color={'primary'}/>
                                <span>{t.title}</span>
                            </ListItem>
                        )
                    })
                }

            </List>
            <div>
                <Button color={buttonAll}
                        size={'small'}
                        onClick={() => {props.filteredTasks(props.todoListID, 'all')
                        }}>
                    All
                </Button>
                <Button color={buttonActive}
                        size={'small'}
                        onClick={() => {
                            props.filteredTasks(props.todoListID, 'active')
                        }}>Active</Button>
                <Button color={buttonCompleted}
                        size={'small'}
                        onClick={() => {
                            props.filteredTasks(props.todoListID, 'completed')
                        }}>Completed</Button>
            </div>
        </div>
    )

}