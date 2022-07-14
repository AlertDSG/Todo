import axios from "axios";


const instance = axios.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.1/',
    withCredentials: true,
    headers: {
        'API-KEY': 'daa5219f-4bd1-4a25-b139-227a461bb757'
    }
})

export const todoListsApi = {
    getTodoLists(){
       return instance.get(`todo-lists`)
    }
}