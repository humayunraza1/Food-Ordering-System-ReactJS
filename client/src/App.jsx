import { useEffect, useState } from "react";
import Home from "./pages/Home"
import Login from "./pages/Login";
import Register from "./pages/Register"
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { stepIconClasses } from "@mui/material";

function App() {
    const [isLoggedIn, setLoggedIn] = useState(false);

    return (
        <BrowserRouter>
            <Routes>
                <Route index element={<Home isLoggedIn={isLoggedIn} setLoggedIn={setLoggedIn} />} />
                <Route path="register" element={sessionStorage.length === 1 ? <Navigate to="/" /> : <Register />} />
                <Route path="login" element={sessionStorage.length === 1 ? <Navigate to="/" /> : <Login setLoggedIn={setLoggedIn} />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App
