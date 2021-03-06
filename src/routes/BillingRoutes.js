import { Switch, Route, useRouteMatch } from "react-router-dom";

import IfProjectSelected from "../components/IfProjectSelected";
import Billing from "../components/billing/Billling";

const BillingRoutes = () => {
    let { path, url } = useRouteMatch();
    return (
        <Switch>
            <IfProjectSelected>
                <Route exact={true} path={`${path}/billingheads`} component={Billing} />
            </IfProjectSelected>
        </Switch>
    );
};
export default BillingRoutes;
