import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import AIChat from "./pages/AIChat.jsx";
import ClientDashboard from "./pages/ClientDashboard.jsx";

export default function App() {
    return (
        <BrowserRouter>
            <div className="min-h-screen font-sans bg-gray-50 dark:bg-black">
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/chat" element={<AIChat />} />
                    <Route path="/app" element={<ClientDashboard />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}
