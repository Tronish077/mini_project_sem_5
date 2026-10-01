import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
    Cell,
} from "recharts";

type UrgencyChartProps = {
    urgency: {
        high: number;
        medium: number;
        low: number;
    };
};

const URGENCY_CONFIG = [
    { name: "High",   color: "#f43f5e", bg: "rgba(244,63,94,0.08)",  glow: "rgba(244,63,94,0.3)" },
    { name: "Medium", color: "#f59e0b", bg: "rgba(245,158,11,0.08)", glow: "rgba(245,158,11,0.3)" },
    { name: "Low",    color: "#10b981", bg: "rgba(16,185,129,0.08)", glow: "rgba(16,185,129,0.3)" },
];

function UrgencyTooltip({ active, payload, label }: any) {
    if (!active || !payload?.length) return null;
    const cfg = URGENCY_CONFIG.find((c) => c.name === label);
    return (
        <div
            style={{
                background: "rgba(15,23,42,0.92)",
                border: `1px solid ${cfg?.color ?? "#fff"}44`,
                borderRadius: 12,
                padding: "10px 16px",
                backdropFilter: "blur(8px)",
                boxShadow: `0 8px 32px ${cfg?.glow ?? "rgba(0,0,0,0.2)"}`,
            }}
        >
            <p style={{ color: cfg?.color ?? "#e2e8f0", fontWeight: 700, fontSize: 12, marginBottom: 2 }}>{label} Urgency</p>
            <p style={{ color: "#e2e8f0", fontSize: 13 }}>
                <strong style={{ fontSize: 18 }}>{payload[0].value}</strong> reviews
            </p>
        </div>
    );
}

function UrgencyChart({ urgency }: UrgencyChartProps) {
    const data = [
        { name: "High",   value: urgency.high },
        { name: "Medium", value: urgency.medium },
        { name: "Low",    value: urgency.low },
    ];

    return (
        <div
            style={{
                width: "100%",
                height: "100%",
                borderRadius: 16,
                background: "linear-gradient(145deg, #ffffff 0%, #fff8f8 100%)",
                padding: "20px 20px 12px",
                boxShadow: "0 4px 24px rgba(244,63,94,0.07), 0 1px 4px rgba(0,0,0,0.05)",
                border: "1px solid rgba(244,63,94,0.10)",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <div style={{ marginBottom: 4 }}>
                <span
                    style={{
                        fontSize: 10,
                        fontWeight: 700,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: "#f43f5e",
                        background: "rgba(244,63,94,0.08)",
                        padding: "2px 8px",
                        borderRadius: 100,
                    }}
                >
                    Urgency
                </span>
            </div>
            <h2
                style={{
                    fontFamily: "'Space Grotesk', system-ui, sans-serif",
                    fontWeight: 700,
                    fontSize: 17,
                    color: "#0f172a",
                    marginTop: 6,
                    marginBottom: 0,
                    letterSpacing: "-0.02em",
                }}
            >
                Urgency Distribution
            </h2>

            <ResponsiveContainer width="100%" style={{ flex: 1, marginTop: 16 }}>
                <BarChart data={data} barCategoryGap="35%" margin={{ top: 6, right: 10, bottom: 0, left: -10 }}>
                    <defs>
                        {URGENCY_CONFIG.map((cfg) => (
                            <linearGradient key={cfg.name} id={`urg-grad-${cfg.name}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor={cfg.color} stopOpacity={1} />
                                <stop offset="100%" stopColor={cfg.color} stopOpacity={0.45} />
                            </linearGradient>
                        ))}
                    </defs>
                    <CartesianGrid vertical={false} stroke="rgba(148,163,184,0.15)" />
                    <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={({ x, y, payload }) => {
                            const cfg = URGENCY_CONFIG.find((c) => c.name === payload.value);
                            return (
                                <g transform={`translate(${x},${y})`}>
                                    <text
                                        x={0}
                                        y={0}
                                        dy={14}
                                        textAnchor="middle"
                                        fill={cfg?.color ?? "#64748b"}
                                        fontSize={12}
                                        fontWeight={600}
                                    >
                                        {payload.value}
                                    </text>
                                </g>
                            );
                        }}
                    />
                    <YAxis
                        allowDecimals={false}
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#94a3b8", fontSize: 11 }}
                        width={28}
                    />
                    <Tooltip content={<UrgencyTooltip />} cursor={{ fill: "rgba(244,63,94,0.05)", radius: 6 }} />
                    <Bar dataKey="value" name="Reviews" radius={[6, 6, 0, 0]} animationBegin={0} animationDuration={700}>
                        {data.map((entry) => {
                            const cfg = URGENCY_CONFIG.find((c) => c.name === entry.name)!;
                            return <Cell key={entry.name} fill={`url(#urg-grad-${cfg.name})`} />;
                        })}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

export default UrgencyChart;