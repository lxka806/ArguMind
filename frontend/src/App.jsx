import NavBar from "./components/NavBar"
import { Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import CreateArgument from "./pages/CreatePost"
import Profile from "./pages/Profile"
import Register from "./pages/Register"
import Login from "./pages/LogIn"


function App() {
    return (
        <>
            <NavBar />

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/createArgument" element={<CreateArgument />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
            </Routes>
        </>
    )
}

export default App;