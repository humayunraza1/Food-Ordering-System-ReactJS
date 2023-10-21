import Home from "./pages/Home"
import Login from "./pages/Login";
import Register from "./pages/Register"
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route index element={<Home />} />
                <Route path="register" element={<Register />} />
                <Route path="login" element={<Login />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App
