import React from "react";
import { Key } from "lucide-react";

interface RegistrationProps {
  referrerAddress: string;
  setReferrerAddress: (address: string) => void;
  handleRegister: () => void;
}

const Registration = ({
  referrerAddress,
  setReferrerAddress,
  handleRegister,
}: RegistrationProps) => {
  return (
    <div className="mt-4 lg:mt-8 w-full">
      <div className="p-4 lg:p-6 rounded-lg drop-shadow-lg shadow bg-light-gradient dark:bg-dark-gradient">
        <div className="flex items-center space-x-2 text-lg font-bold mb-4">
          <Key className="h-5 w-5" />
          <span>Registration</span>
        </div>
        <input
          type="text"
          placeholder="Referrer Address"
          value={referrerAddress}
          onChange={(e) => setReferrerAddress(e.target.value)}
          className="w-full py-3 px-4  rounded mb-4 bg-white/40 dark:bg-white/5 outline-none flex items-center space-x-2 drop-shadow-lg shadow-inner backdrop-blur-lg"
        />
        <button
          type="button"
          onClick={handleRegister}
          className="p-2.5 px-4 lg:px-8 font-semibold text-white cursor-pointer drop-shadow shadow-[4px_4px_12px_#FC2FA450,-4px_-4px_12px_#FC2FA450]
        bg-gradient-button active:scale-105 hover:opacity-90 rounded-lg transition-all duration-300"
        >
          Register
        </button>
      </div>
    </div>
  );
};

export default Registration;
