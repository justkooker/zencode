import { BrowserRouter } from "react-router-dom";
import "./App.css";
import Router from "./router/Router";
import ActiveConnections from "./components/ActiveConnections";
import { useAppDispatch } from "./store/hooks";
import { useEffect } from "react";
import { fetchProducts } from "./services/productsServices";
import { fetchOrders } from "./services/ordersServices";

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchProducts() as any);
    dispatch(fetchOrders() as any);
  }, [dispatch]);

  return (
    <BrowserRouter basename="/">
      <Router />
      <ActiveConnections />
    </BrowserRouter>
  );
}

export default App;
