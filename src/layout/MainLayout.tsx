import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import NavigationMenu from "../components/NavigationMenu";

const MainLayout = () => {
  return (
    <div className="layout d-flex flex-column vh-100">
      <Header />

      <main className="layout__main d-flex w-100">
        <NavigationMenu />
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
