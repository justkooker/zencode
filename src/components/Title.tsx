interface TitleProps {
  title: string;
  fontSize?: number;
  classNames?: string;
}
const Title = ({ title, fontSize, classNames }: TitleProps) => {
  return (
    <div className={`d-flex gap-5 title ${classNames}`}>
      <h3 style={{ fontSize: `${fontSize}px ` }}>{title}</h3>
    </div>
  );
};

export default Title;
