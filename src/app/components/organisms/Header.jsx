'use client'
import React, { useEffect, useState } from "react";

import Logo from "../atoms/Logo";
import AyudaMobile from '../atoms/AyudaMobile';

function Header() {
  const [flow, setFlow] = useState('auth'); // Valor por defecto 'auth'
  
  useEffect(() => {
    if (window.location.pathname.includes("chg")) {
      setFlow('change');
    } else if (window.location.pathname.includes("rec")){
      setFlow('recovery');
    } else {
      setFlow('auth');
    }
  }, []);
  
  return (
      <div className="flex justify-between items-center">
        <Logo />
        <AyudaMobile flujo={flow} />
      </div>
  );
}

export default Header;