export function SmartOffPlanLogo({ className = "h-10 w-auto" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 400 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Gold circle on the left */}
      <circle
        cx="40"
        cy="40"
        r="30"
        stroke="#d4af37"
        strokeWidth="0"
        fill="none"
      />
      
      {/* Main text "SMART OFF PLAN" */}
      <text
        x="85"
        y="32"
        fontFamily="Playfair Display, serif"
        fontSize="20"
        fontWeight="600"
        fill="#8b7355"
        letterSpacing="1.5px"
      >
        SMART OFF PLAN
      </text>
      
      {/* Subtitle "INVEST SMART" */}
      <text
        x="85"
        y="52"
        fontFamily="Inter, sans-serif"
        fontSize="10"
        fontWeight="400"
        fill="#8a7968"
        letterSpacing="3px"
      >
        INVEST SMART
      </text>
      
      {/* Gold rectangular border frame */}
      {/* <rect
        x="80"
        y="15"
        width="300"
        height="50"
        stroke="#d4af37"
        strokeWidth="2"
        fill="none"
        rx="2"
      /> */}
      
      {/* Small vertical line accent on right side of frame */}
      {/* <rect
        x="375"
        y="20"
        width="3"
        height="40"
        fill="#d4af37"
      /> */}
    </svg>
  );
}