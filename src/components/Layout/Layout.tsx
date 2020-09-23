import React, { useState } from 'react'
import './Layout.scss'
import { TasksContextProvider } from '../../contexts/TasksContext'
import ProjectList from '../ProjectList/ProjectList'
import TaskList from '../TaskList/TaskList'
import Divider from '../Divider/Divider'
import Settings from '../Settings/Settings'
import Modal from '../Modal/Modal'
import Banner from '../Banner/Banner'

const Layout = () => {
    const [ isSettingsOpened, setIsSettingsOpened ] = useState(false)

    const toggleSettings = () => {
        setIsSettingsOpened(!isSettingsOpened)
    }

    return (
        <div className="main-container">   
            <TasksContextProvider>
                <Modal />
                <div className="left-panel">
                    <ProjectList />
                    <Divider />
                    <div className="menu">
                        <div className="menu-item" onClick={toggleSettings}>
                            <i className="material-icons-outlined">settings</i>
                            <span>Settings</span>
                        </div>
                    </div>
                </div>
                <div className="right-panel">
                    <Banner />
                    <div className="right-content">
                        {isSettingsOpened 
                            ? <Settings backToTaskList={toggleSettings}/>
                            : <TaskList />
                        }
                    </div>
                </div>
            </TasksContextProvider>
        </div>
    )
}

export default Layout