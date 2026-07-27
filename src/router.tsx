import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";

export const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/artikel/:slug" element={<App />} />
        <Route path="/berita/:slug" element={<App />} />
        <Route path="/kategori/:category" element={<App />} />
        <Route path="/terms" element={<App />} />
        <Route path="/privacy-policy" element={<App />} />
        <Route path="*" element={<App />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
