import React, {ChangeEvent, KeyboardEvent, useState} from 'react';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import {IconButton, TextField} from '@material-ui/core';

type UniversalFormInputPropsTpe = {
    callBack: (newTask: string) => void
    className?: string
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
        <div>
            <TextField
                size={'medium'}
                className={error ? props.className : ''}
                value={newTask}
                onChange={onChangeInputHandler}
                onKeyPress={onKeyPressHandler}
                label={'Title'}
                error={!!error}
                helperText={!!error && 'Title is required!'}/>
            <IconButton onClick={onClickButtonHandler}><AddCircleOutlineIcon fontSize={'small'}
                                                                             color={'primary'}/></IconButton>

        </div>
    );
})

