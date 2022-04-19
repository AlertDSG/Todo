import React, {useState} from 'react';
import { v1 } from 'uuid';
import './App.css';
import {TodoList} from "./components/TodoList";

export type FilteredPropsType = 'all' | 'active' | 'completed'

function App() {
    type TasksType = {
        id: string
        title: string
        isDone: boolean
    }

    const [tasks, setTasks] = useState<TasksType[]>([
        {id: v1(), title: "HTML&CSS", isDone: true},
        {id: v1(), title: "JS", isDone: true},
        {id: v1(), title: "ReactJS", isDone: false},
        {id: v1(), title: "Rest API", isDone: false},
    ])

    const [filter, setFilter] = useState<FilteredPropsType>('all')

    let filterTasks = tasks;

    if (filter === 'completed') {
        filterTasks = tasks.filter(t => t.isDone)
    }
    if (filter === 'active') {
        filterTasks = tasks.filter(t => !t.isDone)
    }

    const filteredTasks = (filterValue: FilteredPropsType) => {
        setFilter(filterValue)
    }

    const addTask = (value: string) => {
        let newTask = {id: v1(), title: value, isDone: false}
        tasks.length === 0 ? setTasks([newTask]) : setTasks([newTask, ...tasks])
    }

    const deleteTask = (tID: string) => {
        setTasks(tasks.filter(t => t.id !== tID))
    }

    const changeInputChecked = (tId: string, value: boolean) => {
        setTasks(tasks.map(t => t.id === tId ? {...t, isDone: value} : t))
    }

    return (
        <div className="App">
            <TodoList title={'What to learn'}
                      tasks={filterTasks}
                      deleteTask={deleteTask}
                      filteredTasks={filteredTasks}
                      addTask={addTask}
                      changeInputChecked={changeInputChecked}
                      filter={filter}/>
        </div>
    );
}

export default App;
