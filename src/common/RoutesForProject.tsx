import React from 'react';
import {Container} from "@mui/material";
import {Navigate, Route, Routes} from 'react-router-dom'
import {TodoLists} from "../features/todolists/TodoLists";
import {Login} from "../features/auth";


export const RoutesForProject = () => {

    return (
        <Container fixed>
            <Routes>
                <Route path={'/'} element={<TodoLists/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/404" element={<h1 style={{textAlign: 'center'}}>404: PAGE NOT FOUND</h1>}/>
                <Route path="*" element={<Navigate to={'/404'}/>}/>
            </Routes>

        </Container>
    );
};