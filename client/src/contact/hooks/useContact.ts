import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  createContact,
  deleteContact,
  getAllContacts,
  updateContact,
  type ICreateContact,
} from "../services/contact-service";
import { useAppContext } from "@/context/useAppContext";

export interface IContactEntity {
  id: number;
  name: string;
  lastname: string;
  email: string;
  phone: string;
  address: string;
  userId: number;
  createdAt: Date;
}

export const useContact = () => {
  const [contacts, setContacts] = useState<IContactEntity[]>([]);

  const { token } = useAppContext();

  useEffect(() => {
    getContacts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getContacts = async () => {
    try {
      const { data } = await getAllContacts(token);
      setContacts(data);
    } catch (error) {
      if (error instanceof AxiosError)
        toast.error(error.response?.data.message);
    }
  };

  const generateContact = async (body: ICreateContact) => {
    try {
      await createContact(body, token);
      toast.success("Contacto creado");
      await getContacts();
    } catch (error) {
      if (error instanceof AxiosError)
        toast.error(error.response?.data.message);
    }
  };

  const modifyContact = async (id: number, body: ICreateContact) => {
    try {
      await updateContact(id, body, token);
      toast.success("Contacto editado");
      await getContacts();
    } catch (error) {
      if (error instanceof AxiosError)
        toast.error(error.response?.data.message);
    }
  };

  const removeContact = async (id: number) => {
    try {
      await deleteContact(id, token);
      toast.success("Contacto eliminado");
      await getContacts();
    } catch (error) {
      if (error instanceof AxiosError)
        toast.error(error.response?.data.message);
    }
  };

  return { contacts, generateContact, modifyContact, removeContact };
};
