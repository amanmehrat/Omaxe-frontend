import { Switch, Route, useRouteMatch } from "react-router-dom";

import IfProjectSelected from "../components/IfProjectSelected";
import Billing from "../components/billing/Billling";
import GenerateBill from "../components/billing/GenerateBill";
import ViewBills from "../components/billing/ViewBills";
import Transactions from "../components/billing/Transactions";

const BillingRoutes = () => {
    let { path, url } = useRouteMatch();
    return (
        <Switch>
            <IfProjectSelected>
                <Route exact={true} path={`${path}/billingheads`} component={Billing} />
                <Route exact={true} path={`${path}/generatebill`} component={GenerateBill} />
                <Route exact={true} path={`${path}/viewbills`} component={ViewBills} />
                <Route exact={true} path={`${path}/transactions`} component={Transactions} />
            </IfProjectSelected>
        </Switch>
    );
};
export default BillingRoutes;
