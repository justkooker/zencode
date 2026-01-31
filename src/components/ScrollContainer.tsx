import { type ReactNode } from "react";

interface ScrollContainerProps {
  children: ReactNode;
}

const ScrollContainer = ({ children }: ScrollContainerProps) => {
  return <div className="products-scroll d-flex">{children}</div>;
};

export default ScrollContainer;
