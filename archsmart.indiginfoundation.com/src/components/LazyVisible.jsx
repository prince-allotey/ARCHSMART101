import React, { useEffect, useRef, useState } from "react";

/**
 * LazyVisible mounts children only when it becomes visible in the viewport.
 * Props:
 * - height: number (px) for placeholder min-height
 * - className: optional wrapper classes
 * - rootMargin: IntersectionObserver rootMargin (default: "0px")
 * - once: if true, stays mounted after first visible (default: true)
 */
export default function LazyVisible({
  children,
  height = 200,
  className = "",
  rootMargin = "0px",
  once = true,
}) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!ref.current || typeof IntersectionObserver === "undefined") {
      // Fallback: mount immediately if IO not available
      setIsVisible(true);
      return;
    }

    let mounted = true;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!mounted) return;
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { root: null, rootMargin, threshold: 0 }
    );

    observer.observe(ref.current);
    return () => {
      mounted = false;
      observer.disconnect();
    };
  }, [rootMargin, once]);

  return (
    <div ref={ref} className={className} style={{ minHeight: height }}>
      {isVisible ? children : (
        <div style={{ height }} className="w-full bg-gray-100 rounded" />
      )}
    </div>
  );
}
