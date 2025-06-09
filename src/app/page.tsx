'use client';

import { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import SERVER_URL from '@/conf';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Page = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      interface AuthResponse {
        token: string;
        refreshToken: string;
        id: string | number;
        [key: string]: any;
      }

      const response = await axios.post<AuthResponse>(`${SERVER_URL}/auth`, {
        username: username,
        password: password,
      });
      console.log('Ответ сервера:', response.data);

      if (response.status === 200) {
        const tokenJWT = response.data.token;
        const tokenRefresh = response.data.refreshToken;
        let id = response.data.id;

        console.log(' id:', id);
        console.log('JWT Token:', tokenJWT);
        console.log('Ref Token:', tokenRefresh);

        Cookies.set('token', tokenJWT, { expires: 1, sameSite: 'Strict' });
        localStorage.setItem("refreshToken", tokenRefresh);

        router.push('/pages/offers');
      }
    } catch (error) {
      console.error('Ошибка авторизации:', error);
    }
  };

  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      console.error('Пароли не совпадают');
      return;
    }
    try {
      const response = await axios.post(`${SERVER_URL}/reg`, {
        username,
        password,
      });

      if (response.status === 200) {
        setIsLogin(true);
      }
    } catch (error) {
      console.error('Ошибка регистрации:', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-paleOlive">
      <div className="w-full max-w-xs ">
        <label className=" block text-darkGray text-xl font-bold mb-2">
          Личный кабинет Crypto Bank
        </label>
        <div className="bg-deepMossGreen shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="mb-4">
            <label className="block text-lightGray text-m font-bold mb-2" htmlFor="username">
              Логин
            </label>
            <input
              className="bg-paleOlive shadow appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="username"
              type="text"
              placeholder="Логин"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-lightGray text-m font-bold mb-2" htmlFor="password">
              Пароль
            </label>
            <div className="relative">
              <input
                className="bg-paleOlive shadow appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 px-3 py-2 text-sm text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEye size={17} /> : <FaEyeSlash size={17} />}
              </button>
            </div>
          </div>
          {!isLogin && (
            <div className="mb-4">
              <label className="block text-lightGray text-m font-bold mb-2" htmlFor="confirmPassword">
                Повторите пароль
              </label>
              <div className="relative">
                <input
                  className="shadow appearance-none bg-paleOlive rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Повторите пароль"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 px-3 py-2 text-sm text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEye size={17} /> : <FaEyeSlash size={17} />}
                </button>
              </div>
            </div>
          )}
          <div className="flex items-center justify-between">
            <button
              className="bg-charcoalGreen hover:bg-charcoalBlue text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
              onClick={(e) => {
                e.preventDefault();
                if (isLogin) {
                  handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
                } else {
                  handleRegister(e as unknown as React.FormEvent<HTMLFormElement>);
                }
              }}
            >
              {isLogin ? 'Войти' : 'Зарегистрироваться'}
            </button>
            
          </div>
        </div>
        <button
          className="w-full bg-charcoalGreen hover:bg-charcoalBlue text-lightGray font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? 'Нет аккаунта? - Регистрация' : 'Уже зарегистрированы? - Вход'}
        </button>
      </div>
    </div>
  );
};

export default Page;