interface IconProps {
  size?: number;
}

export function WindowsIcon({ size = 32 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" rx="20" fill="#0078d4" />
      <rect x="14" y="14" width="32" height="32" rx="3" fill="white" />
      <rect x="54" y="14" width="32" height="32" rx="3" fill="white" />
      <rect x="14" y="54" width="32" height="32" rx="3" fill="white" />
      <rect x="54" y="54" width="32" height="32" rx="3" fill="white" />
    </svg>
  );
}

export function OfficeIcon({ size = 32 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="office-bg" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#c4451a" />
          <stop offset="100%" stopColor="#e85b0f" />
        </linearGradient>
      </defs>
      <rect width="100" height="100" rx="20" fill="url(#office-bg)" />
      <text
        x="50"
        y="68"
        textAnchor="middle"
        fill="white"
        fontSize="60"
        fontWeight="bold"
        fontFamily="Arial, sans-serif"
      >
        O
      </text>
    </svg>
  );
}

export function YouTubeIcon({ size = 32 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" rx="20" fill="#ff0000" />
      <rect x="20" y="29" width="60" height="42" rx="8" fill="white" />
      <polygon points="43,39 43,61 63,50" fill="#ff0000" />
    </svg>
  );
}

export function GoogleOneIcon({ size = 32 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="google-bg" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#4285f4" />
          <stop offset="100%" stopColor="#34a853" />
        </linearGradient>
      </defs>
      <rect width="100" height="100" rx="20" fill="url(#google-bg)" />
      <text
        x="50"
        y="70"
        textAnchor="middle"
        fill="white"
        fontSize="58"
        fontWeight="bold"
        fontFamily="Arial, sans-serif"
      >
        1
      </text>
    </svg>
  );
}

export function SpotifyIcon({ size = 32 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" rx="20" fill="#1db954" />
      <path d="M20 38 Q50 28 80 38" stroke="white" strokeWidth="9" strokeLinecap="round" fill="none" />
      <path d="M24 52 Q50 43 76 52" stroke="white" strokeWidth="8" strokeLinecap="round" fill="none" />
      <path d="M28 66 Q50 58 72 66" stroke="white" strokeWidth="7" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export function NetflixIcon({ size = 32 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" rx="20" fill="#e50914" />
      <text
        x="50"
        y="70"
        textAnchor="middle"
        fill="white"
        fontSize="58"
        fontWeight="bold"
        fontFamily="Arial, sans-serif"
      >
        N
      </text>
    </svg>
  );
}
