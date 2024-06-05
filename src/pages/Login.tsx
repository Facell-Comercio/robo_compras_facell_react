import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

import iconFacell from "@/assets/images/facell-192x192.png";
import ErrorAlert from "@/components/ui/error-alert";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/context/auth-store";
import { useState } from "react";
import { api } from "@/helper/api";
import { FaSpinner } from "react-icons/fa6";

const formSchema = z.object({
  email: z.string(),
  senha: z.string().min(6, {
    message: "Senha precisa conter no mínimo 6 caracteres.",
  }),
});

const useLogin = () => {
  const login = useAuthStore(state => state.login);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  const handleSubmit = async ({ email, senha }: { email: string, senha: string }) => {
    setLoginLoading(true);
    setLoginError('');

    try {
      localStorage.setItem('email', email)
      const { data } = await api.post('/auth/login', { email, senha });
      const user = data.user
      const token = data.token

      if (user && token) {
        login({ user, token });
      }
    } catch (error) {
      //@ts-ignore
      setLoginError(error?.response?.data?.message || error?.message || 'Falha no login!');
      
    }finally{
      setLoginLoading(false);
    }
  };

  return { handleSubmit, loginLoading, loginError };
};

const Login = () => {
  const user = useAuthStore(state => state.user);
  const { handleSubmit, loginLoading, loginError } = useLogin();
  const emailStorage = localStorage.getItem('email') || ''

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: emailStorage,
      senha: "",
    },
  });

  return (
    <div className="flex h-screen items-center justify-center">
      {user && (
          <Navigate to="/" replace={true} />
        )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-2 flex flex-col items-center gap-4 backdrop-brightness-125 shadow-xl rounded-xl p-7 min-w-[400px]">
          <div className="flex w-full justify-start items-center font-medium">
            <img src={iconFacell} className="size-14" />
            <span>Facell</span>
          </div>

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="text-left w-60">
                <FormLabel>E-mail</FormLabel>
                <FormControl>
                  <Input type='email' placeholder="Seu email facell" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="senha"
            render={({ field }) => (
              <FormItem className="text-left w-60">
                <FormLabel>Senha</FormLabel>
                <FormControl>
                  <Input type='password' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {loginError && <ErrorAlert message={loginError} />}

          <Button type="submit" variant="destructive" disabled={loginLoading}>
            {loginLoading ? <span className="flex gap-2"><FaSpinner size={18} className="animate-spin"/> Entrando</span> : 'Entrar'}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default Login;
