import { RiShieldFill } from "react-icons/ri";
import { FaCircleUser } from "react-icons/fa6";

const Logo = () => {
  return (
    <div className="logo">
      <div className="logo__outer">
        <RiShieldFill size={45} color="#7cb342" />
        <div className="logo__inner">
          <FaCircleUser size={25} color="#689e30" />
        </div>
      </div>
      <span className="logo__text">inventory</span>
    </div>
  );
};

export default Logo;
