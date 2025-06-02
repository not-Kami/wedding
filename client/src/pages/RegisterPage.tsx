import React, { useState } from 'react';
import { useNavigate } from 'react-router';


const RegisterPage: React.FC = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }
        console.log('Registration data:', { name,  email, password });
        // Add your registration logic here
        // After successful registration:
        // navigate('/login');
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', width: '300px' }}>
                <h2>Register</h2>
                <label htmlFor="name">Name:</label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />

           

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

                <label htmlFor="confirmPassword">Confirm Password:</label>
                <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />

                <button type="submit" style={{ marginTop: '20px' }}>Register</button>
                
                <p style={{ textAlign: 'center', marginTop: '10px' }}>
                    Already have an account? 
                    <span 
                        onClick={() => navigate('/')} 
                        style={{ color: 'blue', cursor: 'pointer', marginLeft: '5px' }}
                    >
                        Login here
                    </span>
                </p>
            </form>
        </div>
    );
};

export default RegisterPage;