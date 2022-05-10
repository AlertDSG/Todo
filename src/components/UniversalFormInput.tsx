import React, {ChangeEvent,KeyboardEvent, useState } from 'react';

type UniversalFormInputPropsTpe ={
    callBack: (newTask: string) => void
    className?: string
}

export const UniversalFormInput = (props: UniversalFormInputPropsTpe) => {

    const [newTask, setNewTask] = useState<string>('')
    const [error, setError] = useState<string|null>('')

    const onChangeInputHandler = ( e: ChangeEvent<HTMLInputElement>) => {
        setError(null)
        setNewTask(e.currentTarget.value)
    }

    const onClickButtonHandler = () => {
        if(newTask.trim() !== '') {
            props.callBack(newTask)
            setNewTask('')
        } else {
            setError('Ahtung')
        }

    }

    const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        if(e.key === 'Enter') {
            onClickButtonHandler()
        }
    }

    return (
        <div>
            <input className={error ? props.className : ''}
                   value={newTask}
                   onChange={onChangeInputHandler}
                   onKeyPress={onKeyPressHandler}/>
            <button onClick={onClickButtonHandler}>+</button>
            <div className={error ? props.className : ''}>{error}</div>
        </div>
    );
};

