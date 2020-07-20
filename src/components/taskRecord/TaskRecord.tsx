import React, { useState } from 'react'
import './TaskRecord.scss'
import { ITask } from '../../types'
import { 
    useTasksContext, 
    moveTaskAction 
} from '../../contexts/TasksContext'

interface IProps { task: ITask }

const TaskRecord = ({ task }: IProps) => {
    const { isDone: initialState, data } = task

    const [ isDone, setIsDone ] = useState(initialState)

    const [, dispatch ] = useTasksContext()

    const handleMouseDownOnCheckbox = (e: any) => {
        setIsDone((prevState) => task.isDone = !prevState)
    }

    const handleMouseUpOnCheckbox = (e: any) => {     
        dispatch(moveTaskAction(task))
    }

    const debouncedInputHandler = () => {
        let timeout: any
        return (e: any) => {
            const text = e.target.textContent
            clearTimeout(timeout)
            timeout = setTimeout(() => task.data = text, 500)
        }
    }

    return (
        <div className="task-record" id={'task' + task.id}>
            <span
                onMouseDown={handleMouseDownOnCheckbox} 
                onMouseUp={handleMouseUpOnCheckbox}
            >
                {!isDone && <i className="material-icons check-mark">check_box_outline_blank</i>}
                {isDone && <i className="material-icons check-mark">check_box</i>}
            </span>
            <span 
                className={'task-content' + (isDone ? ' task-done' : '')} 
                contentEditable="true"
                suppressContentEditableWarning={true}
                onInput={debouncedInputHandler()}
            >
                {data}
            </span>
            <i className="material-icons delete-btn">clear</i>
        </div>
    )
}

export default TaskRecord