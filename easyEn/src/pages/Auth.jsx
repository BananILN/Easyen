import React, { useState, useContext } from 'react';
import { LockOutlined, UserOutlined, MailOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input, Flex, message } from 'antd';
import { NavLink, Navigate } from 'react-router';
import { LOGIN_ROUTE, REGISTRATION_ROUTE, PROFILE_ROUTE, HOME_ROUTE } from '../index'; // Исправленный импорт
import { AuthContext } from '../context/AuthContext'; // Импортируем AuthContext
import './Auth.css'; // Импортируем CSS для стилизации

const Auth = () => {
  const [isLoginForm, setIsLoginForm] = useState(true); // Состояние для переключения между формами
  const { isAuth, login } = useContext(AuthContext); // Получаем методы и состояние из AuthContext

  const onFinish = (values) => {
    console.log('Received values of form: ', values);

    if (isLoginForm) {
      // Логика авторизации
      login(); // Вызываем метод login из AuthContext
      message.success('Вы успешно авторизовались!');
    } else {
      // Логика регистрации
      message.success('Вы успешно зарегистрировались!');
      setIsLoginForm(true); // Переключаем на форму авторизации после регистрации
    }
  };

  // Переключение между формами
  const toggleForm = () => {
    setIsLoginForm((prev) => !prev);
  };

  // Если пользователь авторизован, перенаправляем на главную страницу
  if (isAuth) {
    return <Navigate to={HOME_ROUTE} replace />;
  }

  return (
    <div>
      <h1>{isLoginForm ? 'Вход' : 'Регистрация'}</h1>
      <Form
        name={isLoginForm ? 'login' : 'register'}
        initialValues={{
          remember: true,
        }}
        style={{
          maxWidth: 360,
          margin: '0 auto', // Центрируем форму
        }}
        onFinish={onFinish}
      >
        {!isLoginForm && ( // Поле username только для регистрации
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: 'Пожалуйста, введите ваш логин!',
              },
            ]}
          >
            <Input
              prefix={<UserOutlined style={{ color: '#1890ff' }} />} // Темно-синий цвет иконки
              placeholder="Логин"
              className="custom-input" // Добавляем класс для стилизации плейсхолдера
            />
          </Form.Item>
        )}
        <Form.Item
          name="email"
          rules={[
            {
              required: true,
              message: 'Пожалуйста, введите ваш Email!',
            },
            {
              type: 'email',
              message: 'Пожалуйста, введите корректный email!',
            },
          ]}
        >
          <Input
            prefix={<MailOutlined style={{ color: '#1890ff' }} />} // Темно-синий цвет иконки
            placeholder="Email"
            className="custom-input" // Добавляем класс для стилизации плейсхолдера
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: 'Пожалуйста, введите ваш пароль!',
            },
            {
              min: 6,
              message: 'Пароль должен содержать минимум 6 символов!',
            },
          ]}
        >
          <Input
            prefix={<LockOutlined style={{ color: '#1890ff' }} />} // Темно-синий цвет иконки
            type="password"
            placeholder="Пароль"
            className="custom-input" // Добавляем класс для стилизации плейсхолдера
          />
        </Form.Item>
        {isLoginForm && ( // Чекбокс "Remember me" только для авторизации
          <Form.Item>
            <Flex justify="space-between" align="center">
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Запомнить меня</Checkbox>
              </Form.Item>
              <a href="">Забыли пароль?</a>
            </Flex>
          </Form.Item>
        )}

        <Form.Item>
          <Button block type="primary" htmlType="submit">
            {isLoginForm ? 'Войти' : 'Зарегистрироваться'}
          </Button>
          {isLoginForm ? (
            <div style={{ textAlign: 'center', marginTop: '10px' }}>
              Нет аккаунта?{' '}
              <NavLink to={REGISTRATION_ROUTE} onClick={toggleForm}>
                Зарегистрируйтесь
              </NavLink>
            </div>
          ) : (
            <div style={{ textAlign: 'center', marginTop: '10px' }}>
              Уже есть аккаунт?{' '}
              <NavLink to={LOGIN_ROUTE} onClick={toggleForm}>
                Войдите
              </NavLink>
            </div>
          )}
        </Form.Item>
      </Form>
    </div>
  );
};

export default Auth;