import { useState, useEffect } from "react";
import { CiCirclePlus } from "react-icons/ci";

import { useAppDispatch, useAppSelector } from "../store/hooks";
import { selectFilteredProducts } from "../store/selectors/productsSelector";
import { ordersApi } from "../services/api";
import { fetchOrders } from "../services/ordersServices";
import { setActiveOrder } from "../store/slices/ordersSlice";

import Filter from "../Filter";
import PageTitle from "../components/PageTitle";
import List from "../components/List";
import OrderRow from "../components/OrderRow";
import ProductRow from "../components/ProductRow";
import CloseBtn from "../components/CloseBtn";
import Title from "../components/Title";
import Button from "../components/Button";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";

const OrdersPage = () => {
  const dispatch = useAppDispatch();
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(true);
  const [inProcces, setInProcces] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [toDeleteId, setToDeleteId] = useState<number | null>(null);

  const orders = useAppSelector((state) => state.orders.items);
  const activeOrder = useAppSelector((state) => state.orders.activeOrderId);
  const filterType = useAppSelector((state) => state.products.filterType);

  const activeOrderDetails = useAppSelector((state) =>
    selectFilteredProducts(state, activeOrder, filterType)
  );

  useEffect(() => {
    if (isVisible) {
      requestAnimationFrame(() => {
        setIsClosing(false);
      });
    }
  }, [isVisible]);

  const closeDetails = () => {
    if (inProcces) return;
    if (isVisible) {
      setInProcces(true);
      setIsClosing(true);
      setIsVisible(false);
      setTimeout(() => {
        dispatch(setActiveOrder(null));
        setInProcces(false);
      }, 500);
    }
  };
  const openDetails = () => {
    if (inProcces) return;
    if (!isVisible) {
      setInProcces(true);
      setIsClosing(false);
      setIsVisible(true);
      setTimeout(() => {
        setInProcces(false);
      }, 1000);
    }
  };

  const handleActiveOrder = (id: number) => {
    dispatch(setActiveOrder(id));
    openDetails();
  };

  const handleDeleteClick = (id: number) => {
    setToDeleteId(id);
    setIsConfirmOpen(true);
  };

  const handleClose = () => {
    setIsConfirmOpen(false);
    setToDeleteId(null);
  };

  const handleConfirmDelete = async () => {
    if (!toDeleteId) return;
    try {
      await ordersApi.delete(toDeleteId);
      dispatch(fetchOrders() as any);
      if (activeOrder === toDeleteId) {
        closeDetails();
      }
    } catch (err) {
      console.error("Ошибка при удалении прихода:", err);
    } finally {
      handleClose();
    }
  };

  return (
    <>
      <div className="order-page w-100 flex-1 d-flex flex-column gap-4">
        <div className="d-flex align-items-center gap-5">
          <PageTitle title="Приход" quantity={orders.length} />
          <Filter value={filterType} />
        </div>
        <div className="d-flex justify-content-start gap-3">
          <div className="d-flex gap-3 order-page__row">
            <div className="order-page__list pt-4">
              <List>
                <OrderRow
                  shortView={isVisible}
                  openDetails={handleActiveOrder}
                  activeOrder={activeOrder ?? undefined}
                  onDelete={handleDeleteClick}
                />
              </List>
            </div>
  
            <div
              className={`order-page__container pe-4 pt-4 ${
                !!activeOrderDetails.length
                  ? isClosing
                    ? "closing"
                    : "opening"
                  : "closing"
              }`}
            >
              <CloseBtn
                onClick={closeDetails}
                isVisible={!!activeOrderDetails.length}
              />
              <div className="order-page__wrap w-100">
                <Title
                  title="Длинное название прихода"
                  fontSize={18}
                  classNames="ps-4 pt-2"
                />
                <Button
                  type="button"
                  className="pb-2 ps-4"
                  style={{ color: "var(--color-brand-primary)" }}
                >
                  <CiCirclePlus size={20} />
                  Добавить продукт
                </Button>
                <ul className="d-flex flex-column mb-0 ">
                  <ProductRow
                    products={activeOrderDetails}
                    orders={orders}
                    shortView={true}
                  />
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ConfirmDeleteModal
        variant="order"
        isOpen={isConfirmOpen}
        toDeleteId={toDeleteId}
        message="Вы уверены что хотите удалить этот приход?"
        onClose={handleClose}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
};

export default OrdersPage;
