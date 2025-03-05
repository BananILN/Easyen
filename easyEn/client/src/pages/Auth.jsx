import React, { useState, useContext } from 'react';
import { LockOutlined, UserOutlined, MailOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input, Flex, message } from 'antd';
import { NavLink, Navigate } from 'react-router';
import { LOGIN_ROUTE, REGISTRATION_ROUTE, PROFILE_ROUTE, HOME_ROUTE } from '../index'; 
import { AuthContext } from '../context/AuthContext'; 
import './Auth.css'; 
import { registrationAuth, loginAuth } from '../http/userApi';

const Auth = () => {
  const [isLoginForm, setIsLoginForm] = useState(true); 
  const { isAuth, login } = useContext(AuthContext); 
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handlerAuth = async () => {
    try {
      let response;
      if (isLoginForm) {
     
        response = await loginAuth(email, password);
        console.log("Ответ при входе:", response);
        login(); 
        message.success('Вы успешно авторизовались!');
      } else {
       
        response = await registrationAuth(email, username, password);
        console.log("Ответ при регистрации:", response);
        message.success('Вы успешно зарегистрировались!');
        setIsLoginForm(true); 
      }
    } catch (error) {
      console.error("Ошибка при авторизации/регистрации:", error);
      if (error.response && error.response.data.message) {
        message.error(error.response.data.message); 
      } else {
        message.error('Произошла ошибка. Пожалуйста, попробуйте снова.');
      }
    }
  };

 const onFinish = (values) => {
    console.log('Received values of form: ', values);
    
    setEmail(values.email);
    setPassword(values.password);
    if (!isLoginForm) {
      setUsername(values.username);
    }

    handlerAuth();
  };

 
  const toggleForm = () => {
    setIsLoginForm((prev) => !prev);
  };


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
          margin: '0 auto', 
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
              prefix={<UserOutlined style={{ color: '#1890ff' }} />} 
              placeholder="Логин"
              className="custom-input"
              value={username}
              onChange={e => setUsername(e.target.value)} 
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
            prefix={<MailOutlined style={{ color: '#1890ff' }} />} 
            placeholder="Email"
            className="custom-input"
            value={email}
            onChange={e => setEmail(e.target.value)}
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
            prefix={<LockOutlined style={{ color: '#1890ff' }} />} 
            type="password"
            placeholder="Пароль"
            className="custom-input" 
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </Form.Item>
        {isLoginForm && ( 
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