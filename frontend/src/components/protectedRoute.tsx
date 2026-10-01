import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../utils/supabaseClient";
import type { Session } from "@supabase/supabase-js";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function getSession() {
            const { data, error } = await supabase.auth.getSession();

            if (error) {
                console.error("Error getting session:", error);
            }

            setSession(data.session);
            setLoading(false);
        }

        getSession();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center bg-zinc-50">
                <div className="flex flex-col items-center gap-4">
                    <div
                        className="
                            w-10 h-10
                            border-4 border-zinc-200
                            border-t-blue-600
                            rounded-full
                            animate-spin
                        "
                    />

                    <p className="text-sm font-medium text-zinc-500">
                        Loading ...
                    </p>
                </div>
            </div>
        );
    }

    if (!session) {
        return <Navigate to="/" replace />;
    }

    return children;
}