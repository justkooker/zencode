import { useEffect, useState } from "react";

import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchProducts } from "../services/productsServices";
import { productsApi } from "../services/api";
import { selectProducts } from "../store/selectors/productsSelector";

import Filter from "../Filter";
import PageTitle from "../components/PageTitle";
import ProductRow from "../components/ProductRow";
import ScrollContainer from "../components/ScrollContainer";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import List from "../components/List";

const ProductsPage = () => {
  const dispatch = useAppDispatch();
  const products = useAppSelector((state) => state.products.items);
  const orders = useAppSelector((state) => state.orders.items);
  const loading = useAppSelector((state) => state.products.loading);
  const error = useAppSelector((state) => state.products.error);
  const filterType = useAppSelector((state) => state.products.filterType);

  useEffect(() => {
    dispatch(fetchProducts() as any);
  }, [dispatch]);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [toDeleteId, setToDeleteId] = useState<number | null>(null);

  const handleDeleteClick = (id: number) => {
    setToDeleteId(id);
    setIsConfirmOpen(true);
  };
  const handleClose = () => {
    setIsConfirmOpen(false);
  };
  const filteredProducts = useAppSelector((state) =>
    selectProducts(state, filterType)
  );
  const handleConfirmDelete = async () => {
    if (!toDeleteId) return;

    try {
      await productsApi.delete(toDeleteId);
      dispatch(fetchProducts() as any); //
    } catch (err) {
      console.error(err);
    } finally {
      setIsConfirmOpen(false);
      setToDeleteId(null);
    }
  };
  if (loading) return <div className="products-page">Загрузка...</div>;
  if (error) return <div className="products-page">Ошибка: {error}</div>;

  return (
    <>
      <div className="products-page w-100 flex-1 d-flex flex-column gap-5">
        <div className="d-flex align-items-center gap-5">
          <PageTitle title="Продукты" quantity={products.length} />
          <Filter value={filterType} />
        </div>
        <ScrollContainer>
          <List>
            <ProductRow
              products={filteredProducts}
              orders={orders}
              onDelete={handleDeleteClick}
            />
          </List>
        </ScrollContainer>
      </div>
      <ConfirmDeleteModal
        isOpen={isConfirmOpen}
        toDeleteId={toDeleteId}
        message="Вы уверены что хотите удалить этот товар?"
        onClose={handleClose}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
};

export default ProductsPage;
