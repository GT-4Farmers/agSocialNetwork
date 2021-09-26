import { createContext } from "react";

const AuthContext = createContext({ isLoggedIn: false, user: "" });

export default AuthContext;