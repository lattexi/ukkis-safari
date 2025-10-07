export const LoadingDots = () => {
  return (
    <span className="flex ml-1">
      <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:0ms] mx-0.5"></span>
      <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:100ms] mx-0.5"></span>
      <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:200ms] mx-0.5"></span>
    </span>
  );
};
