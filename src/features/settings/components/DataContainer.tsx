type DataContainerProps = {
  ContainerHeader: string;
  ContainerDescription: string;
  HeaderIcon?: React.ReactNode;
  children: React.ReactNode;
};

const DataContainer = ({
  ContainerHeader,
  ContainerDescription,
  HeaderIcon,
  children,
}: DataContainerProps) => {
  return (
    <div className="mx-auto max-w-4xl px-6">
      <div className="p-6 bg-white rounded-2xl shadow-md mt-10 flex flex-col gap-4">
        {/* Icon and container header */}
        <div className="flex items-center gap-4">
          {HeaderIcon && <div className="text-3xl">{HeaderIcon}</div>}
          <div className="text-dark-navy-purple">
            <h2 className="text-2xl font-bold">{ContainerHeader}</h2>
            <p className="text-sm">{ContainerDescription}</p>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
};

export default DataContainer;
