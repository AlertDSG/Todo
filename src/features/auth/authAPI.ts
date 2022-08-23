import {instance} from "../../common/utils/api-utils";
import {ResponseType} from "../todolists/todoList-api";

export const authAPI = {
    authMe: () => {
        return instance.get<ResponseType<UserInfoType>>(`auth/me`)
    },
    login: (data: UserPropertiesType) => {
        return instance.post<ResponseType<{ userId: string }>>(`auth/login`, data)
    },
    logOut: () => {
        return instance.delete<ResponseType>(`auth/login`)
    },

}

export type UserInfoType = {
    id: number
    email: string
    login: string
}
export type FieldErrorType = { field: string; error: string }
export type UserPropertiesType = {
    email: string
    password: string
    rememberMe?: boolean
    captcha?: string
}