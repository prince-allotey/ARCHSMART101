import React from "react";

export default function ChartSkeleton({ height = 250 }) {
  return (
    <div className="w-full" style={{ height }}>
      <div className="h-full w-full animate-pulse bg-gray-100 rounded" />
    </div>
  );
}
