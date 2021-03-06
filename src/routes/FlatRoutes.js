import { Switch, Route, useRouteMatch } from "react-router-dom";

import IfProjectSelected from "../components/IfProjectSelected";
import flatById from "../pages/flat/flatById";
import AddFlat from "../components/flat/AddFlat";
import Flat from "../components/flat/Flat";
import NotFound from '../components/NotFound';

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
