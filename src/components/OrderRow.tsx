import { FaTrashAlt, FaListUl } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
import { formatDate } from "../utils";
import { useAppSelector } from "../store/hooks";
import { type Product } from "../types";

interface OrderProps {
  shortView?: boolean;
  activeOrder?: number;
  openDetails?: (id: number) => void;
  onDelete: (id: number) => void;
}
const OrderRow = ({
  shortView,
  openDetails,
  activeOrder,
  onDelete,
}: OrderProps) => {
  const products = useAppSelector((state) => state.products.items);
  const orders = useAppSelector((state) => state.orders.items);

  const calcOrderTotal = (
    products: Product[],
    orderId: number,
  ): Record<string, number> => {
    return products
      .filter((product) => product.order === orderId)
      .flatMap((product) => product.price)
      .reduce<Record<string, number>>((acc, price) => {
        acc[price.symbol] = (acc[price.symbol] ?? 0) + price.value;
        return acc;
      }, {});
  };
  return (
    <>
      {orders.map(({ id, title, date }: any) => {
        const price = calcOrderTotal(products, id);
        return (
          <li
            onClick={() => openDetails?.(id)}
            key={id}
            className={`order-page__item item w-100 ps-3 pe-0 ${shortView ? "item_short-order" : "item_order"}`}
          >
            <span
              className={`item__order truncate truncate-1 underline ${shortView ? "hidden-order-el" : "showned-order-el"}  `}
              title={title}
            >
              {title}
            </span>
            <div className="item__products d-flex align-items-center gap-2 py-3">
              <button
                type="button"
                className="d-flex align-items-center justify-content-center"
              >
                <FaListUl size={18} color="#546e7a" />
              </button>
              <div className="d-flex flex-column">
                <span>
                  {products.filter((item) => item.order === id).length}
                </span>
                <span>Продукта</span>
              </div>
            </div>
            <div className=" item__date py-3">
              <span className="item__date_short">
                {formatDate(date).orderDateShort}
              </span>
              <span className="item__date_full d-block">
                {formatDate(date).orderDateFull}
              </span>
            </div>
            <div
              className={`item__price py-3 ${shortView ? "item__el_hidden" : ""}`}
            >
              <span className="item__price_secondary">
                {price.USD}
                {" $"}
              </span>
              <span className="item__price_primary d-block">
                {price.UAH}
                <span>
                  &nbsp;
                  {"UAH"}
                </span>
              </span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(id);
              }}
              className={`item__btn d-flex align-items-center justify-content-center w-100 p-0 ${shortView ? "item__btn_big" : ""} ${shortView && activeOrder !== id ? "item__btn_big item__btn_transaprent" : ""}`}
              type="button"
              disabled={shortView}
            >
              {shortView ? (
                activeOrder === id ? (
                  <IoIosArrowForward size={16} color="#ffffff" />
                ) : (
                  ""
                )
              ) : (
                <FaTrashAlt size={16} color="#90a4ae" />
              )}
            </button>
          </li>
        );
      })}
    </>
  );
};
export default OrderRow;
