import { AxiosError } from "axios";
import { loginMethod } from "../services/auth-service";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import { useAppContext } from "../../context/useAppContext";

export const useLogin = () => {
  const navigate = useNavigate();
  const { login } = useAppContext();

  const loginUser = async (username: string, password: string) => {
    try {
      const {data} = await loginMethod(username, password);
      login(data.user, data.access_token);
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));
      toast.success("Bienvenido");
      navigate("/");
    } catch (error) {
      if (error instanceof AxiosError)
        toast.error(error.response?.data.message);
    }
  };

  return { loginUser };
};
