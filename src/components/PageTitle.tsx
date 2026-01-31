interface PageTitleProps {
  title: string;
  quantity: number;
}
const PageTitle = ({ title, quantity }: PageTitleProps) => {
  return (
    <div className="d-flex gap-5 page-title">
      <h3 className="">
        {title} / {quantity}
      </h3>
    </div>
  );
};

export default PageTitle;
