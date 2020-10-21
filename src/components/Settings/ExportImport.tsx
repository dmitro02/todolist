import React, { useRef } from 'react'
import { useTasksContext } from '../../contexts/TasksContext'
import { 
    setAppData, 
    setModal, 
    setBanner 
} from '../../contexts/actionCreators'
import { BannerTypes, IBanner, IModal } from '../../types'

type Props = {
    backToTaskList(): void
}

const ExportImport = (props: Props) => {
    const [ store, dispatch ] = useTasksContext()

    const { backToTaskList } = props

    const fileInputRef = useRef<HTMLInputElement>(null)

    const excludeKeys = [
        'path',
        'selectedSubTaskPath'
    ]

    const replacer = (key: string, value: any) =>
        excludeKeys.includes(key) ? undefined : value

    const exportData = () => {
        const storedData = JSON.stringify(store.rootProject, replacer, 2)
        const dataToExport = 'data:text/json;charset=utf-8,' + storedData
        const encodedUri = encodeURI(dataToExport)
        const timestamp = new Date().toISOString()
        const link = document.createElement('a')
        link.setAttribute('href', encodedUri)
        link.setAttribute('download', `todolist_export_${timestamp}.json`);
        link.click();
    }

    const importData = (e: React.ChangeEvent<HTMLInputElement>) => {
        const reader = new FileReader()
        reader.onload = () => {
            const modal: IModal = {
                text: 'Do you want to overwrite existing data?',
                okAction: () => doImport(reader),
                cancelAction: () => clearFileInput()
            }
            dispatch(setModal(modal))
        };
        const files = e.target.files
        files && reader.readAsText(files[0])
    }

    const doImport = (reader: FileReader) => {
        clearFileInput()
        let dataToImport
        try {
            dataToImport = JSON.parse(reader.result as string)
        } catch(err) {
            const banner: IBanner = {
                text: 'Failed to parse JSON file',
                type: BannerTypes.Failure
            }
            dispatch(setBanner(banner))
            return
        }
        if (!validateExportedData(dataToImport)) {
            const banner: IBanner = {
                text: 'Some required fields are missing',
                type: BannerTypes.Failure
            }
            dispatch(setBanner(banner))
            return
        }
        dispatch(setAppData(dataToImport))
        backToTaskList()
        const banner: IBanner = {
            text: 'Data successfully imported',
            type: BannerTypes.Success,
            delay: 5
        }
        dispatch(setBanner(banner))
    }

    const clickOnFileInput = () => {
        const node = fileInputRef.current!
        node.click()
    }

    const clearFileInput = () => {
        const node = fileInputRef.current!
        node.value = ''
    }

    return (
        <>
            <h2>Import/Export your data</h2>
            <input type="file" onChange={importData} ref={fileInputRef}/>
            <button onClick={clickOnFileInput}>Import</button>
            <button onClick={exportData}>Export</button>
        </>
    )
}

type ExportedData = {
    text: string
    isDone: boolean
    tasks: ExportedData[]
}

const isExportedData = (data: any): data is ExportedData => {
    const dAs = data as ExportedData
    return dAs.text !== undefined 
            && dAs.isDone !== undefined 
            && dAs.tasks !== undefined
}

const validateExportedData = (data: any): boolean => {
    if (!isExportedData(data)) return false
    for (let task of data.tasks) {
        if(!validateExportedData(task)) return false;
    }
    return true
} 

export default ExportImport