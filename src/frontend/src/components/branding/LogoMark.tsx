interface LogoMarkProps {
  size?: number;
  className?: string;
}

export function LogoMark({ size = 48, className = '' }: LogoMarkProps) {
  return (
    <img
      src="/assets/generated/logo-mark.dim_512x512.png"
      alt="CollabBoard Logo"
      width={size}
      height={size}
      className={className}
    />
  );
}
