import React, { useState } from 'react';
import { useNavigate } from 'react-router';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

   const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setError('');
        
        try {
            const response = await fetch('http://localhost:3000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                // Stocker le token dans localStorage
                localStorage.setItem('token', data.token);
                // Rediriger vers le dashboard
                navigate('/dashboard');
            } else {
                setError(data.message || 'Login failed');
            }
        } catch (err) {
            setError('An error occurred during login');
            console.error('Login error:', err);
        }
    };

    

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', width: '300px' }}>
                <h2>Login</h2>
                {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
                <label htmlFor="email">Email:</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <label htmlFor="password">Password:</label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit" style={{ marginTop: '20px' }}>Login</button>
                  <div style={{ marginTop: '20px' }}>
                  <p>Don't have an account? <a href="/register">Register here</a></p>
                  </div>
            
            </form>
          
        </div>
    );
};

export default LoginPage;