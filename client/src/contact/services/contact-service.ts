import { apiClient } from "@/config/axios-config";

export interface ICreateContact {
  name: string;
  lastname: string;
  email: string;
  address: string;
  phone: string;
}

export const getAllContacts = async (token: string) =>
  await apiClient.get("/contact", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const createContact = async (body: ICreateContact, token: string) =>
  await apiClient.post("/contact", body, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const updateContact = async (
  id: number,
  body: ICreateContact,
  token: string
) =>
  await apiClient.put(`/contact/${id}`, body, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const deleteContact = async (id: number, token: string) =>
  await apiClient.delete(`/contact/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
