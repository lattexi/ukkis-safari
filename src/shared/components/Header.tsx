type HeaderProps = {
  title?: string;
};

const Header = ({ title }: HeaderProps) => {
  return (
    // <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-200">
    <header className="bg-white/80 shadow-sm border-b border-gray-200">
      <div className="px-4 py-4">
        <h1 className="text-2xl font-bold text-dark-navy-purple text-center">
          {title}
        </h1>
      </div>
    </header>
  );
};

export default Header;
