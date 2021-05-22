import { Switch, Route } from "react-router-dom";

import "../App.scss";

import Navbar from './Navbar';
import Sidebar from './Sidebar';
import IfAuth from "./IfAuth";
import NotFound from "./NotFound";

import Users from "./user/Users";
import DownloadReport from "./report/DownloadReport";
import Projects from "./project/Projects";

import FlatRoutes from '../routes/FlatRoutes';
import ProjectRoutes from '../routes/ProjectRoutes';
import BillingRoutes from '../routes/BillingRoutes';

import ProjectContextProvider from '../components/contexts/Project';
import Flat from '../components/flat/Flat';

const Dashboard = () => {
  return (
    <IfAuth>
      <div className="container">
        <Navbar />
        <div className={"content"}>
          <ProjectContextProvider>
            <Sidebar />
            <Switch>
              <Route exact={true} path="/report" component={DownloadReport} />
              <Route exact={true} path="/" component={DownloadReport} />
              <Route exact={true} path="/projects" component={Projects} />
              <Route exact={true} path="/users" component={Users} />
              <Route exact={true} path="/flats/:flatId" component={Flat} />
              <Route path="/project" component={ProjectRoutes} />
              <Route path="/flat" component={FlatRoutes} />
              <Route path="/billing" component={BillingRoutes} />
              <Route component={NotFound} />
            </Switch>
          </ProjectContextProvider>
        </div>
      </div>
    </IfAuth>
  );
};
export default Dashboard;
