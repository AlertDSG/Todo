import React, {ChangeEvent,KeyboardEvent, useState} from "react";
import {Button} from "./Button";
import {FilteredPropsType, TasksType} from "../App";
import css from "./TodoList.module.css"

type TodoListPropsType = {
    title: string
    todoListID:string
    tasks: TasksType[]
    filter: FilteredPropsType
    removeTodoList: (todoListID: string) => void
    deleteTask: (todoListID: string, tId: string) => void
    addTask: (todoListID: string, newTask: string) => void
    filteredTasks: (todoListID: string, filterValue: FilteredPropsType) => void
    changeInputChecked: (todoListID: string, tId: string, value: boolean) => void
}

export const TodoList = (props: TodoListPropsType) => {

    const [newTask, setNewTask] = useState<string>('')
    const [error, setError] = useState<string|null>('')


    const onChangeInputHandler = ( e: ChangeEvent<HTMLInputElement>) => {
        setError(null)
        setNewTask(e.currentTarget.value)
    }

    const onClickButtonHandler = () => {
        if(newTask.trim() !== '') {
            props.addTask(props.todoListID, newTask)
            setNewTask('')
        } else {
            setError('Ahtung')
        }

    }

    const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        if(e.key === 'Enter') {
            onClickButtonHandler()
        }
    }

    const onChangeInputCheckedHandler = (tId: string, value: boolean) => {
        props.changeInputChecked(props.todoListID, tId, value)
    }

    const deleteTask = (tId: string) => {
        props.deleteTask(props.todoListID, tId)
    }

    const onClickDeleteTDHandler = () => {
      props.removeTodoList(props.todoListID)
    }

    return (
        <div>
           <button onClick={onClickDeleteTDHandler}>X</button> <h3>{props.title}</h3>
            <div>
                <input className={error ? css.error : ''}
                       value={newTask}
                       onChange={onChangeInputHandler}
                        onKeyPress={onKeyPressHandler}/>
                <button onClick={onClickButtonHandler}>+</button>
                <div className={error ? css.errorMessage : ''}>{error}</div>
            </div>
            <ul>
                {
                    props.tasks.map(t =>{
                        return (
                        <li key={t.id} className={t.isDone ? css.isDone : ''}><button onClick={()=>deleteTask(t.id)}>x</button>
                            <input onChange={(e: ChangeEvent<HTMLInputElement>) => onChangeInputCheckedHandler(t.id, e.currentTarget.checked)} type="checkbox" checked={t.isDone}/>
                            <span>{t.title}</span>
                        </li>
                        )})
                }

            </ul>
            <div>
                <Button className={props.filter === 'all' ? css.active : ''}
                        name={'All'} callback={()=>{props.filteredTasks(props.todoListID,'all')}}/>
                <Button className={props.filter === 'active' ? css.active : ''}
                        name={'Active'} callback={()=>{props.filteredTasks(props.todoListID,'active')}}/>
                <Button className={props.filter === 'completed' ? css.active : ''}
                        name={'Completed'} callback={()=>{props.filteredTasks(props.todoListID,'completed')}}/>
            </div>
        </div>
    )

}