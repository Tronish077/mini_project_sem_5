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

type BusinessImpactChartProps = {
    businessImpact: Record<string, number>;
};

const IMPACT_COLORS = [
    "#2563eb",
    "#6366f1",
    "#0ea5e9",
    "#10b981",
    "#f59e0b",
    "#a855f7",
    "#f43f5e",
    "#14b8a6",
];

function ImpactTooltip({ active, payload, label }: any) {
    if (!active || !payload?.length) return null;
    return (
        <div
            style={{
                background: "rgba(15,23,42,0.92)",
                border: "1px solid rgba(37,99,235,0.3)",
                borderRadius: 12,
                padding: "10px 16px",
                backdropFilter: "blur(8px)",
                boxShadow: "0 8px 32px rgba(37,99,235,0.25)",
                maxWidth: 220,
            }}
        >
            <p
                style={{
                    color: "#93c5fd",
                    fontWeight: 700,
                    fontSize: 12,
                    marginBottom: 2,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                }}
            >
                {label}
            </p>
            <p style={{ color: "#e2e8f0", fontSize: 13 }}>
                <strong style={{ fontSize: 18 }}>{payload[0].value}</strong> reviews
            </p>
        </div>
    );
}

function BusinessImpactChart({ businessImpact }: BusinessImpactChartProps) {
    const data = Object.entries(businessImpact)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value);

    return (
        <div
            style={{
                width: "100%",
                height: "100%",
                borderRadius: 16,
                background: "linear-gradient(145deg, #ffffff 0%, #f0f6ff 100%)",
                padding: "20px 20px 12px",
                boxShadow: "0 4px 24px rgba(37,99,235,0.09), 0 1px 4px rgba(0,0,0,0.05)",
                border: "1px solid rgba(37,99,235,0.12)",
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
                        color: "#2563eb",
                        background: "rgba(37,99,235,0.08)",
                        padding: "2px 8px",
                        borderRadius: 100,
                    }}
                >
                    Impact
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
                Business Impact
            </h2>

            <ResponsiveContainer width="100%" style={{ flex: 1, marginTop: 16 }}>
                <BarChart
                    data={data}
                    layout="vertical"
                    barCategoryGap="25%"
                    margin={{ top: 4, right: 16, bottom: 0, left: 0 }}
                >
                    <defs>
                        {data.map((_, i) => {
                            const color = IMPACT_COLORS[i % IMPACT_COLORS.length];
                            return (
                                <linearGradient key={i} id={`bi-grad-${i}`} x1="0" y1="0" x2="1" y2="0">
                                    <stop offset="0%" stopColor={color} stopOpacity={0.9} />
                                    <stop offset="100%" stopColor={color} stopOpacity={0.45} />
                                </linearGradient>
                            );
                        })}
                    </defs>
                    <CartesianGrid horizontal={false} stroke="rgba(148,163,184,0.15)" />
                    <XAxis
                        type="number"
                        axisLine={false}
                        tickLine={false}
                        allowDecimals={false}
                        tick={{ fill: "#94a3b8", fontSize: 11 }}
                    />
                    <YAxis
                        type="category"
                        axisLine={false}
                        tickLine={false}
                        dataKey="name"
                        width={130}
                        tick={({ x, y, payload }) => {
                            const color = IMPACT_COLORS[data.findIndex((d) => d.name === payload.value) % IMPACT_COLORS.length];
                            return (
                                <g transform={`translate(${x},${y})`}>
                                    <text
                                        x={0}
                                        y={0}
                                        dy={4}
                                        textAnchor="end"
                                        fill={color}
                                        fontSize={11}
                                        fontWeight={600}
                                    >
                                        {payload.value.length > 18 ? payload.value.slice(0, 17) + "…" : payload.value}
                                    </text>
                                </g>
                            );
                        }}
                    />
                    <Tooltip content={<ImpactTooltip />} cursor={{ fill: "rgba(37,99,235,0.05)", radius: 4 }} />
                    <Bar
                        dataKey="value"
                        name="Reviews"
                        radius={[0, 6, 6, 0]}
                        animationBegin={0}
                        animationDuration={700}
                    >
                        {data.map((_, i) => (
                            <Cell key={i} fill={`url(#bi-grad-${i})`} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

export default BusinessImpactChart;