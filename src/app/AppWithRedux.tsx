import React, {useEffect} from 'react';
import '../App.css';
import {useAppDispatch, useAppSelector} from "../common/hooks/hooks";
import {
    AppBar,
    Button,
    CircularProgress,
    Container,
    IconButton,
    LinearProgress,
    Toolbar,
    Typography
} from "@mui/material";
import {MenuTwoTone} from "@mui/icons-material";
import {ErrorSnackbar} from "../components/ErrorSnackbar/ErrorSnackbar";
import {RoutesForProject} from "../common/RoutesForProject";
import {appActions, appSelectors} from "./index";
import {authSelectors, authActions} from "../features/auth";

function AppWithRedux() {

    const status = useAppSelector(appSelectors.selectStatus)
    const initialized = useAppSelector(appSelectors.selectInitialize)
    const isLoggedIn = useAppSelector(authSelectors.selectIsLoggedIn)
    const dispatch = useAppDispatch()

    useEffect(() => {
        if(!initialized){
            dispatch(appActions.initializeApp())
        }
    }, [])

    const logOutHandler = () => {
      dispatch(authActions.removeLogin())
    }

    if (!initialized) {
        return <div style={{position: 'fixed', top: '30%', textAlign: 'center', width: '100%'}}><CircularProgress/></div>
    }

    return (
        <div className="App">
            <ErrorSnackbar/>
            <AppBar position="static">
                <Toolbar style={{justifyContent: "space-between"}}>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <MenuTwoTone/>
                    </IconButton>
                    <Typography variant="h6">
                        Todolists
                    </Typography>
                    {isLoggedIn && <Button color="inherit" variant={"outlined"} onClick={logOutHandler}>Log Out</Button>}
                </Toolbar>
            </AppBar>
            {status === 'loading' && <LinearProgress color="secondary"/>}
            <Container fixed>
                <RoutesForProject/>
            </Container>
        </div>
    );
}

export default AppWithRedux;
