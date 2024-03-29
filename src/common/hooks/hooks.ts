import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import {AppRootStateType, AppDispatch} from "../../app/store";

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<AppRootStateType> = useSelector