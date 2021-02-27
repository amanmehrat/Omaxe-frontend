import React, { useState, createContext, useContext } from 'react'
import { Redirect } from "react-router-dom";

const redirectToProjectsRoute = () => <Redirect to="/Projects" />;

const ProjectContext = createContext()
const ProjectActionsContext = createContext()

/* eslint-disable */
const useContextFactory = (name, context) => {
    return () => {
        const ctx = useContext(context)
        if (ctx === undefined) {
            throw new Error(`use${name}Context must be used withing a ${name}ContextProvider.`)
        }
        return ctx
    }
}
export const useProjectContext = useContextFactory('ProjectContext', ProjectContext)
export const useProjectActionsContext = useContextFactory('ProjectActionsContext', ProjectActionsContext)
/* eslint-enable */

const ProjectContextProvider = (props) => {
    const [selectedProjectId, setSelectedProjectId] = useState(null)

    return (
        <ProjectContext.Provider value={{ selectedProjectId, redirectToProjectsRoute }}>
            <ProjectActionsContext.Provider value={setSelectedProjectId}>
                {props.children}
            </ProjectActionsContext.Provider>
        </ProjectContext.Provider>
    )
}

export default ProjectContextProvider;

