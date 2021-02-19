//#region Modules

//#region 3rd party app
import React from "react";
import { Switch, Route } from "react-router-dom";

//#endregion

//#region Inbuilt
import "../App.scss";
import IfAuth from "../components/IfAuth";
import NavBar from "./dashboard/NavBar";
import SideNav from "./dashboard/SideNav";
import MyTeam from "./myTeam/myTeam";
import Project from "./project/project";
import ProjectById from "./project/projectById";
import FlatById from "./flat/flatById";
//#endregion

//#endregion

const Dashboard = () => {
  return (
    <IfAuth>
      <div className="container">
        <NavBar />
        <div className={"content"}>
          <SideNav />
          <Switch>
            <Route exact={true} path="/" component={Project} />
            <Route exact={true} path="/project" component={Project} />
            <Route exact={true} path="/project/:projectId" component={ProjectById} />
            <Route exact={true} path="/flat" component={FlatById} />
            <Route exact={true} path="/flat/:flatId" component={FlatById} />
            <Route exact={true} path="/team" component={MyTeam} />
          </Switch>
        </div>
      </div>
    </IfAuth>
  );
};

export default Dashboard;
