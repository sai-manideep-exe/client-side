import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import AIChat from "./pages/AIChat.jsx";
import ClientDashboard from "./pages/ClientDashboard.jsx";

export default function App() {
    return (
        <BrowserRouter>
            <div className="bg-[#1a1a1a] min-h-screen flex items-center justify-center p-0 md:p-8 font-sans">
                <div className="w-full max-w-sm h-[100dvh] md:h-[850px] bg-black md:rounded-[2.5rem] relative overflow-hidden shadow-2xl border-4 border-black ring-8 ring-gray-800/50">
                    {/* iPhone notch (desktop only) */}
                    <div className="hidden md:block absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-black rounded-b-2xl z-50" />
                    <div className="h-full overflow-y-auto no-scrollbar relative">
                        <Routes>
                            <Route path="/" element={<Login />} />
                            <Route path="/chat" element={<AIChat />} />
                            <Route path="/app" element={<ClientDashboard />} />
                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                    </div>
                    {/* Home indicator */}
                    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/20 rounded-full z-50 pointer-events-none" />
                </div>
            </div>
        </BrowserRouter>
    );
}
