import { ordersApi } from "../services/api";
import { setOrders, setLoading, setError } from "../store/slices/ordersSlice";
import { type AppDispatch } from "../store/store";

export const fetchOrders = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(setLoading(true));
    const data = await ordersApi.getAll();
    dispatch(setOrders(data));
    dispatch(setError(null));
  } catch (err: any) {
    dispatch(setError(err.message));
  } finally {
    dispatch(setLoading(false));
  }
};
