import React, { memo } from 'react'
import './Button.scss'

type Props = {
    action: (e: any) => void
    classNames?: String[]
}

const MenuButton = (props: Props) => {
    const {
        action,
        classNames = []
    } = props

    return (
        <i 
            className={`material-icons common-btn ${classNames.join(' ')}`} 
            onClick={action}
        >menu</i>
    )
}

export default memo(MenuButton)