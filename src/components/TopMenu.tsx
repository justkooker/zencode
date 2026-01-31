import { useEffect, useState } from "react";
import { WiTime9 } from "react-icons/wi";
import { getCurrentDateTime } from "../utils";

const TopMenu = () => {
  const [currentTime, setCurrentTime] = useState(getCurrentDateTime());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(getCurrentDateTime());
    }, 30000); // если будет нужна точность до скункд, то уменьшить интервал до 1000 мс

    return () => clearInterval(interval);
  }, []);

  const { dayOfWeek, date, time } = currentTime;

  return (
    <div className="date d-flex flex-column">
      <span className="align-self-start">{dayOfWeek}</span>
      <div className="d-flex align-items-center gap-4 color-inherit">
        <span className="date__date">{date}</span>
        <span className="d-flex align-items-center gap-2">
          <WiTime9 size={16} color="#8bc34a" />
          {time}
        </span>
      </div>
    </div>
  );
};

export default TopMenu;
