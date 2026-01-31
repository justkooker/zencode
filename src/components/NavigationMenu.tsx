import { PiGearFill } from "react-icons/pi";

import avatar from "../assets/avat.webp";
import { NavLink } from "react-router-dom";

const NavigationMenu = () => {
  return (
    <div className="my-navbar d-flex flex-column gap-5">
      <div className="my-navbar__avatar p-3">
        <img src={avatar} alt="Avatar" />
        <button
          type="button"
          className="d-flex justify-content-center align-items-center"
        >
          <PiGearFill size={16} color="#546e7a" />
        </button>
      </div>
      <ul className="menu d-flex flex-column align-items-center">
        <li>
          <NavLink
            className={({ isActive }) =>
              isActive ? "menu__item active" : "menu__item"
            }
            to="/"
          >
            Приход
          </NavLink>
        </li>
        <li>
          <NavLink
            className={({ isActive }) =>
              isActive ? "menu__item active" : "menu__item"
            }
            to="/groups"
          >
            Группы
          </NavLink>
        </li>
        <li>
          <NavLink
            className={({ isActive }) =>
              isActive ? "menu__item active" : "menu__item"
            }
            to="/products"
          >
            Продукты
          </NavLink>
        </li>
        <li>
          <NavLink
            className={({ isActive }) =>
              isActive ? "menu__item active" : "menu__item"
            }
            to="/users"
          >
            Пользователи
          </NavLink>
        </li>
        <li>
          <NavLink
            className={({ isActive }) =>
              isActive ? "menu__item active" : "menu__item"
            }
            to="/settings"
          >
            Настройки
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default NavigationMenu;
