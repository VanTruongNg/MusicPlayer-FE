"use client";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";

const AuthPage = () => {
  const router = useRouter();
  const { login, fetchUserData, isLoggedIn, user, signup } = useAuthStore();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    username: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({
      email: "",
      password: "",
      username: "",
      confirmPassword: "",
    });

    if (isLogin) {
      try {
        await login(formData.email, formData.password);
        // Kiểm tra isLoggedIn sau khi login
        if (useAuthStore.getState().isLoggedIn) {
          await fetchUserData();
          router.push("/");
        } else {
          setErrors((prev) => ({
            ...prev,
            password: "Email hoặc mật khẩu không chính xác",
          }));
        }
      } catch (error) {
        setErrors((prev) => ({
          ...prev,
          password: "Có lỗi xảy ra, vui lòng thử lại sau",
        }));
      }
    } else {
      // Xử lý đăng ký ở đây
      if (formData.password !== formData.confirmPassword) {
        setErrors((prev) => ({
          ...prev,
          confirmPassword: "Mật khẩu xác nhận không khớp",
        }));
        setIsLoading(false);
        return;
      }

      try {
        const result = await signup({
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          username: formData.username,
        });

        if (result.success) {
          alert(
            result.message ||
              "Đăng ký thành công! Vui lòng kiểm tra email để xác thực."
          );
          setIsLogin(true);
          setFormData({
            email: "",
            password: "",
            username: "",
            confirmPassword: "",
          });
        } else {
          setErrors((prev) => ({
            ...prev,
            password: result.message || "Đăng ký không thành công",
          }));
        }
      } catch (error) {
        setErrors((prev) => ({
          ...prev,
          password: "Có lỗi xảy ra, vui lòng thử lại sau",
        }));
      }
    }

    setIsLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Container>
      <FormWrapper>
        <Title>{isLogin ? "Đăng nhập" : "Đăng ký"}</Title>
        <Form onSubmit={handleSubmit}>
          {!isLogin && (
            <InputGroup>
              <Input
                type="text"
                name="username"
                placeholder="Tên người dùng"
                value={formData.username}
                onChange={handleChange}
                hasError={!!errors.username}
              />
              {errors.username && (
                <ErrorMessage>{errors.username}</ErrorMessage>
              )}
            </InputGroup>
          )}

          <InputGroup>
            <Input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              hasError={!!errors.email}
            />
            {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
          </InputGroup>

          <InputGroup>
            <Input
              type="password"
              name="password"
              placeholder="Mật khẩu"
              value={formData.password}
              onChange={handleChange}
              hasError={!!errors.password}
            />
            {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}
          </InputGroup>

          {!isLogin && (
            <InputGroup>
              <Input
                type="password"
                name="confirmPassword"
                placeholder="Xác nhận mật khẩu"
                value={formData.confirmPassword}
                onChange={handleChange}
                hasError={!!errors.confirmPassword}
              />
              {errors.confirmPassword && (
                <ErrorMessage>{errors.confirmPassword}</ErrorMessage>
              )}
            </InputGroup>
          )}

          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Đang xử lý..." : isLogin ? "Đăng nhập" : "Đăng ký"}
          </Button>
        </Form>
        <SwitchText>
          {isLogin ? "Chưa có tài khoản?" : "Đã có tài khoản?"}
          <SwitchButton onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Đăng ký" : "Đăng nhập"}
          </SwitchButton>
        </SwitchText>
      </FormWrapper>
    </Container>
  );
};

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const ErrorMessage = styled.span`
  color: #dc3545;
  font-size: 0.875rem;
`;

const Input = styled.input<{ hasError?: boolean }>`
  padding: 0.8rem;
  border: 1px solid ${(props) => (props.hasError ? "#dc3545" : "#ddd")};
  border-radius: 4px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: ${(props) => (props.hasError ? "#dc3545" : "#007bff")};
  }
`;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
`;

const FormWrapper = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
`;

const Title = styled.h1`
  text-align: center;
  color: #333;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Button = styled.button`
  padding: 0.8rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #0056b3;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const SwitchText = styled.p`
  text-align: center;
  margin-top: 1rem;
  color: #666;
`;

const SwitchButton = styled.span`
  color: #007bff;
  margin-left: 0.5rem;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

export default AuthPage;
