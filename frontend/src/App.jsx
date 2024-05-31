import CssBaseline from "@mui/material/CssBaseline";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignUp from "./components/auth/SignUp";
import SignIn from "./components/auth/SignIn";
import Layout from "./components/shared/Layout";
import PersistLogin from "./components/auth/PersistLogin";
import RequireAuth from "./components/auth/RequireAuth";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Dashboard from "./components/dashboard/Dashboard";
import Budgets from "./components/budget/Budgets";

const App = () => {
  return (
    <>
      {" "}
      <BrowserRouter>
        <CssBaseline />
        <ToastContainer />
        <Routes>
          <Route path="/" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />

          <Route element={<PersistLogin />}>
            <Route element={<RequireAuth />}>
              <Route element={<Layout />}>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="budgets" element={<Budgets />} />
              </Route>
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
