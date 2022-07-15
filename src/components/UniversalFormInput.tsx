import React, {ChangeEvent, KeyboardEvent, useState} from 'react';
import {IconButton, TextField} from "@mui/material";
import {Add} from "@mui/icons-material";

type UniversalFormInputPropsTpe = {
    callBack: (newTask: string) => void
    className?: string
    disabled?: boolean
}

export const UniversalFormInput = React.memo((props: UniversalFormInputPropsTpe) => {
    console.log('AddItemForm called')

    const [newTask, setNewTask] = useState<string>('')
    const [error, setError] = useState<string | null>('')

    const onChangeInputHandler = (e: ChangeEvent<HTMLInputElement>) => {
        !!error && setError(null)
        setNewTask(e.currentTarget.value)
    }

    const onClickButtonHandler = () => {
        if (newTask.trim() !== '') {
            props.callBack(newTask)
            setNewTask('')
        } else {
            setError('Ahtung')
        }

    }

    const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            onClickButtonHandler()
        }
    }

    return (
        <div style={{display: 'flex', alignItems: "center", gap: '5px', padding: '15px'}}>
            <TextField
                size={'medium'}
                className={error ? props.className : ''}
                value={newTask}
                onChange={onChangeInputHandler}
                onKeyPress={onKeyPressHandler}
                label={'Title'}
                error={!!error}
                helperText={!!error && 'Title is required!'}
                disabled={props.disabled}
            />
            <IconButton onClick={onClickButtonHandler} disabled={props.disabled}>
                <Add fontSize={'small'} color={'primary'}/>
            </IconButton>

        </div>
    );
})

