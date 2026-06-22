import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";
import DashboardPage from "./pages/DashboardPage";
import CreatePersonaPage from "./pages/CreatePersonaPage";
import ChatPage from "./pages/ChatPage";

// ============================================================
//  PERSONAVERSE — App.jsx
//
//  Yeh file poori app ka routing handle karti hai.
//  Har URL pe kaunsa page dikhega — yahan decide hota hai.
//
//  Routes:
//    /           → HomePage     (landing page)
//    /auth       → AuthPage     (login + signup)
//    /dashboard  → DashboardPage
//    /create     → CreatePersonaPage
//    /chat/:id   → ChatPage     (:id = persona ka number)
//    /*          → HomePage     (koi bhi galat URL)
// ============================================================

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Landing page */}
        <Route path="/" element={<HomePage />} />

        {/* Login + Signup — dono ek hi page pe */}
        <Route path="/auth" element={<AuthPage />} />

        {/* Dashboard — login ke baad */}
        <Route path="/dashboard" element={<DashboardPage />} />

        {/* Create new persona */}
        <Route path="/create" element={<CreatePersonaPage />} />

        {/* Chat with a persona — id URL se aata hai */}
        <Route path="/chat/:id" element={<ChatPage />} />

        {/* Koi bhi unknown URL → home page */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}