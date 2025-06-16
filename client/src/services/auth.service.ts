import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  message: string;
}

class AuthService {
  private static instance: AuthService;
  private refreshTokenTimeout: ReturnType<typeof setTimeout> | null = null;

  private constructor() {
    this.setupAxiosInterceptors();
  }

  private setupAxiosInterceptors(): void {
    axios.interceptors.request.use(
      (config) => {
        const token = this.getAccessToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            await this.refreshToken();
            const token = this.getAccessToken();
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axios(originalRequest);
          } catch (refreshError) {
            this.logout();
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  public async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      const { accessToken, refreshToken, message } = response.data;
      
      if (!accessToken || !refreshToken) {
        throw new Error('Invalid response from server: missing tokens');
      }

      this.setTokens({ accessToken, refreshToken });
      return { accessToken, refreshToken, message: message || 'Login successful' };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Login failed');
      }
      throw error;
    }
  }

  public async register(name: string, email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, { name, email, password });
      const { accessToken, refreshToken, message } = response.data;
      
      if (!accessToken || !refreshToken) {
        throw new Error('Invalid response from server: missing tokens');
      }

      this.setTokens({ accessToken, refreshToken });
      return { accessToken, refreshToken, message: message || 'Registration successful' };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Registration failed');
      }
      throw error;
    }
  }

  public logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    this.stopRefreshTokenTimer();
  }

  public getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  private setTokens(tokens: { accessToken: string; refreshToken: string }): void {
    localStorage.setItem('accessToken', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);
    this.startRefreshTokenTimer();
  }

  private startRefreshTokenTimer(): void {
    const expires = this.getTokenExpiration();
    const timeout = expires.getTime() - Date.now() - (60 * 1000);
    this.refreshTokenTimeout = setTimeout(() => this.refreshToken(), timeout);
  }

  private stopRefreshTokenTimer(): void {
    if (this.refreshTokenTimeout) {
      clearTimeout(this.refreshTokenTimeout);
      this.refreshTokenTimeout = null;
    }
  }

  private getTokenExpiration(): Date {
    const token = this.getAccessToken();
    if (!token) return new Date(0);
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return new Date(payload.exp * 1000);
    } catch (error) {
      console.error('Error parsing token:', error);
      return new Date(0);
    }
  }

  private async refreshToken(): Promise<void> {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await axios.post(`${API_URL}/auth/refresh-token`, { refreshToken });
      const { accessToken, refreshToken: newRefreshToken } = response.data;
      
      if (!accessToken || !newRefreshToken) {
        throw new Error('Invalid response from server: missing tokens');
      }

      this.setTokens({ accessToken, refreshToken: newRefreshToken });
    } catch (error) {
      this.logout();
      throw error;
    }
  }
}

export const authService = AuthService.getInstance(); 