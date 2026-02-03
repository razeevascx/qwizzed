import * as motion from "motion/react-client";

export function FloatingPaths({ position }: { position: number }) {
  const paths = Array.from({ length: 48 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 6 * position} -${189 + i * 8}C-${
      380 - i * 6 * position
    } -${189 + i * 8} -${312 - i * 6 * position} ${216 - i * 8} ${
      152 - i * 6 * position
    } ${343 - i * 8}C${616 - i * 6 * position} ${470 - i * 8} ${
      684 - i * 6 * position
    } ${875 - i * 8} ${684 - i * 6 * position} ${875 - i * 8}`,
    width: 0.8 + i * 0.05,
  }));

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3">
      <svg
        className="h-full w-full text-foreground"
        fill="none"
        viewBox="0 0 696 316"
      >
        <title>Background Paths</title>
        {paths.map((path) => (
          <motion.path
            animate={{
              pathLength: 1,
              opacity: [0.1, 0.3, 0.1],
              pathOffset: [0, 1, 0],
            }}
            d={path.d}
            initial={{ pathLength: 0.3, opacity: 0.2 }}
            key={path.id}
            stroke="currentColor"
            strokeOpacity={0.05 + path.id * 0.015}
            strokeWidth={path.width}
            transition={{
              duration: 20 + Math.random() * 10,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
        ))}
      </svg>
    </div>
  );
}
