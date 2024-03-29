import { Switch, Route, useRouteMatch } from "react-router-dom";

import IfProjectSelected from "../components/IfProjectSelected";
import Billing from "../components/billing/Billling";
import GenerateBill from "../components/billing/GenerateBill";
import ViewBills from "../components/billing/ViewBills";
import Transactions from "../components/billing/Transactions";
import UploadReadings from "../components/billing/UploadReadings";
import WaveOff from "../components/billing/WaveOff";
import ChequeBounce from "../components/billing/ChequeBounce";

const BillingRoutes = () => {
    let { path } = useRouteMatch();
    return (
        <Switch>
            <IfProjectSelected>
                <Route exact={true} path={`${path}/BillingHeads`} component={Billing} />
                <Route exact={true} path={`${path}/GenerateBills`} component={GenerateBill} />
                <Route exact={true} path={`${path}/ViewBills`} component={ViewBills} />
                <Route exact={true} path={`${path}/Transactions`} component={Transactions} />
                <Route exact={true} path={`${path}/UpdateReadings`} component={UploadReadings} />
                <Route exact={true} path={`${path}/WaveOff`} component={WaveOff} />
                <Route exact={true} path={`${path}/ChequeBounce`} component={ChequeBounce} />
            </IfProjectSelected>
        </Switch>
    );
};
export default BillingRoutes;
