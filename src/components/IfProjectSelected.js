import { useProjectContext } from "./contexts/Project";

const IfProjectSelected = ({ children }) => {
    const { selectedProjectId, redirectToProjectsRoute } = useProjectContext();
    if (!selectedProjectId) return redirectToProjectsRoute();
    else return children;
};

export default IfProjectSelected;
