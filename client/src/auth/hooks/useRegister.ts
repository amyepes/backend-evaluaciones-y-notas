import { useNavigate } from "react-router";
import { registerMethod, type IRegisterBody } from "../services/auth-service";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

export const useRegister = () => {
  const navigate = useNavigate();
  const registerUser = async (body: IRegisterBody) => {
    try {
      await registerMethod(body);
      toast.success("Usuario registrado")
      navigate("/login");
    } catch (error) {
      if (error instanceof AxiosError) toast.error(error.response?.data.message);
    }
  };

  return { registerUser };
};
