import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import 'bootstrap/dist/css/bootstrap.min.css';
import Layout from "./Pages/Layout";
import Home from "./Pages/Home";
import About from "./Pages/About";
import Task from "./Pages/Task";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Logout from "./Pages/Logout";
import NotFound from "./Pages/NotFound";
import TaskDetails from "./Pages/TaskDetails";
import TaskUpdate from "./Pages/TaskUpdate";
import TaskAdd from "./Pages/TaskAdd";
import ForgetPassword from "./Pages/ForgetPassword";
import ResetPassword from "./Pages/ResetPassword";
import ChangePassword from "./Pages/ChangePassword";

function App() {
  let userInfo = useSelector((state) => { return state.auth.userInfo })

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="task" element={userInfo ? <Task /> : <Navigate to="/login" />} />
            <Route path="task/add" element={userInfo ? <TaskAdd /> : <Navigate to="/login" />} />
            <Route path="task/:id" element={userInfo ? <TaskDetails /> : <Navigate to="/login" />} />
            <Route path="task/update/:id" element={userInfo ? <TaskUpdate /> : <Navigate to="/login" />} />
            <Route path="login" element={userInfo ? <Navigate to="/task" /> : <Login />} />
            <Route path="register" element={userInfo ? <Navigate to="/task" /> : <Register />} />
            <Route path="forgetPassword" element={!userInfo ? <ForgetPassword />: <Navigate to="/login" /> } />
            <Route path="changePassword" element={userInfo ? <ChangePassword />: <Navigate to="/login" /> } />
            <Route path="resetPassword" element={!userInfo ? <ResetPassword />: <Navigate to="/login" /> } />
            <Route path="logout" element={userInfo ? <Logout /> : <Navigate to="/login" />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
