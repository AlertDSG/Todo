
const initialState = {
    isLoggedIn: false
}

type InitialStateType = typeof initialState

export const authReducer = (state: InitialStateType = initialState, action: AuthActionType): InitialStateType => {

    switch (action.type) {

        case 'AUTH/IS_LOGGED_IN':
            return {
                ...state,
                isLoggedIn: action.isLoggedIn
            }
        default:
            return state
    }

}

export const setIsLoggedInAc = (isLoggedIn: boolean) => ({type: 'AUTH/IS_LOGGED_IN', isLoggedIn}) as const
export type AuthActionType = ReturnType<typeof setIsLoggedInAc>