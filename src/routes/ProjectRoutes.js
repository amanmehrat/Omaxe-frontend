import { Switch, Route, useRouteMatch } from "react-router-dom";

import Project from '../components/project/Project';
import AddProject from '../components/project/AddProject';


const ProjectRoutes = () => {
    let { path, url } = useRouteMatch();
    return (
        <Switch>
            <Route exact={true} path={`${path}/add`} component={AddProject} />
            <Route exact={true} path={`${path}/edit/:projectId`} component={AddProject} />
            <Route exact={true} path={`${path}/:projectId`} component={Project} />
        </Switch>
    );
};
export default ProjectRoutes;
