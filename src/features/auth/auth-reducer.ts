import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {authAPI, UserInfoType, UserPropertiesType} from "./authAPI";
import {appActions} from "../../app";

const {setAppStatusAC, initializeApp} = appActions

const createLogin = createAsyncThunk('auth/login', async (param: UserPropertiesType, {
    dispatch,
    rejectWithValue
}) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    const res = await authAPI.login(param)
    if (res.data.resultCode === 0) {
        dispatch(setAppStatusAC({status: 'succeeded'}))
        return {isLoggedIn: true, data: res.data.data}
    }
})
const removeLogin = createAsyncThunk('auth/logOut', async (param, {
    dispatch,
    rejectWithValue
}) => {
    const res = await authAPI.logOut()
    console.log(res)
    if (res.data.resultCode === 0) {
        console.log(res)
        return {isLoggedIn: false}
    }
})

export const asyncActions = {
    createLogin,
    removeLogin
}

export const slice = createSlice({
    name: 'auth',
    initialState: {
        userInfo: {
            id: null as null | number,
            email: null as null | string,
            login: null as null | string,
        } as UserInfoType,
        isLoggedIn: false,
        userId: null as null | string
    },
    reducers: {},
    extraReducers: builder => {
        builder.addCase(initializeApp.fulfilled, (state, action) => {
            if (action.payload.data) {
                state.userInfo = action.payload.data
                state.isLoggedIn = action.payload.isLoggedIn
            }
        })
        builder.addCase(createLogin.fulfilled, (state, action) => {
            if (action.payload) {
                state.userId = action.payload.data.userId
                state.isLoggedIn = action.payload.isLoggedIn
            }
        })
        builder.addCase(removeLogin.fulfilled, (state, action) => {
            if (action.payload) {
                state.isLoggedIn = action.payload.isLoggedIn
            }
        })
    }
})
