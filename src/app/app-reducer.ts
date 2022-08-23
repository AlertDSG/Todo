import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {authAPI} from "../features/auth/authAPI";

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

const initializeApp = createAsyncThunk('app/initialized', async () => {
        const res = await authAPI.authMe()
    console.log('me', res)
        if (res.data.resultCode === 0) {
            return {initialized: true, data: res.data.data, isLoggedIn: true}
        } else return {initialized: true}
})

export const asyncActions = {
    initializeApp
}

export const slice = createSlice({
    name: 'app',
    initialState: {
        status: 'succeeded' as RequestStatusType,
        error: null as null | string,
        initialized: false
    },
    reducers: {
        setAppStatusAC: (state, action: PayloadAction<{ status: RequestStatusType }>) => {
            state.status = action.payload.status
        },
        setAppErrorAC: (state, action: PayloadAction<{ error: null | string }>) => {
            state.error = action.payload.error
        }
    },
    extraReducers: builder => {
        builder.addCase(initializeApp.fulfilled, (state, action) => {
            state.initialized = action.payload.initialized
        })
    }
})