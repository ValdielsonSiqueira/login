import { useState } from "react";
import { navigateToUrl } from "single-spa";
import { LoginForm } from "@valoro/ui";
import { saveUserProfile } from "@FIAP/util";
import Placeholder from "../assets/placeholder.svg";
import Logo from "../assets/logo-light.svg";

type LoginFormData = {
  name: string;
  email: string;
};

export default function LoginPage() {
  const [errors, setErrors] = useState<
    Partial<Record<keyof LoginFormData, string>>
  >({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (name: string, email: string): boolean => {
    const fieldErrors: Partial<Record<keyof LoginFormData, string>> = {};

    if (!name || name.trim() === "") {
      fieldErrors.name = "O nome é obrigatório";
    }

    if (!email || email.trim() === "") {
      fieldErrors.email = "O email é obrigatório";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      fieldErrors.email = "Email inválido";
    }

    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return false;
    }

    setErrors({});
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;

    if (!validateForm(name, email)) {
      return;
    }

    setIsLoading(true);

    try {
      const userProfile = {
        name: name.trim(),
        email: email.trim(),
        avatar: "https://github.com/shadcn.png",
      };

      saveUserProfile(userProfile);
      await new Promise((resolve) => setTimeout(resolve, 500));

      navigateToUrl("/dashboard");
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center md:justify-start">
          <a href="/" className="flex items-center font-medium">
            <img
              src="https://raw.githubusercontent.com/ValdielsonSiqueira/login/21086310dc02009808f6d9f58f8f154fe8493bcd/src/assets/logo-light.svg"
              alt="Logo"
              width={50}
              height={50}
            />
            <span className="text-xl font-bold">Valoro</span>
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm
              title="Bem-vindo"
              subtitle="Entre com suas informações para acessar sua conta"
              nameLabel="Nome"
              namePlaceholder="Digite seu nome"
              emailLabel="E-mail"
              emailPlaceholder="seu@email.com"
              submitButtonText="Entrar"
              isLoading={isLoading}
              errors={errors}
              onSubmit={handleSubmit}
            />
            <div className="mt-4 text-center text-sm">
              Não tem uma conta?{" "}
              <a
                href="/account"
                className="underline underline-offset-4"
                onClick={(e) => {
                  e.preventDefault();
                  navigateToUrl("/account");
                }}
              >
                Criar conta
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:!block overflow-hidden min-h-full">
        <img
          src="https://raw.githubusercontent.com/ValdielsonSiqueira/login/21086310dc02009808f6d9f58f8f154fe8493bcd/src/assets/placeholder.svg"
          alt="Imagem de login"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
    </div>
  );
}
