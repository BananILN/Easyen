import React, { useState, useContext, useEffect, useRef } from "react";
import { LockOutlined, UserOutlined, MailOutlined, EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Input, Flex, message } from "antd";
import { NavLink, Navigate } from "react-router";
import { LOGIN_ROUTE, REGISTRATION_ROUTE, HOME_ROUTE } from "../index";
import { AuthContext } from "../context/AuthContext";
import { UserContext } from "../context/UserContext";
import "./Auth.css";
import { registrationAuth, loginAuth, verifyEmail, resendCode } from "../http/userApi";

const Auth = () => {
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [isVerificationStep, setIsVerificationStep] = useState(false);
  const { isAuth, login } = useContext(AuthContext);
  const { setUser } = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState(new Array(6).fill(""));
  const [tempToken, setTempToken] = useState(null);
  const [timer, setTimer] = useState(600);
  const [canResend, setCanResend] = useState(false);
  const [showPassword, setShowPassword] = useState(false); 
  const codeInputs = useRef([]);

  useEffect(() => {
    if (isVerificationStep && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isVerificationStep, timer]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleAuth = async () => {
    try {
      let response;
      if (isLoginForm) {
        response = await loginAuth(email, password);
        login(response);
        localStorage.setItem("userId", response.UserID);
        setUser(response);
        message.success("Вы успешно авторизовались!");
      } else {
        response = await registrationAuth(email, username, password);
        setTempToken(response.tempToken);
        setIsVerificationStep(true);
        setTimer(600); 
        setCanResend(false);
        message.success(response.message);
      }
    } catch (error) {
      message.error(error.response?.data?.message || "Произошла ошибка. Пожалуйста, попробуйте снова.");
    }
  };

  const handleVerify = async () => {
    try {
      const verificationCode = code.join("");
      const response = await verifyEmail(tempToken, verificationCode);
      login(response);
      localStorage.setItem("userId", response.UserID);
      setUser(response);
      message.success("Email успешно подтверждён!");
      setIsVerificationStep(false);
    } catch (error) {
      message.error(error.response?.data?.message || "Ошибка подтверждения. Попробуйте снова.");
    }
  };

  const handleResendCode = async () => {
    try {
      const response = await resendCode(tempToken);
      setTimer(300);
      setCanResend(false);
      message.success(response.message);
      setCode(new Array(6).fill(""));
      codeInputs.current[0]?.focus();
    } catch (error) {
      message.error(error.response?.data?.message || "Ошибка повторной отправки кода");
    }
  };

  const onFinish = (values) => {
    setEmail(values.email);
    setPassword(values.password);
    if (!isLoginForm) {
      setUsername(values.username);
    }
    if (!isVerificationStep) {
      handleAuth();
    } else {
      handleVerify();
    }
  };

  const toggleForm = () => {
    setIsLoginForm((prev) => !prev);
    setIsVerificationStep(false);
  };

  const handleCodeChange = (value, index) => {
    if (!/^[0-9]*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      codeInputs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      codeInputs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const pastedData = e.clipboardData.getData("text").trim();
    if (/^\d{6}$/.test(pastedData)) {
      const newCode = pastedData.split("");
      setCode(newCode);
      codeInputs.current[5]?.focus();
    }
  };

  if (isAuth) {
    return <Navigate to={HOME_ROUTE} replace />;
  }

  return (
    <div className="Auth-container">
      <h1>{isLoginForm ? "Вход" : isVerificationStep ? "Подтверждение email" : "Регистрация"}</h1>
      <Form
        name={isLoginForm ? "login" : "register"}
        initialValues={{ remember: true }}
        style={{ maxWidth: 360, margin: "0 auto" }}
        onFinish={onFinish}
      >
        {!isVerificationStep ? (
          <>
            {!isLoginForm && (
              <Form.Item
                name="username"
                rules={[{ required: true, message: "Пожалуйста, введите ваш логин!" }]}
              >
                <Input
                  prefix={<UserOutlined style={{ color: "#1890ff" }} />}
                  placeholder="Логин"
                  className="custom-input"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </Form.Item>
            )}
            <Form.Item
              name="email"
              rules={[
                { required: true, message: "Пожалуйста, введите ваш Email!" },
                { type: "email", message: "Пожалуйста, введите корректный email!" },
              ]}
            >
              <Input
                prefix={<MailOutlined style={{ color: "#1890ff" }} />}
                placeholder="Email"
                className="custom-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Пожалуйста, введите ваш пароль!" },
                { min: 6, message: "Пароль должен содержать минимум 6 символов!" },
              ]}
            >
              <Input
                prefix={<LockOutlined style={{ color: "#1890ff" }} />}
                suffix={
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="password-toggle-icon"
                  >
                    {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                  </span>
                }
                type={showPassword ? "text" : "password"}
                placeholder="Пароль"
                className="custom-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Item>
          </>
        ) : (
          <>
            <p className="verification-message">
              Код подтверждения отправлен на <strong>{email}</strong>
            </p>
            <p className="timer-text">
              Оставшееся время: <span>{formatTime(timer)}</span>
            </p>
            <Form.Item className="code-input-container">
              <div className="code-inputs" onPaste={handlePaste}>
                {code.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleCodeChange(e.target.value, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    ref={(el) => (codeInputs.current[index] = el)}
                    className="code-input"
                  />
                ))}
              </div>
            </Form.Item>
            {canResend && (
              <Form.Item>
                <Button type="link" onClick={handleResendCode} className="resend-button">
                  Отправить код повторно
                </Button>
              </Form.Item>
            )}
          </>
        )}

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
          <Button block type="primary" htmlType="submit" className="auth-button">
            {isLoginForm ? "Войти" : isVerificationStep ? "Подтвердить" : "Зарегистрироваться"}
          </Button>
          {isLoginForm ? (
            <div style={{ textAlign: "center", marginTop: "10px" }}>
              Нет аккаунта?{" "}
              <NavLink to={REGISTRATION_ROUTE} onClick={toggleForm}>
                Зарегистрируйтесь
              </NavLink>
            </div>
          ) : (
            !isVerificationStep && (
              <div style={{ textAlign: "center", marginTop: "10px" }}>
                Уже есть аккаунт?{" "}
                <NavLink to={LOGIN_ROUTE} onClick={toggleForm}>
                  Войдите
                </NavLink>
              </div>
            )
          )}
        </Form.Item>
      </Form>
    </div>
  );
};

export default Auth;