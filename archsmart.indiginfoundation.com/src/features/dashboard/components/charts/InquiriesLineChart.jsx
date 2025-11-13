import React from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

export default function InquiriesLineChart({ data, height = 250, color = "#3b82f6", metricKey = "inquiries" }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey={metricKey} stroke={color} strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
}
