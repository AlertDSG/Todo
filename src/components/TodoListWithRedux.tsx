import React, {ChangeEvent, useCallback} from "react";
import {FilteredPropsType, TasksType} from "../App";
import css from "./TodoList.module.css"
import {UniversalFormInput} from "./UniversalFormInput";
import {Button, Checkbox, IconButton, List, ListItem} from "@material-ui/core";
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import {EditableSpan} from "./EditableSpan";
import {useSelector, useDispatch} from "react-redux";
import {AppRootStateType} from "../state/store";
import {TodoListType} from "../AppWithRedux";
import {addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC} from "../reducers/tasks-reducer";
import {changeFilterTodoListAC, changeTodoListAC, removeTodoListAC} from "../reducers/todoLists-reducer";
import {Task} from "./Task";


type TodoListPropsType = {
    todoList: TodoListType
}

export const TodoListWithRedux: React.FC<TodoListPropsType> = React.memo(({todoList}) => {
    console.log('Todolist called')

    let tasks = useSelector<AppRootStateType, TasksType[]>(state => state.tasks[todoList.id])
    const dispatch = useDispatch()

    if (todoList.filter === 'completed') {
        tasks = tasks.filter(t => t.isDone)
    }
    if (todoList.filter === 'active') {
        tasks = tasks.filter(t => !t.isDone)
    }

    const changeTaskStatus = useCallback((tId: string, value: boolean) => {
        dispatch(changeTaskStatusAC(todoList.id, tId, value))
    }, [todoList.id])

    const deleteTask = useCallback((tId: string) => {
        dispatch(removeTaskAC(todoList.id, tId))
    }, [todoList.id])

    const onClickDeleteTDHandler = () => {
        dispatch(removeTodoListAC(todoList.id))
    }

    const changeTitleForTask = useCallback((tId: string, value: string) => {
        dispatch(changeTaskTitleAC(todoList.id, tId, value))
    }, [todoList.id])

    const changeTitleForTodoList = useCallback((title: string) => {
        dispatch(changeTodoListAC(todoList.id, title))
    }, [todoList.id])

    const addTask = useCallback((value: string) => {
        dispatch(addTaskAC(todoList.id, value))
    }, [todoList.id])

    const buttonAll = todoList.filter === 'all' ? "secondary" : 'primary'
    const buttonActive = todoList.filter === 'active' ? "secondary" : 'primary'
    const buttonCompleted = todoList.filter === 'completed' ? "secondary" : 'primary'

    return (
        <div>

            <h3>
                <IconButton onClick={onClickDeleteTDHandler}>
                    <DeleteOutlineIcon color={'secondary'}/>
                </IconButton>
                <EditableSpan onChange={changeTitleForTodoList} title={todoList.title}/>
            </h3>
            <UniversalFormInput className={css.error} callBack={addTask}/>
            <List disablePadding dense>
                {
                    tasks.map(t => <Task key={t.id}
                                         task={t}
                                         deleteTask={deleteTask}
                                         changeTaskStatus={changeTaskStatus}
                                         changeTitleForTask={changeTitleForTask}


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