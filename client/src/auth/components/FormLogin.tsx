import { useState, useTransition } from "react";
import { useLogin } from "../hooks/useLogin";
import { Link } from "react-router";

interface IFormLogin {
  username: string;
  password: string;
}

const initialState: IFormLogin = {
  username: "",
  password: "",
};

export default function FormLogin() {
  const [form, setForm] = useState<IFormLogin>(initialState);
  const [isPending, startTransition] = useTransition();

  const { loginUser } = useLogin();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    startTransition(async () => {
      await loginUser(form.username, form.password);
      setForm(initialState);
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 flex flex-col gap-2 justify-center items-center border-gray-200 border rounded-md w-[400px]"
    >
      <h2 className="text-2xl font-semibold text-neutral-800 text-center">
        Inicio Sesión
      </h2>
      <label
        htmlFor="username"
        className="w-[90%] text-left text-sm font-semibold text-neutral-700"
      >
        Username:
      </label>
      <input
        type="text"
        name="username"
        id="username"
        placeholder="Inserte el nombre de usuario"
        value={form.username}
        onChange={handleChange}
        className="w-[90%] p-2 border border-gray-300 text-sm outline-none focus:border-2 focus:border-sky-500 transition-all rounded-md"
      />
      <label
        htmlFor="password"
        className="w-[90%] text-left text-sm font-semibold text-neutral-700"
      >
        Contraseña:
      </label>
      <input
        type="password"
        name="password"
        id="password"
        placeholder="Inserte la contraseña"
        value={form.password}
        onChange={handleChange}
        className="w-[90%] p-2 border border-gray-300 text-sm outline-none focus:border-2 focus:border-sky-500 transition-all rounded-md"
      />
      <button
        className="w-[90%] cursor-pointer p-2 text-sm font-semibold text-white rounded-md bg-sky-500 hover:bg-sky-600 transition-all"
        disabled={isPending}
      >
        Iniciar Sesión
      </button>
      <Link
        to="/register"
        className="mt-2 text-xs font-semibold text-sky-500 cursor-pointer hover:underline transition-all"
      >
        ¿No tienes una cuenta? Create una ahora!
      </Link>
    </form>
  );
}
