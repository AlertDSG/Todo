import axios from "axios";
import {ResponseType} from "./todoList-api";


export const instance = axios.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.1/',
    withCredentials: true,
    headers: {
        'API-KEY': 'daa5219f-4bd1-4a25-b139-227a461bb757'
    }
})

export const authApi = {
    me() {
        return instance.get<ResponseType<MeDate>>(`auth/me`)
            .then(res => res.data)
    }
}

export type MeDate = {
    id: number
    email: string
    login: string
}
