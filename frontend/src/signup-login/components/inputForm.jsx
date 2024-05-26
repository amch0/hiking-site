import React from "react";
import { Input } from "@nextui-org/react";
import PasswordInput from "../components/passwordInput";

const InputForm = ({ onPasswordChange, onInputChange }) => {
  return (
    <div className="input space-y-4">
      <Input
        isRequired
        type="text"
        name="name"
        label="Ime"
        placeholder="Ime"
        onChange={onInputChange}
      />
      <Input
        isRequired
        type="email"
        name="email"
        label="Email"
        placeholder="primjer@gmail.com"
        onChange={onInputChange}
      />
      <PasswordInput
        label="Lozinka"
        name="password"
        placeholder="Unesite svoju lozinku"
        onPasswordChange={onPasswordChange}
      />
      <Input
        isRequired
        type="text"
        name="phone_number"
        label="Broj Telefona"
        placeholder="+387******"
        onChange={onInputChange}
      />
    </div>
  );
};

export default InputForm;
