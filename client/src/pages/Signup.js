import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signup } from '../api';
import { useAuth } from '../authContext';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { token } = await signup(email, password);
      signIn(token);
      const role = JSON.parse(atob(token.split('.')[1])).role;
      navigate(`/${role}`);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <form onSubmit={handleSubmit} className="space-y-4 border p-6 rounded shadow">
        <h1 className="text-xl font-semibold">Signup</h1>
        <input className="border p-2 w-full" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
        <input className="border p-2 w-full" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
        <button className="bg-green-600 text-white px-4 py-2 rounded" type="submit">Sign Up</button>
      </form>
    </div>
  );
}
