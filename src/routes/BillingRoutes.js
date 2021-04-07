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
                <Route exact={true} path={`${path}/BillingHeads`} component={Billing} />
                <Route exact={true} path={`${path}/GenerateBills`} component={GenerateBill} />
                <Route exact={true} path={`${path}/ViewBills`} component={ViewBills} />
                <Route exact={true} path={`${path}/Transactions`} component={Transactions} />
                <Route exact={true} path={`${path}/UpdateReadings`} component={ViewBills} />
                <Route exact={true} path={`${path}/WaveOff`} component={WaveOff} />
            </IfProjectSelected>
        </Switch>
    );
};
export default BillingRoutes;
