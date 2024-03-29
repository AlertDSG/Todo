import React, {ChangeEvent, KeyboardEvent, useState} from 'react';
import {RequestStatusType} from "../app/app-reducer";


type EditableSpanType = {
    title: string
    entityStatus?: RequestStatusType
    onChange: (newTitle: string) => void
}

export const EditableSpan = React.memo((props: EditableSpanType) => {
    console.log('editspan called')

    const [editMode, setEditMode] = useState<boolean>( false)
    const [value, setValue] = useState<string>(props.title)

    const onDoubleClickHandler = () => {
        setEditMode(true)
    }

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setValue(e.currentTarget.value)
    }

    const onBlurHandler = () => {
        props.onChange(value)
        setEditMode(false)
    }

    const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
      if(e.key === 'Enter'){
          props.onChange(value)
          setEditMode(false)
      }
    }

    return (

        <>
            {props.entityStatus === 'succeeded' &&  editMode
                ? <input onKeyPress={onKeyPressHandler} onChange={onChangeHandler} onBlur={onBlurHandler} value={value} autoFocus/>
                : <span onDoubleClick={onDoubleClickHandler}>{props.title}</span>}
        </>
    )
})

