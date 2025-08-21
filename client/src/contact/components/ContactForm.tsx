import React, { useState, useTransition } from "react";
import type { ICreateContact } from "../services/contact-service";

interface IContactForm {
  name: string;
  lastname: string;
  address: string;
  phone: string;
  email: string;
}

type Props = {
  id?: number;
  isEditing: boolean;
  initialState: IContactForm;
  save: (isEditing: boolean, id: number, body: ICreateContact) => void;
  onClose?: ()=> void
};

export default function ContactForm({
  id = 0,
  isEditing,
  initialState,
  save,
  onClose = ()=> console.log("")
}: Props) {
  const [form, setForm] = useState<IContactForm>(initialState);
  const [isPeding, startTransition] = useTransition();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      await save(isEditing, id, form);
      if (!isEditing) setForm(initialState);
      else onClose()
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 flex flex-col gap-2 justify-center items-center"
    >
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
        placeholder="Inserte el nombre"
        value={form.name}
        onChange={handleChange}
        className="w-[90%] p-2 border border-gray-300 text-sm outline-none focus:border-2 focus:border-sky-500 transition-all rounded-md"
        required
      />
      <label
        htmlFor="lastname"
        className="w-[90%] text-left text-sm font-semibold text-neutral-700"
      >
        Apellido:
      </label>
      <input
        type="text"
        name="lastname"
        id="lastname"
        placeholder="Inserte el apellido"
        value={form.lastname}
        onChange={handleChange}
        className="w-[90%] p-2 border border-gray-300 text-sm outline-none focus:border-2 focus:border-sky-500 transition-all rounded-md"
        required
      />
      <label
        htmlFor="phone"
        className="w-[90%] text-left text-sm font-semibold text-neutral-700"
      >
        Teléfono:
      </label>
      <input
        type="text"
        name="phone"
        id="phone"
        placeholder="Inserte el teléfono"
        value={form.phone}
        onChange={handleChange}
        className="w-[90%] p-2 border border-gray-300 text-sm outline-none focus:border-2 focus:border-sky-500 transition-all rounded-md"
        required
      />
      <label
        htmlFor="email"
        className="w-[90%] text-left text-sm font-semibold text-neutral-700"
      >
        Email:
      </label>
      <input
        type="text"
        name="email"
        id="email"
        placeholder="Inserte el correo"
        value={form.email}
        onChange={handleChange}
        className="w-[90%] p-2 border border-gray-300 text-sm outline-none focus:border-2 focus:border-sky-500 transition-all rounded-md"
        required
      />
      <label
        htmlFor="address"
        className="w-[90%] text-left text-sm font-semibold text-neutral-700"
      >
        Dirección:
      </label>
      <input
        type="text"
        name="address"
        id="address"
        placeholder="Inserte la dirección"
        value={form.address}
        onChange={handleChange}
        className="w-[90%] p-2 border border-gray-300 text-sm outline-none focus:border-2 focus:border-sky-500 transition-all rounded-md"
        required
      />
      <button
        className="w-[90%] cursor-pointer p-2 text-sm font-semibold text-white rounded-md bg-sky-500 hover:bg-sky-600 transition-all"
        disabled={isPeding}
      >
        Guardar
      </button>
    </form>
  );
}
