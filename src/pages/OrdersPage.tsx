import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import Filter from "../Filter";
import PageTitle from "../PageTitle";
import List from "../components/List";
import OrderRow from "../components/OrderRow";
import ProductRow from "../components/ProductRow";
import CloseBtn from "../components/CloseBtn";
import { selectFilteredProducts } from "../store/selectors/productsSelector";
import { ordersApi } from "../services/api";

import { fetchOrders } from "../services/ordersServices";
import { setActiveOrder } from "../store/slices/ordersSlice";

const OrdersPage = () => {
  const dispatch = useAppDispatch();
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(true);
  const [inProcces, setInProcces] = useState(false);

  const orders = useAppSelector((state) => state.orders.items);
  const activeOrder = useAppSelector((state) => state.orders.activeOrderId);
  const filterType = useAppSelector((state) => state.products.filterType);

  const activeOrderDetails = useAppSelector((state) =>
    selectFilteredProducts(state, activeOrder, filterType),
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
  const handleDelete = async (id: number) => {
    try {
      await ordersApi.delete(id);
      dispatch(fetchOrders() as any);
    } catch (err) {
      console.error("Ошибка при удалении:", err);
    }
  };
  return (
    <div className="order-page w-100 flex-1 d-flex flex-column gap-5">
      <div className="d-flex align-items-center gap-5">
        <PageTitle title="Приход" quantity={orders.length} />
        <Filter value={filterType} />
      </div>
      <div className="d-flex justify-content-start gap-3">
        <div className="d-flex gap-3 ">
          <div className="pt-4">
            <List>
              <OrderRow
                shortView={isVisible}
                openDetails={handleActiveOrder}
                activeOrder={activeOrder ?? undefined}
                onDelete={handleDelete}
              />
            </List>
          </div>

          <div
            className={`order-page__container pe-4 pt-4 ${isClosing ? "closing" : "opening"}`}
          >
            <CloseBtn
              onClick={closeDetails}
              isVisible={!!activeOrderDetails.length}
            />

            <ul className="d-flex flex-column">
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
  );
};

export default OrdersPage;
