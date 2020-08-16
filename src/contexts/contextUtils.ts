import { IStore } from './TasksContext';
import { ITask } from './../types';

export const PATH_SEPARATOR = '.' 

export const createItem = (state: IStore, createdItem: ITask) =>
    updateItemChain(state, createdItem, createArrayItem)

export const updateItem = (state: IStore, updatedItem: ITask) =>
    updateItemChain(state, updatedItem, updateArrayItem) 

export const deleteItem = (state: IStore, deletedItem: ITask) =>
    updateItemChain(state, deletedItem, deleteArrayItem)

export const moveItem = (state: IStore, movedItemPath: string, siblingPath: string) => {
    const movedItem = getItemByPath(state.rootProject, movedItemPath)
    return updateItemChain(state, movedItem, 
        (a: ITask[], b: ITask) => moveArrayItem(a, b, siblingPath))
}

export const initPaths = (root: any) => {
    root.path = '0'
    return initPathsRecursively(root)
}

const createArrayItem = (array: ITask[], createdItem: ITask) =>
    array.concat(createdItem)

const updateArrayItem = (array: ITask[], updatedItem: ITask) => 
    array.map(item => item.path !== updatedItem.path ? item : updatedItem)

const deleteArrayItem = (array: ITask[], deletedItem: ITask) => 
    array.filter(item => item.path !== deletedItem.path)

const moveArrayItem = (array: ITask[], movedItem: ITask, siblingPath: string) => {
    const newArray = array.filter((it: ITask) => it !== movedItem)
    const movedItemNewIndex = siblingPath
        ? newArray.findIndex((it: ITask) => it.path === siblingPath) + 1
        : 0
    newArray.splice(movedItemNewIndex, 0, movedItem!)
    return newArray
}

const updateItemChain = (state: IStore, updatedItem: ITask, whatToDo: Function) => {
    const itemChain = getItemChain(state.rootProject, updatedItem)
    return {
        ...state,
        rootProject: updateChain(itemChain, whatToDo)
    }
}

const updateChain = (chain: ITask[], whatToDo: Function) => {
    return chain.reduce((prev: ITask, curr: ITask, index: number) => ({
        ...curr,
        tasks: index === 1
            ? whatToDo(curr.tasks, prev)
            : updateArrayItem(curr.tasks, prev)
    }))
}

const getItemByPath = (root: ITask, path: string) => {
    let item = root
    pathToArray(path).forEach((path: string, index: number) => {
        item = index === 0 
            ? item 
            : item.tasks.find(it => it.path === addToPath(item.path, path))!
    })
    return item
}

const getItemChain = (root: ITask, updatedItem: ITask): ITask[] => {
    const pathArr = pathToArray(updatedItem.path)
    return pathArr.map((path: string, index: number) => {
        if (index === 0) return root 
        if (index === pathArr.length - 1) return updatedItem
        return root = root.tasks.find(it => it.path === addToPath(root.path, path))!
    }).reverse()
}

const initPathsRecursively = (root: any) => {
    root.tasks.forEach((item: any, index: number) => {
        item.path = addToPath(root.path, index)
        initPathsRecursively(item)
    })
    return root
}

export const constructNewPath = (root: ITask) => {
    const { path, tasks } = root
    return tasks.length 
        ? addToPath(path, tasks
            .map((t) => parseInt(pathToArray(t.path).reverse()[0]))
            .reduce((prev, curr) => Math.max(prev, curr)) + 1)
        : addToPath(path, '0')
}

export const isTopLevelItem = (item: ITask): boolean => 
    pathToArray(item.path).length === 2

export const pathToArray = (path: string) => 
    path.split(PATH_SEPARATOR)

export const addToPath = (path: string, addition: string | number) =>
    path + PATH_SEPARATOR + addition