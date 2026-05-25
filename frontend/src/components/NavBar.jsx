import { Link } from "react-router-dom"

function NavBar() {
    return (
        <nav>
            <h2>ArguMind</h2>
            
            <div>
                <Link to="/">Home</Link>
                <Link to="/createArgument">Create Argument</Link>
                <Link to="/profile">Profile</Link>
                <Link to="/register">Register</Link>
                <Link to="/login">Log IN</Link>
            </div>
        </nav>
    );
}

export default NavBar;