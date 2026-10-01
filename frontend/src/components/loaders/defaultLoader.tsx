export function     DefaultLoader(){
        return (
            <div style={{ minHeight: "100vh", display: "flex", alignItems: "center",width:"100vw", justifyContent: "center", background: "#f9fafb" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                    <div style={{
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        border: "2px solid #e5e7eb",
                        borderTopColor: "#2563eb",
                        animation: "spin 0.7s linear infinite",
                    }} />
                    <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>Loading…</p>
                </div>
            </div>
        );
}