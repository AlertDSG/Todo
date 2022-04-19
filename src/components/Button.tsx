import React from "react";

type ButtonPropsType = {
    name: string
    callback: () => void
    className?: string
}

export const Button = (props: ButtonPropsType) => {

    const onClickHandler = () => {
        props.callback()
    }

    return (
        <button className={props.className} onClick={onClickHandler}>{props.name}</button>
    )
}