import { Switch, Route, useRouteMatch } from "react-router-dom";

import IfProjectSelected from "../components/IfProjectSelected";
import Billing from "../components/billing/Billling";
import GenerateBill from "../components/billing/GenerateBill";

const BillingRoutes = () => {
    let { path, url } = useRouteMatch();
    return (
        <Switch>
            <IfProjectSelected>
                <Route exact={true} path={`${path}/billingheads`} component={Billing} />
                <Route exact={true} path={`${path}/generatebill`} component={GenerateBill} />
            </IfProjectSelected>
        </Switch>
    );
};
export default BillingRoutes;
