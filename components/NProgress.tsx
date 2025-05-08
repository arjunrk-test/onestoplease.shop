"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

// Optional: Customize the NProgress style
NProgress.configure({ showSpinner: true, trickleSpeed: 100 });

const NProgressHandler = () => {
  const pathname = usePathname();

  useEffect(() => {
    NProgress.start();
    const timeout = setTimeout(() => {
      NProgress.done();
    }, 500); // Simulates network delay

    return () => {
      clearTimeout(timeout);
    };
  }, [pathname]);

  return null;
};

export default NProgressHandler;
