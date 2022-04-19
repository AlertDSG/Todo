import React, {ChangeEvent,KeyboardEvent, useState} from "react";
import {Button} from "./Button";
import {FilteredPropsType} from "../App";
import css from "./TodoList.module.css"

type TasksType = {
    id: string
    title: string
    isDone: boolean
}

type TodoListPropsType = {
    title: string
    tasks: TasksType[]
    filter: FilteredPropsType
    deleteTask: (tId: string) => void
    addTask: (newTask: string) => void
    filteredTasks: (filterValue: FilteredPropsType) => void
    changeInputChecked: (tId: string, value: boolean) => void
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
            props.addTask(newTask)
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
        props.changeInputChecked(tId, value)
    }

    const deleteTask = (tId: string) => {
        props.deleteTask(tId)
    }

    return (
        <div>
            <h3>{props.title}</h3>
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
                        name={'All'} callback={()=>{props.filteredTasks('all')}}/>
                <Button className={props.filter === 'active' ? css.active : ''}
                        name={'Active'} callback={()=>{props.filteredTasks('active')}}/>
                <Button className={props.filter === 'completed' ? css.active : ''}
                        name={'Completed'} callback={()=>{props.filteredTasks('completed')}}/>
            </div>
        </div>
    )

}