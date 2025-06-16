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
    // Private constructor for singleton
    this.setupAxiosInterceptors();
  }

  private setupAxiosInterceptors(): void {
    // Add a request interceptor
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

    // Add a response interceptor
    axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // If the error is 401 and we haven't tried to refresh the token yet
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            await this.refreshToken();
            const token = this.getAccessToken();
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axios(originalRequest);
          } catch (refreshError) {
            this.logout();
            window.location.href = '/';
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
    const response = await axios.post(`${API_URL}/auth/login`, { email, password });
    console.log('Login response:', response.data);
    if (response.data.accessToken) {
      this.setTokens(response.data);
    }
    return response.data;
  }

  public async register(name: string, email: string, password: string): Promise<AuthResponse> {
    const response = await axios.post(`${API_URL}/auth/register`, { name, email, password });
    if (response.data.accessToken) {
      this.setTokens(response.data);
    }
    return response.data;
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
    console.log('Setting tokens:', tokens);
    localStorage.setItem('accessToken', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);
    console.log('Tokens stored in localStorage:', {
      accessToken: localStorage.getItem('accessToken'),
      refreshToken: localStorage.getItem('refreshToken')
    });
    this.startRefreshTokenTimer();
  }

  private startRefreshTokenTimer(): void {
    const expires = this.getTokenExpiration();
    const timeout = expires.getTime() - Date.now() - (60 * 1000); // Refresh 1 minute before expiry
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
    
    const payload = JSON.parse(atob(token.split('.')[1]));
    return new Date(payload.exp * 1000);
  }

  private async refreshToken(): Promise<void> {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) return;

    try {
      const response = await axios.post(`${API_URL}/auth/refresh-token`, { refreshToken });
      this.setTokens(response.data);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('Token refresh failed:', errorMessage);
      this.logout();
      window.location.href = '/';
    }
  }
}

export const authService = AuthService.getInstance(); 