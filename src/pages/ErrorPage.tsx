const ErrorPage = () => (
  <div className="flex flex-col items-center justify-center h-screen bg-red-100 text-red-800">
    <h1 className="text-3xl font-bold mb-4">Error</h1>
    <p className="mb-2">
      Sorry, something went wrong. The application could not be loaded.
    </p>
    <p>Please check your internet connection or try refreshing the page.</p>
  </div>
);

export default ErrorPage;
