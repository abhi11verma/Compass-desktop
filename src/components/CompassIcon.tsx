interface Props {
  size?: number
  className?: string
}

export function CompassIcon({ size = 32, className }: Props) {
  const showNorth = size >= 48

  if (showNorth) {
    return (
      <svg
        width={size}
        height={Math.round(size * 1.1875)}
        viewBox="0 0 32 38"
        fill="none"
        className={className}
        aria-hidden="true"
      >
        <text x="16" y="3.2" textAnchor="middle" dominantBaseline="middle"
          fill="currentColor" fontSize="2.6" fontFamily="system-ui,sans-serif"
          fontWeight="700" letterSpacing="0.18em">NORTH</text>
        <line x1="16" y1="4.6" x2="16" y2="7.5" stroke="currentColor" strokeWidth="0.6" strokeLinecap="round" opacity="0.5"/>
        <circle cx="16" cy="21" r="13.5" stroke="currentColor" strokeWidth="0.9"/>
        <line x1="16" y1="34.5" x2="16" y2="36.5" stroke="currentColor" strokeWidth="0.6" strokeLinecap="round" opacity="0.3"/>
        <line x1="2.5" y1="21" x2="4.5" y2="21" stroke="currentColor" strokeWidth="0.6" strokeLinecap="round" opacity="0.3"/>
        <line x1="27.5" y1="21" x2="29.5" y2="21" stroke="currentColor" strokeWidth="0.6" strokeLinecap="round" opacity="0.3"/>
        <text x="16" y="30.5" textAnchor="middle" dominantBaseline="middle" fill="currentColor" fontSize="2.8" fontFamily="system-ui,sans-serif" fontWeight="600" opacity="0.3">S</text>
        <text x="25" y="21.1" textAnchor="middle" dominantBaseline="middle" fill="currentColor" fontSize="2.8" fontFamily="system-ui,sans-serif" fontWeight="600" opacity="0.3">E</text>
        <text x="7" y="21.1" textAnchor="middle" dominantBaseline="middle" fill="currentColor" fontSize="2.8" fontFamily="system-ui,sans-serif" fontWeight="600" opacity="0.3">W</text>
        {/* needle tips meet exactly at center so no bg fill needed */}
        <polygon points="16,8 13.2,21 16,19 18.8,21" fill="currentColor"/>
        <polygon points="16,34 13.2,21 16,23 18.8,21" fill="currentColor" opacity="0.22"/>
        <circle cx="16" cy="21" r="1.2" fill="currentColor"/>
      </svg>
    )
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <circle cx="16" cy="16" r="13.5" stroke="currentColor" strokeWidth="0.9"/>
      <line x1="16" y1="2.5" x2="16" y2="4.5" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" opacity="0.5"/>
      <line x1="16" y1="27.5" x2="16" y2="29.5" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" opacity="0.3"/>
      <line x1="2.5" y1="16" x2="4.5" y2="16" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" opacity="0.3"/>
      <line x1="27.5" y1="16" x2="29.5" y2="16" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" opacity="0.3"/>
      <text x="16" y="25.5" textAnchor="middle" dominantBaseline="middle" fill="currentColor" fontSize="2.8" fontFamily="system-ui,sans-serif" fontWeight="600" opacity="0.3">S</text>
      <text x="24.5" y="16.1" textAnchor="middle" dominantBaseline="middle" fill="currentColor" fontSize="2.8" fontFamily="system-ui,sans-serif" fontWeight="600" opacity="0.3">E</text>
      <text x="7.5" y="16.1" textAnchor="middle" dominantBaseline="middle" fill="currentColor" fontSize="2.8" fontFamily="system-ui,sans-serif" fontWeight="600" opacity="0.3">W</text>
      <polygon points="16,3 13.2,16 16,14 18.8,16" fill="currentColor"/>
      <polygon points="16,29 13.2,16 16,18 18.8,16" fill="currentColor" opacity="0.22"/>
      <circle cx="16" cy="16" r="1.2" fill="currentColor"/>
    </svg>
  )
}
