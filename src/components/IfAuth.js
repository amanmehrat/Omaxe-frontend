import { useContext } from "react";

import AuthContext from "./contexts/Auth";

const IfAuth = ({ children }) => {
  const { token, redirectToPublicRoute } = useContext(AuthContext);

  if (!token) return redirectToPublicRoute();
  else return children;
};

export default IfAuth;
