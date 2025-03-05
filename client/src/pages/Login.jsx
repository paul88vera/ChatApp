import { auth, googleProvider } from "../firebase";
import { signInWithPopup, onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/chatroom");
      }
    });
  }, [navigate]);

  const signIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/chatroom");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={signIn}
        className="bg-blue-500 text-white px-4 py-2 rounded">
        Sign in with Google
      </button>
    </div>
  );
};

export default Login;
