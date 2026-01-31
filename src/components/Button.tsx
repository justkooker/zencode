import React from "react";
interface ButtonProps {
  children: React.ReactNode;
  className?: string;
  type?: "button" | "submit";
  style?: React.CSSProperties;
}
const Button = ({
  children,
  className,
  style,
  type = "button",
}: ButtonProps) => {
  return (
    <button type={type} className={`button d-flex align-items-center gap-2 ${className}`} style={style}>
      {children}
    </button>
  );
};

export default Button;
