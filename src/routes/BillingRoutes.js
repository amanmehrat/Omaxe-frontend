import { Switch, Route, useRouteMatch } from "react-router-dom";

import IfProjectSelected from "../components/IfProjectSelected";
import Billing from "../components/billing/Billling";
import GenerateBill from "../components/billing/GenerateBill";
import ViewBills from "../components/billing/ViewBills";
import Transactions from "../components/billing/Transactions";
import WaveOff from "../components/billing/WaveOff";

const BillingRoutes = () => {
    let { path } = useRouteMatch();
    return (
        <Switch>
            <IfProjectSelected>
                <Route exact={true} path={`${path}/billingheads`} component={Billing} />
                <Route exact={true} path={`${path}/generatebills`} component={GenerateBill} />
                <Route exact={true} path={`${path}/viewbills`} component={ViewBills} />
                <Route exact={true} path={`${path}/transactions`} component={Transactions} />
                <Route exact={true} path={`${path}/waveOff`} component={WaveOff} />
            </IfProjectSelected>
        </Switch>
    );
};
export default BillingRoutes;
