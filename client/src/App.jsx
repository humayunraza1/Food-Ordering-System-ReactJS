import Home from "./pages/Home"
import Login from "./pages/Login";
import Register from "./pages/Register"
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import UserManagement from "./pages/UserManagement";
import RestaurantLogin from "./pages/RestaurantLogin";
import RestaurantManagement from "./pages/RestaurantManagement";

function App() {

    return (
        <BrowserRouter>
            <Routes>
                <Route index element={<Home />} />
                <Route path="register" element={sessionStorage.getItem('authToken') !== null ? <Navigate to="/" /> : <Register />} />
                <Route path="login" element={sessionStorage.getItem('authToken') !== null ? <Navigate to="/" /> : <Login />} />
                <Route path="users/dashboard" element={sessionStorage.getItem('authToken') !== null ? <UserManagement /> : <Navigate to="/login" />} />
                <Route path="restaurant/dashboard" element={sessionStorage.getItem('restToken') !== null ? <RestaurantManagement /> : <Navigate to="/restaurant/login" />} />
                <Route path="restaurant/login" element={sessionStorage.getItem('restToken') === null ? <RestaurantLogin /> : <Navigate to="/restaurant/dashboard" />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App
