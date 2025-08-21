import { useState, useTransition } from "react";
import { useRegister } from "../hooks/useRegister";

export interface IFormRegister {
  username: string;
  password: string;
  name: string;
  confirmPassword: string;
}

const initialState: IFormRegister = {
  username: "",
  password: "",
  name: "",
  confirmPassword: "",
};

export default function FormRegister() {
  const [form, setForm] = useState<IFormRegister>(initialState);
  const [isPending, startTransition] = useTransition()

  const {registerUser} = useRegister()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }
    startTransition(async()=>{
        await registerUser({
            name: form.name,
            username: form.username,
            password: form.password,
        })
    })
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 flex flex-col gap-2 justify-center items-center border-gray-200 border rounded-md w-[400px]"
    >
      <h2 className="text-2xl font-semibold text-neutral-800 text-center">
        Registrate
      </h2>
      <label
        htmlFor="name"
        className="w-[90%] text-left text-sm font-semibold text-neutral-700"
      >
        Nombre:
      </label>
      <input
        type="text"
        name="name"
        id="name"
        placeholder="Ingresa tu nombre"
        value={form.name}
        onChange={handleChange}
        className="w-[90%] p-2 border border-gray-300 text-sm outline-none focus:border-2 focus:border-sky-500 transition-all rounded-md"
      />
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
      <label
        htmlFor="password"
        className="w-[90%] text-left text-sm font-semibold text-neutral-700"
      >
        Confirmar contraseña:
      </label>
      <input
        type="password"
        name="confirmPassword"
        id="confirmPassword"
        placeholder="Inserte la contraseña nuevamente"
        value={form.confirmPassword}
        onChange={handleChange}
        className="w-[90%] p-2 border border-gray-300 text-sm outline-none focus:border-2 focus:border-sky-500 transition-all rounded-md"
      />
      <button className="w-[90%] cursor-pointer p-2 text-sm font-semibold text-white rounded-md bg-sky-500 hover:bg-sky-600 transition-all"  disabled={isPending}>
        Registrame
      </button>
    </form>
  );
}
