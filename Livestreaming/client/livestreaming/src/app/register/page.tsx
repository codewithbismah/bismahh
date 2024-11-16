"use client";

import { useState } from "react";
import axios from "axios";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation } from "@tanstack/react-query";
import { registerstore } from "../store/registerstore";
import { EyeIcon, EyeOffIcon } from "lucide-react";

interface RegisterFormData {
  username: string;
  email: string;
  password: string;
}

const Register: React.FC = () => {
  const { formData, setFormData, resetForm } = registerstore();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const mutation = useMutation({
    mutationFn: async (data: RegisterFormData) => {
      const response = await axios.post(
        "http://localhost:3000/v1/registration/register",
        data
      );
      return response.data;
    },
    onSuccess: () => {
      setSuccess("Registration successful!");
      resetForm();
    },
    onError: (error: any) => {
      setError(
        error.response?.data?.message ||
          "An error occurred during registration."
      );
      console.error(error);
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    mutation.mutate(formData);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-2xl font-bold text-center">Registration Form</h2>
        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}

        <div>
          <Label htmlFor="username">Username</Label>
          <Input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            placeholder="Enter your Username"
          />
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Enter your email"
          />
        </div>

        <div className="relative">
          <Label htmlFor="password">Password</Label>
          <Input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="Enter your password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 top:23px right-0 pr-3 flex items-center"
            style={{ top: "23px" }}
          >
            {formData.password ? (
              <EyeOffIcon className="h-4 w-4 text-gray-500" />
            ) : (
              <EyeIcon className="h-4 w-4 text-gray-500" />
            )}
          </button>
        </div>

        <Button type="submit" className="w-full">
          Register
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
