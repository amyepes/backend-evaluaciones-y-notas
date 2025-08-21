import { apiClient } from "../../config/axios-config";

export interface IRegisterBody{
    name: string
    username: string
    password: string
}

export const loginMethod = async (username: string, password: string) => 
    await apiClient.post("/auth/login", { username, password });

export const registerMethod = async (body: IRegisterBody) =>
    await apiClient.post("/auth/register", body);