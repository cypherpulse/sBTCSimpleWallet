interface BitcoinIconProps {
  className?: string;
  size?: number;
  style?: React.CSSProperties;
}

const BitcoinIcon = ({ className = "", size = 48, style }: BitcoinIconProps) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
    >
      <circle cx="32" cy="32" r="30" fill="currentColor" />
      <path
        d="M43.5 28.5C44.5 24 41 22.5 36 21.8L37.5 15.5L33.5 14.5L32 20.5C31 20.3 30 20.1 29 19.9L30.5 13.8L26.5 12.8L25 19.1C24.2 18.9 23.4 18.7 22.6 18.6L22.6 18.5L17 17.1L16 21.5C16 21.5 19 22.2 18.9 22.2C20.5 22.6 20.8 23.7 20.7 24.6L19 31.5C19.1 31.5 19.3 31.6 19.5 31.7C19.3 31.6 19.1 31.6 18.9 31.5L16.5 41.3C16.3 41.8 15.8 42.6 14.6 42.3C14.6 42.4 11.7 41.6 11.7 41.6L9.8 46.3L15.1 47.6C16 47.8 16.8 48.1 17.6 48.3L16.1 54.7L20.1 55.7L21.6 49.4C22.6 49.7 23.6 49.9 24.6 50.1L23.1 56.4L27.1 57.4L28.6 51C35.2 52.2 40.2 51.7 42.2 45.8C43.8 40.9 42 38.1 38.5 36.3C41 35.7 43 34 43.5 30.5V28.5ZM34.8 43.3C33.7 47.9 26 45.4 23.5 44.8L25.5 36.5C28 37.1 36 38.5 34.8 43.3ZM36 28.3C35 32.5 28.5 30.4 26.4 29.9L28.2 22.3C30.3 22.8 37 24 36 28.3Z"
        fill="hsl(var(--background))"
      />
    </svg>
  );
};

export default BitcoinIcon;
