import React, { 
    createContext, 
    useContext, 
    useReducer
} from "react"
import { 
    IContext, 
    IStore
} from '../types'
import { 
    createActions, 
    actionTypes 
} from '../contexts/actionCreators'

const TasksContext = createContext<any>(undefined)

export function TasksContextProvider({ children }: any) {
    const [ store, dispatch ] = useReducer(tasksReducer, {})

    const context: IContext = {
        store,
        actions: createActions(dispatch)
    }

    return (
      <TasksContext.Provider value={context}>
          {children}
      </TasksContext.Provider>
    )
  }

export const useTasksContext = (): IContext => useContext(TasksContext)

const tasksReducer = (state: IStore, action: any): IStore => {    
    switch (action.type) {
        case actionTypes.TRIGGER_CASCADING_UPDATE: {
            return { ...state }
        }
        case actionTypes.SET_MODAL: {
            return { ...state, modal: action.modal }
        }
        case actionTypes.SET_BANNER: {
            return { ...state, banner: action.banner }
        }
        case actionTypes.SET_SHOW_SIDEBAR: {
            return { ...state, showSidebar: action.value }
        }
        case actionTypes.SET_LOADING: {
            return { ...state, loading: action.value }
        }
        case actionTypes.SET_SYNC_STATUS: {
            return { ...state, syncStatus: action.status }
        }
        default:
            return state
    }
};
