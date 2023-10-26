import Home from "./pages/Home"
import Login from "./pages/Login";
import Register from "./pages/Register"
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import UserManagement from "./pages/UserManagement";
function App() {

    return (
        <BrowserRouter>
            <Routes>
                <Route index element={<Home />} />
                <Route path="register" element={sessionStorage.length === 1 ? <Navigate to="/" /> : <Register />} />
                <Route path="login" element={sessionStorage.length === 1 ? <Navigate to="/" /> : <Login />} />
                <Route path="users/dashboard" element={sessionStorage.length > 0 ? <UserManagement /> : <Navigate to="/login" />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App
