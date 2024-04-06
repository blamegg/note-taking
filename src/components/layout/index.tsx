"use client";
import React from "react";
import { Header } from "..";

export const CustomLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header />
      {children}
    </>
  );
};
