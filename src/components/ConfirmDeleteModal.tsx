import { createPortal } from "react-dom";
import CloseBtn from "./CloseBtn";
import { useAppSelector } from "../store/hooks";
import ProductRow from "./ProductRow";
import { FaTrashAlt } from "react-icons/fa";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose?: () => void;
  onConfirm?: () => void;
  message?: string;
  toDeleteId?: number | null | undefined;
}

const ConfirmDeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  message,
  toDeleteId,
}: ConfirmModalProps) => {
  const products = useAppSelector((state) => state.products.items);
  const selectedProduct = products.filter((item) => item.id === toDeleteId);

  if (!isOpen) return null;

  const btnStyles = {
    top: "-20px",
    right: "-20px",
    boxShadow: "-2px 2px 8px 1px #898b8d",
  };

  return createPortal(
    <div className="confirm-overlay" onClick={onClose}>
      <div className="position-relative">
        <CloseBtn
          onClick={() => onClose?.()}
          isVisible={true}
          styles={btnStyles}
        />
        <div
          className="confirm-content d-flex flex-column justify-content-between"
          onClick={(e) => e.stopPropagation()}
        >
          <div>
            <p className="confirm-title">{message}</p>
            <ProductRow products={selectedProduct} modalView={true} />
          </div>
          <div className="confirm-buttons d-flex justify-content-end align-items-center gap-2">
            <button onClick={onClose} className="modal-btn modal-btn-cancel">
              отменить
            </button>
            <button
              className="modal-btn modal-btn-confirm gap-3 align-items-center"
              onClick={onConfirm}
            >
              <FaTrashAlt /> удалить
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default ConfirmDeleteModal;
