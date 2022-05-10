import {AppBar, Container, Grid, IconButton, Paper, Toolbar, Typography} from '@material-ui/core';
import {Menu} from '@material-ui/icons';
import React, {useState} from 'react';
import {v1} from 'uuid';
import './App.css';
import {Button} from "@material-ui/core";
import {TodoList} from "./components/TodoList";
import {UniversalFormInput} from './components/UniversalFormInput';

export type FilteredPropsType = 'all' | 'active' | 'completed'

export type TasksType = {
    id: string
    title: string
    isDone: boolean
}

export type TaskForTodoList = {
    [todoListID: string]: TasksType[],
}

type TodoListType = {
    id: string,
    title: string,
    filter: FilteredPropsType
}

function App() {

    let todoListID1 = v1();
    let todoListID2 = v1();

    const [todoLists, setTodoLists] = useState<TodoListType[]>([
        {id: todoListID1, title: 'What to learn', filter: 'all'},
        {id: todoListID2, title: 'What to Buy', filter: 'all'},
    ])


    const [tasks, setTasks] = useState<TaskForTodoList>({
            [todoListID1]: [
                {id: v1(), title: "HTML&CSS", isDone: true},
                {id: v1(), title: "JS", isDone: true},
                {id: v1(), title: "ReactJS", isDone: false},
                {id: v1(), title: "Rest API", isDone: false},
            ],
            [todoListID2]: [
                {id: v1(), title: "Milk", isDone: true},
                {id: v1(), title: "Bread", isDone: true},
                {id: v1(), title: "Sugar", isDone: false},
                {id: v1(), title: "Sold", isDone: false},
            ],
        }
    )

    const filteredTasks = (todoListID: string, filterValue: FilteredPropsType) => {
        setTodoLists(todoLists.map(tl => tl.id === todoListID ? {...tl, filter: filterValue} : tl))
    }

    const addTask = (todoListID: string, value: string) => {
        const newTask = {id: v1(), title: value, isDone: false}
        setTasks({...tasks, [todoListID]: [newTask, ...tasks[todoListID]]})
    }

    const deleteTask = (todoListID: string, tID: string) => {
        setTasks({...tasks, [todoListID]: tasks[todoListID].filter(t => t.id !== tID)})
    }

    const changeInputChecked = (todoListID: string, tId: string, value: boolean) => {
        setTasks({...tasks, [todoListID]: tasks[todoListID].map(t => t.id === tId ? {...t, isDone: value} : t)})
    }

    const removeTodoList = (todoListID: string) => {
        setTodoLists(todoLists.filter(tl => tl.id !== todoListID))
        const copyTasks = {...tasks}
        delete copyTasks[todoListID]
        setTasks(copyTasks)

    }

    const addNewTodoList = (newTodoList: string) => {
        const newID = v1();
        setTodoLists([...todoLists, {id: newID, title: newTodoList, filter: 'all'}])
        setTasks({...tasks, [newID]: []})
    }

    const todolistItems = todoLists.map(t => {

        let filterTasks = tasks[t.id];

        if (t.filter === 'completed') {
            filterTasks = tasks[t.id].filter(t => t.isDone)
        }
        if (t.filter === 'active') {
            filterTasks = tasks[t.id].filter(t => !t.isDone)
        }

        return (
            <Grid  item key={t.id}>
                <Paper style={{margin: "20px", padding: "10px"}} elevation={3}>
                    <TodoList
                        todoListID={t.id}
                        title={t.title}
                        tasks={filterTasks}
                        removeTodoList={removeTodoList}
                        deleteTask={deleteTask}
                        filteredTasks={filteredTasks}
                        addTask={addTask}
                        changeInputChecked={changeInputChecked}
                        filter={t.filter}
                    />
                </Paper>
            </Grid>
        )
    })

    return (
        <div className="App">
            <AppBar position="static">
                <Toolbar style={{justifyContent: "space-between"}}>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <Menu/>
                    </IconButton>
                    <Typography variant="h6">
                        Todolists
                    </Typography>
                    <Button color="inherit" variant={"outlined"}>Login</Button>
                </Toolbar>
            </AppBar>
            <Container fixed>
                <Grid container>
                    <UniversalFormInput callBack={addNewTodoList}/>
                </Grid>
                <Grid container>
                    {todolistItems}
                </Grid>
            </Container>
        </div>
    );
}

export default App;
