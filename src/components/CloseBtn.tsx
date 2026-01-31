import type { CSSProperties } from "react";
import { IoClose } from "react-icons/io5";
interface CloseBtnProps {
  onClick: () => void;
  isVisible?: boolean;
  styles?: CSSProperties;
}
const CloseBtn = ({ onClick, isVisible, styles }: CloseBtnProps) => {
  return (
    <button
      onClick={onClick}
      type="button"
      className={`close-btn d-flex align-items-center justify-content-center ${isVisible ? "" : "d-none"}`}
      style={{ ...styles }}
    >
      <IoClose size={12} color="90a4ae" />
    </button>
  );
};

export default CloseBtn;
