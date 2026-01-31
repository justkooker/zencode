import { FaTrashAlt } from "react-icons/fa";
import { formatDate } from "../utils";
import { type Order, type Product, type ProductPrice } from "../types";
import imagePlaceholder from "../assets/image-placeholder.webp";
import ProductImage from "../components/ProductImage";

interface ProductProps {
  shortView?: boolean;
  modalView?: boolean;
  products: Product[];
  orders?: Order[];
  onDelete?: (id: number) => void;
}
const ProductStatus = {
  Available: 1,
  Repair: 0,
} as const;
type ProductStatus = (typeof ProductStatus)[keyof typeof ProductStatus];

const ProductRow = ({
  modalView,
  shortView,
  orders,
  products,
  onDelete,
}: ProductProps) => {
  return (
    <>
      {products.map(
        ({
          id,
          serialNumber,
          title,
          photo,
          isNew,
          guarantee,
          price,
          order,
          date,
          status,
        }: any) => {
          if (modalView) {
            return (
              <li
                key={id}
                className={`product-page__item item  w-100 p-3 ${modalView ? "item_modal-products" : shortView ? "item_short-products" : "item_products"}`}
              >
                <span
                  className={`item__status-mark ${status === ProductStatus.Available ? "item__status-mark_available" : "item__status-mark_repair"} `}
                ></span>
                <div className={`item__img `}>
                  <ProductImage
                    src={photo}
                    alt={title}
                    fallback={imagePlaceholder}
                  />
                </div>
                <div className={`d-flex flex-column gap-1 `}>
                  <p className={`item__title underline `} title={title}>
                    {title}
                  </p>
                  <span className={`item__serial`}>{serialNumber}</span>
                </div>
              </li>
            );
          }
          return (
            <li
              key={id}
              className={`product-page__item item  w-100 p-3 ${modalView ? "item_modal-products" : shortView ? "item_short-products" : "item_products"}`}
            >
              <span
                className={`item__status-mark ${status === ProductStatus.Available ? "item__status-mark_available" : "item__status-mark_repair"} `}
              ></span>
              <div className={`item__img `}>
                <ProductImage
                  src={photo}
                  alt={title}
                  fallback={imagePlaceholder}
                />
              </div>
              <div className={`d-flex flex-column gap-1 `}>
                <p className={`item__title underline `} title={title}>
                  {title}
                </p>
                <span className={`item__serial`}>{serialNumber}</span>
              </div>
              <span
                className={`item__status ${status === ProductStatus.Available ? "item__status_available" : "item__status_repair"}`}
              >
                {status === ProductStatus.Available ? "cвободен" : "В ремонте"}
              </span>
              <div
                className={` flex-column ${shortView ? "item__el_hidden" : "d-flex"}`}
              >
                <span className="item__guarantee">
                  <span>c &nbsp; </span>
                  {`${formatDate(guarantee.start).guaranteeDate}`}
                </span>
                <span className="item__guarantee">
                  <span>по </span>
                  {`${formatDate(guarantee.end).guaranteeDate}`}
                </span>
              </div>
              <span
                className={`item__condition ${shortView ? "item__el_hidden" : ""}`}
              >
                {isNew ? "новый" : "Б/У"}
              </span>

              <div
                className={`item__price  ${shortView ? "item__el_hidden" : ""}`}
              >
                <span className="item__price_secondary">
                  {price.find((el: ProductPrice) => el.isDefault === 0).value}
                  {price.find((el: ProductPrice) => el.isDefault === 0)
                    .symbol === "USD"
                    ? " $"
                    : ""}
                </span>
                <span className="item__price_primary">
                  {price.find((el: ProductPrice) => el.isDefault === 1).value}
                  <span>
                    &nbsp;
                    {
                      price.find((el: ProductPrice) => el.isDefault === 1)
                        .symbol
                    }
                  </span>
                </span>
              </div>
              <span
                className={`item__order underline truncate-2 ${shortView ? "item__el_hidden" : ""}`}
                title={orders?.find((el: Order) => el.id === order)?.title}
              >
                {orders?.find((el: Order) => el.id === order)?.title}
              </span>
              <div
                className={`item__date ${shortView ? "item__el_hidden" : ""}`}
              >
                <span className={"item__date_short"}>
                  {formatDate(date).orderDateShort}
                </span>
                <span className="item__date_full d-block">
                  {formatDate(date).orderDateFull}
                </span>
              </div>
              <button
                onClick={() => onDelete?.(id)}
                className="item__btn"
                type="button"
              >
                <FaTrashAlt size={16} color="#90a4ae" />
              </button>
            </li>
          );
        },
      )}
    </>
  );
};
export default ProductRow;
