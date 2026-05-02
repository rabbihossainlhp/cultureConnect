type BrandMarkProps = {
  showName?: boolean;
  className?: string;
  imageClassName?: string;
  textClassName?: string;
};

function BrandMark({
  showName = true,
  className = "",
  imageClassName = "h-8 w-8",
  textClassName = "text-lg font-bold",
}: BrandMarkProps) {
  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <img
        src="/images/logo.png"
        alt="CultureConnect logo"
        className={`object-contain ${imageClassName}`}
      />
      {showName ? (
        <span className={textClassName}>CultureConnect</span>
      ) : null}
    </div>
  );
}

export default BrandMark;
