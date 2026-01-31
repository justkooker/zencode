import Logo from "./Logo";
import SearchInput from "./SearchInput";
import TopMenu from "./TopMenu";

const Header = () => {
  return (
    <header className="header px-50">
      <Logo />
      <SearchInput />
      <TopMenu />
    </header>
  );
};

export default Header;
