"use client";
import { Tabs, Tab } from "@nextui-org/tabs";
import { SignInForm } from "./SignInForm";
import { SignUpForm } from "./SignUpForm";

export const AuthTabs = () => {
  return (
    <div className="flex w-full flex-col  gap-3">
      <Tabs fullWidth size="lg" aria-label="Options">
        <Tab key="signIn" title="Ingresar">
          <SignInForm />
        </Tab>
        <Tab key="signUp" title="Registrarse">
          <SignUpForm />
        </Tab>
      </Tabs>
    </div>
  );
};
