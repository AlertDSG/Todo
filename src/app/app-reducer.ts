import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

const initialState = {
    status: 'succeeded' as RequestStatusType,
    error: null as null | string
}


const slice = createSlice({
    name:'app',
    initialState: initialState,
    reducers: {
        setAppStatusAC: (state, action: PayloadAction<{status: RequestStatusType}>) => {
            state.status = action.payload.status
        },
        setAppErrorAC: (state, action: PayloadAction<{error: null | string}>) => {
            state.error = action.payload.error
        }
    }
})

export const appReducer = slice.reducer

export const {setAppStatusAC, setAppErrorAC} = slice.actions

// type InitialStateType = typeof initialState
//
// export const appReducer = (state: InitialStateType = initialState, action: AppActionsType): InitialStateType => {
//     switch (action.type) {
//         case 'APP/SET-STATUS':
//             return {...state, status: action.status}
//         case 'APP/SET-ERROR':
//             return {...state, error: action.error}
//         default:
//             return state
//     }
// }

// export const setAppStatusAC  = (status: RequestStatusType) => {
//     return {
//         type: 'APP/SET-STATUS',
//         status
//     } as const
// }
// export const setAppErrorAC  = (error: null | string) => {
//     return {
//         type: 'APP/SET-ERROR',
//         error
//     } as const
// }


// export type AppActionsType = ReturnType<typeof setAppStatusAC> | ReturnType<typeof setAppErrorAC>