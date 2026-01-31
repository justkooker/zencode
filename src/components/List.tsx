import { type ReactNode } from "react";

interface ListProps {
  children: ReactNode;
}

const List = ({ children }: ListProps) => {
  return (
    <ul className="products-page_list d-flex flex-column gap-3">{children}</ul>
  );
};

export default List;
