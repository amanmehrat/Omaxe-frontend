import { Switch, Route, useRouteMatch } from "react-router-dom";

import "../App.scss";

import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import IfAuth from "../components/IfAuth";
import NotFound from "../components/NotFound";
import MyTeam from "./myTeam/myTeam";
import Projects from "./project/project";

import FlatRoutes from '../routes/FlatRoutes';
import ProjectRoutes from '../routes/ProjectRoutes';
import BillingRoutes from '../routes/BillingRoutes';

import ProjectContextProvider from '../components/contexts/Project';
import Flat from '../components/flat/Flat';

const Dashboard = () => {
  let { path, url } = useRouteMatch();

  return (
    <IfAuth>
      <div className="container">
        <Navbar />
        <div className={"content"}>
          <ProjectContextProvider>
            <Sidebar />
            <Switch>
              <Route exact={true} path="/" component={Projects} />
              <Route exact={true} path="/projects" component={Projects} />
              <Route exact={true} path="/users" component={MyTeam} />
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
