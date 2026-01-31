import { PRODUCT_TYPES } from "./constants";
import { useAppDispatch } from "./store/hooks";
import { setFilterType } from "./store/slices/productsSlice";
interface FilterProps {
  value: string;
}
const Filter = ({ value }: FilterProps) => {
  const dispatch = useAppDispatch();
  return (
    <div className="filter d-flex align-items-center gap-3">
      <label htmlFor="type" className="filter__label">
        Тип:
      </label>
      <select
        onChange={(e) => dispatch(setFilterType(e.target.value))}
        id="type"
        name="type"
        value={value}
        className="filter__select"
      >
        {PRODUCT_TYPES.map((type) => (
          <option value={type.value}>{type.label}</option>
        ))}
      </select>
    </div>
  );
};

export default Filter;
