export default function Logo() {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="rounded-lg w-8 h-8"
    >
      {/* Background Square */}
      <rect width="32" height="32" rx="8" className="fill-primary" />

      {/* Rotated Group: -90 degrees around the center (16, 16) */}
      <g transform="rotate(-90 16 16)">
        {/* Stylized 'A' / Chevron */}
        <path
          d="M16 7L26 21L22 21L16 12.5L10 21L6 21L16 7Z"
          className="fill-primary-foreground"
        />
        <path
          d="M16 16.5L21 24H18L16 21L14 24H11L16 16.5Z"
          className="fill-primary-foreground"
        />
      </g>
    </svg>
  );
}
