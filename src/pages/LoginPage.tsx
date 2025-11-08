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
        const data = await response.json(); // { id, name, token, ... }
        console.log("DATA: " + JSON.stringify(data));
        if (data?.token) {
          localStorage.setItem("traccarToken", data.token);
        }
        console.log("Login successful:", data);
      } else {
        console.error("Login failed:", response.statusText);
      }
    };
    login();
  }, []);
  return (
    <div
      className="w-full h-screen flex flex-col items-center justify-center"
      style={{
        backgroundImage: "url('src/shared/img/variant.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Link
        to="/setup"
        className="mt-40 text-3xl text-icy-mint underline animate-bounce"
      >
        Log In
      </Link>
      <img
        src="src/shared/img/tramppa.png"
        alt="tramppa xddd"
        className="h-2/5 mt-0 absolute bottom-2"
      />
      <img
        src="src/shared/img/pasithemeasureman.png"
        alt=""
        className="h-2/5 mt-14 animate-bounce"
      />
    </div>
  );
};

export default LoginPage;
