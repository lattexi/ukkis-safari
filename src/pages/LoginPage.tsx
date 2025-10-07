import { useEffect } from "react";
import { Link } from "react-router";

const LoginPage = () => {
  useEffect(() => {
    const login = async () => {
      const response = await fetch(
        `${import.meta.env.VITE_TRACCAR_API_URL}/session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: `email=${import.meta.env.VITE_TRACCAR_EMAIL}&password=${import.meta.env.VITE_TRACCAR_PASSWORD}`,
          credentials: "include",
        },
      );
      console.log("Login response:", response);
      if (response.ok) {
        const data = await response.json();
        console.log("Login successful:", data);
      } else {
        console.error("Login failed:", response.statusText);
      }
    };
    login();
  }, []);
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-icy-blue">
      <div>LoginPage</div>
      <Link to="/setup" className="mt-4 text-icy-mint underline">
        {`Go to Setup Page ->`}
      </Link>
    </div>
  );
};

export default LoginPage;
