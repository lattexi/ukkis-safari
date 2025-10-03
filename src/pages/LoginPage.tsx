const LoginPage = () => {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-icy-blue">
      <div>LoginPage</div>

      {/* Success color test */}
      <div className="flex items-center gap-2 rounded bg-success-bg px-3 py-1">
        <span className="size-2.5 rounded-full bg-success-badge"></span>
        <span className="text-success-text text-sm font-medium">Online</span>
      </div>

      <div className="flex items-center gap-2 rounded bg-danger-bg px-3 py-1 mt-6">
        <span className="size-2.5 rounded-full bg-danger-badge"></span>
        <span className="text-danger-text text-sm font-medium">Offline</span>
      </div>
    </div>
  );
};

export default LoginPage;
