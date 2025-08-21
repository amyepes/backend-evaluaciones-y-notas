import { apiClient } from "@/config/axios-config";

export interface User {
  id: number;
  name: string;
  username: string;
  role: string;
  createdAt: string;
  _count?: {
    subjects: number;
    studentSubject: number;
    califications: number;
  };
}

export interface CreateUserDto {
  name: string;
  username: string;
  password: string;
  role?: string;
}

export interface UpdateUserDto {
  name?: string;
  username?: string;
  password?: string;
  role?: string;
}

export interface UserQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
}

export interface UsersResponse {
  users: User[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface UserStats {
  total: number;
  byRole: {
    admin: number;
    professor: number;
    student: number;
  };
}

class UserService {
  private getAuthHeaders() {
    const token = localStorage.getItem("token");
    return {
      Authorization: `Bearer ${token}`,
    };
  }

  async getAllUsers(params: UserQueryParams = {}): Promise<UsersResponse> {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.search) queryParams.append('search', params.search);
    if (params.role) queryParams.append('role', params.role);

    const response = await apiClient.get(`/admin/users?${queryParams.toString()}`, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  async getUserById(id: number): Promise<User> {
    const response = await apiClient.get(`/admin/users/${id}`, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  async createUser(userData: CreateUserDto): Promise<User> {
    const response = await apiClient.post("/admin/users", userData, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  async updateUser(id: number, userData: UpdateUserDto): Promise<User> {
    const response = await apiClient.put(`/admin/users/${id}`, userData, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  async deleteUser(id: number): Promise<{ message: string }> {
    const response = await apiClient.delete(`/admin/users/${id}`, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  async getUserStats(): Promise<UserStats> {
    const response = await apiClient.get("/admin/users/stats/overview", {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  async getUsersByRole(role: string): Promise<User[]> {
    const response = await apiClient.get(`/admin/users/by-role/${role}`, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  async changeUserPassword(id: number, password: string): Promise<{ message: string }> {
    const response = await apiClient.patch(`/admin/users/${id}/password`, 
      { password }, 
      {
        headers: this.getAuthHeaders(),
      }
    );
    return response.data;
  }
}

export const userService = new UserService();
