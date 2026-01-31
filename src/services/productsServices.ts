import { productsApi } from "../services/api";
import {
  setProducts,
  setLoading,
  setError,
  deleteProduct,
} from "../store/slices/productsSlice";
import { type AppDispatch } from "../store/store";

export const fetchProducts = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(setLoading(true));
    const data = await productsApi.getAll();
    dispatch(setProducts(data));
    dispatch(setError(null));
  } catch (err: any) {
    dispatch(setError(err.message));
  } finally {
    dispatch(setLoading(false));
  }
};

export const deleteProductApi = (id: number) => async (dispatch: AppDispatch) => {
  try {
    await productsApi.delete(id);
    dispatch(deleteProduct(id));
    dispatch(setError(null));
  } catch (err: any) {
    dispatch(setError(err.message));
  }
};
