import { Switch, Route, useRouteMatch } from "react-router-dom";

import IfProjectSelected from "../components/IfProjectSelected";
import AddFlat from "../components/flat/AddFlat";

const FlatRoutes = () => {
    let { path, url } = useRouteMatch();
    return (
        <Switch>
            <IfProjectSelected>
                <Route exact={true} path={`${path}/add`} component={AddFlat} />
                <Route exact={true} path={`${path}/edit/:flatId`} component={AddFlat} />
            </IfProjectSelected>
        </Switch>
    );
};
export default FlatRoutes;
