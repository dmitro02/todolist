import React, { useEffect, useState } from 'react'
import './MainContainer.scss'
import { useTasksContext } from '../../contexts/TasksContext'
import ProjectList from '../ProjectList/ProjectList'
import TaskList from '../TaskList/TaskList'
import Settings from '../Settings/Settings'
import Modal from '../Modal/Modal'
import Banner from '../Banner/Banner'
import { 
    ArrowBackButton, 
    EmptyButton, 
    MenuButton, 
    SettingsButton 
} from '../Buttons/Buttons'
import Divider from '../Divider/Divider'
import Fog from '../Fog/Fog'
import Loading from '../Statuses/Loading'
import Syncer from '../../utils/Syncer'
import SyncStatus from '../Statuses/SyncStatus'
import { Task } from '../../types'
import taskStore from '../../utils/taskStore'

const MainContainer = () => {
    const { 
        store : {
            showSidebar = false, 
            loading,
            syncStatus
        }, 
        actions 
    } = useTasksContext()

    const {       
        taskList: rootTask,
        taskList: {
            tasks: projectList
        }
    } = taskStore

    const [ isSettingsOpened, setIsSettingsOpened ] = useState(false)

    useEffect(() => {
        Syncer.getInstance(actions).initSync()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const toggleSettings = () =>
        setIsSettingsOpened(!isSettingsOpened)

    const openLeftPanel = () => {
        if (!showSidebar) {
            actions.setShowSidebar(true)
            enableBodyScrolling(false)
        }
    }

    const closeLeftPanel = () => {
        if (showSidebar) {
            actions.setShowSidebar(false)
            enableBodyScrolling(true)
        }
    }

    const selectedProject = projectList.length 
        ? projectList.find((task: Task) => task.id === rootTask.selectedSubTaskId) || projectList[0]
        : null

    return (
        <div className="main-container">   
            <Modal />
            {loading && <Loading />}
            <div className={`left-panel${showSidebar ? ' panel-opened' : ''}`}>
                <Fog isDisplayed={isSettingsOpened} />
                <div className="top-panel">
                    <div className="row-btns">
                        <ArrowBackButton 
                            action={closeLeftPanel} 
                            classNames={['close-menu-btn']} 
                            title="hide projects list"
                        />
                    </div>
                </div>
                <Divider />
                <ProjectList rootTask={rootTask}/>
            </div>
            <div className="right-panel" onClick={closeLeftPanel}>
                <Fog isDisplayed={showSidebar} />
                <Banner />
                <div className="top-panel">
                    {!isSettingsOpened &&
                        <div className="row-btns">
                            <MenuButton 
                                action={openLeftPanel} 
                                classNames={['open-menu-btn']}
                                title="open projects list"
                            />
                        </div>
                    }
                    <div className="row-btns">
                        <SyncStatus status={syncStatus} />
                        {isSettingsOpened 
                            ? <ArrowBackButton action={toggleSettings} title="close settings" />
                            : <SettingsButton action={toggleSettings} />
                        }
                        <EmptyButton />
                    </div>
                </div>
                <Divider />
                <div className="right-content">
                    {isSettingsOpened 
                        ? <Settings backToTaskList={toggleSettings} />
                        : <TaskList rootTask={selectedProject} />
                    }
                </div>
            </div>
        </div>
    )
}

const enableBodyScrolling = (isEnabled: boolean) =>
    document.body.style.overflow = isEnabled? 'auto' : 'hidden'

export default MainContainer