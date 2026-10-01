import { useNavigate } from "react-router-dom"
import { supabase } from "../utils/supabaseClient"
import { useEffect, useState } from "react";
import { Logout } from "../services/supaAuth";

export default function UserHeader() {
    const navigate = useNavigate()
    const [email, setEmail] = useState("");

    useEffect(() => {
        async function getUserEmail() {
            const { data: { user } } = await supabase.auth.getUser();
            setEmail(user?.email ?? "");
        }
        getUserEmail();
    }, []);

    const initials = email ? email[0].toUpperCase() : "U";

    return (
        <header style={{
            position: "sticky",
            top: 0,
            zIndex: 50,
            width: "100%",
            background: "#ffffff",
            borderBottom: "1px solid #e5e7eb",
        }}>
            <div style={{
                width: "100%",
                padding: "0 28px",
                height: 56,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
            }}>
                <span></span>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <button
                        onClick={() => navigate("/history")}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            padding: "6px 12px",
                            fontSize: 13,
                            fontWeight: 500,
                            color: "#374151",
                            background: "transparent",
                            border: "1px solid #e5e7eb",
                            borderRadius: 7,
                            cursor: "pointer",
                            transition: "background 0.15s",
                        }}
                        onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = "#f9fafb"}
                        onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = "transparent"}
                    >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 12a9 9 0 1 0 3-6.7" /><polyline points="3 4 3 10 9 10" /><path d="M12 7v5l3 2" />
                        </svg>
                        History
                    </button>

                    {/* Divider */}
                    <div style={{ width: 1, height: 20, background: "#e5e7eb", margin: "0 4px" }} />

                    {/* User */}
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{
                            width: 30,
                            height: 30,
                            borderRadius: "50%",
                            background: "#2563eb",
                            color: "#fff",
                            fontSize: 12,
                            fontWeight: 600,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                        }}>
                            {initials}
                        </div>
                        <span style={{
                            fontSize: 13,
                            color: "#374151",
                            fontWeight: 500,
                            maxWidth: 160,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                        }}>
                            {email || "—"}
                        </span>
                    </div>

                    {/* Divider */}
                    <div style={{ width: 1, height: 20, background: "#e5e7eb", margin: "0 4px" }} />

                    <button
                        title="Sign out"
                        onClick={() => { Logout(); navigate("/"); }}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 5,
                            padding: "6px 10px",
                            fontSize: 13,
                            fontWeight: 500,
                            color: "#6b7280",
                            background: "transparent",
                            border: "none",
                            borderRadius: 7,
                            cursor: "pointer",
                            transition: "color 0.15s, background 0.15s",
                        }}
                        onMouseEnter={e => {
                            (e.currentTarget as HTMLButtonElement).style.color = "#dc2626";
                            (e.currentTarget as HTMLButtonElement).style.background = "#fef2f2";
                        }}
                        onMouseLeave={e => {
                            (e.currentTarget as HTMLButtonElement).style.color = "#6b7280";
                            (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                        }}
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                            <polyline points="16 17 21 12 16 7" />
                            <line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                        Sign out
                    </button>
                </div>
            </div>
        </header>
    )
}