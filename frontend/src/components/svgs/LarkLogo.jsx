const LarkLogo = ({ className, size = 32 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      className={className}
    >
      <path
        d="M6 27 C7 22 13 15 21 11 C25 9 29 8 29 8 C29 8 27 13 24 17 C20 22 15 23 8 27 Z"
        fill="#1d9bf0"
      />
      <line
        x1="8"
        y1="27"
        x2="15"
        y2="19"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default LarkLogo;