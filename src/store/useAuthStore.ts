import { axiosInstance } from "@/utils"
import { create } from "zustand"
import { persist } from 'zustand/middleware'

export type User = {
    id: string,
    username: string,
    email: string,
    avatarUrl?: string
    role: "admin" | "listener"
}

type SignUpData = {
    email: string;
    password: string;
    username: string;
    confirmPassword: string;
}

type UserState = {
    user: User | null,
    isLoggedIn: boolean,
}

type UserAction = {
    login: (username: string, password: string) => Promise<void>,
    fetchUserData: () => Promise<void>,
    logout: () => Promise<void>;
    signup: (data: SignUpData) => Promise<{ success: boolean, message?: string }>,
}

export const useAuthStore = create(
    persist<UserState & UserAction>(
        (set) => ({
            user: null,
            isLoggedIn: false,
            login: async (email, password) => {
                try {
                    const response = await axiosInstance.post('/auth/signin', {
                        email, password
                    }, { withCredentials: true });

                    if (response.status === 200 && response.status < 300) {
                        set({ isLoggedIn: true });
                    }
                } catch (error) {
                    console.error("Đăng nhập thất bại!", error);
                }
            },
            fetchUserData: async () => {
                try {
                    const response = await axiosInstance.get('/user/me', { withCredentials: true });
                    set({ user: response.data });
                } catch (error) {
                    console.error("Không thể lấy thông tin người dùng:", error);
                }
            },
            logout: async () => {
                try {
                    const response = await axiosInstance.post('/auth/logout', {}, { withCredentials: true });
                    if (response.status === 201) {
                        set({ user: null, isLoggedIn: false });
                    }
                } catch (error) {
                    console.error("Đăng xuất thất bại!", error);
                }
            },
            signup: async (data: SignUpData) => {
                try {
                    const response = await axiosInstance.post('/auth/signup', {
                        email: data.email,
                        password: data.password,
                        confirmPassword: data.confirmPassword,
                        username: data.username
                    });

                    if (response.status === 201 || response.status === 200) {
                        return { 
                            success: true, 
                            message: response.data.message 
                        };
                    }
                    return { 
                        success: false, 
                        message: 'Đăng ký không thành công' 
                    };
                } catch (error: any) {
                    console.error("Đăng ký thất bại!", error);
                    return { 
                        success: false, 
                        message: error.response?.data?.message || 'Đăng ký không thành công'
                    };
                }
            },
        }),
        {
            name: "auth-store",
        }
    )
);