import { useMemo, useState } from "react";
import Post from "../components/Post";
import { TrendingUp, Flame, Clock } from "lucide-react";

function Home() {
    const [tab, setTab] = useState("latest");

    return (
        <div className="min-h-screen bg-[#0F1117] text-[#E6E8EB]">

            {/* HEADER */}
            <div className="border-b border-[#2A2E39] px-6 py-5 bg-[#1A1D24]/30">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] bg-clip-text text-transparent">
                    Debate Feed
                </h1>

                <p className="text-sm text-gray-400 mt-1">
                    Explore arguments, challenge ideas, sharpen minds.
                </p>

                {/* TABS */}
            </div>

            {/* FEED */}
            <div className="flex justify-center px-4 py-6">
                <div className="w-full max-w-3xl">

                    <Post sortType={tab} />

                </div>
            </div>
        </div>
    );
}

export default Home;