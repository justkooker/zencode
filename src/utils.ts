interface FormatDate {
  guaranteeDate: string;
  orderDateFull: string;
  orderDateShort: string;
}

const days = [
  "Воскресенье",
  "Понедельник",
  "Вторник",
  "Среда",
  "Четверг",
  "Пятница",
  "Суббота",
];

const months = [
  "Янв",
  "Фев",
  "Мар",
  "Апр",
  "Май",
  "Июн",
  "Июл",
  "Авг",
  "Сен",
  "Окт",
  "Ноя",
  "Дек",
];

export function getCurrentDateTime() {
  const now = new Date();

  const dayOfWeek = days[now.getDay()];

  const day = String(now.getDate()).padStart(2, "0");
  const month = months[now.getMonth()];
  const year = now.getFullYear();
  const date = `${day} ${month}, ${year}`;

  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const time = `${hours}:${minutes}`;

  return { dayOfWeek, date, time };
}

export const formatDate = (dateString: string): FormatDate => {
  const splitedDateString = dateString.split(" ")[0].split("-").reverse();

  const guaranteeDate = splitedDateString.join(" / ");
  const orderDateArr = [...splitedDateString];
  orderDateArr[1] = months[Number(orderDateArr[1]) - 1];
  const orderDateFull = orderDateArr.join(" / ");
  const orderDateShort = [...splitedDateString].splice(0, 2).join(" / ");
  return { guaranteeDate, orderDateFull, orderDateShort };
};
