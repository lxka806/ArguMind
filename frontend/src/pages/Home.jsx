import Post from "../components/Post"
import { Link } from "react-router-dom"

function Home() {
    const currentUser = JSON.parse(localStorage.getItem("user"))
    
    return (
        <>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-[#6366F1] to-[#4D8BFF] bg-clip-text text-transparent">
                    Latest Arguments
                </h1>
                {currentUser && (
                    <Link to="/createArgument">
                        <button className="bg-[#6366F1] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#6366F1]/90 transition-all">
                            + New Argument
                        </button>
                    </Link>
                )}
            </div>
            <Post />
        </>
    );
}

export default Home;