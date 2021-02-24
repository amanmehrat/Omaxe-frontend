//#region Modules

//#region 3rd party app
import React from "react";
import { Switch, Route } from "react-router-dom";

//#endregion

//#region Inbuilt
import "../App.scss";
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import AddProject from '../components/project/AddProject';
import Project from '../components/project/Project';

import IfAuth from "../components/IfAuth";
import LeftNav from "./dashboard/LeftNav";
import SideNav from "./dashboard/SideNav";
import MyTeam from "./myTeam/myTeam";
import Projects from "./project/project";
import ProjectById from "./project/projectById";
//import AddProject from "./project/AddProject";
import FlatById from "./flat/flatById";
//#endregion

//#endregion

const Dashboard = () => {
  return (
    <IfAuth>
      <div className="container">
        <Navbar />
        <div className={"content"}>
          <Sidebar />
          <Switch>
            <Route exact={true} path="/" component={Project} />

            <Route exact={true} path="/projects" component={Projects} />
            <Route exact={true} path="/AddProject" component={AddProject} />
            <Route exact={true} path="/AddProject/:projectId" component={AddProject} />
            <Route exact={true} path="/Project/:projectId" component={Project} />

            <Route exact={true} path="/flat" component={FlatById} />
            <Route exact={true} path="/flat/:flatId" component={FlatById} />
            <Route exact={true} path="/users" component={MyTeam} />
          </Switch>
        </div>
      </div>
    </IfAuth>
  );
};

export default Dashboard;
