import React from "react";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import Edit from "../components/products/Edit";

const ProductPage = () => {
  return (
    <>
      <Header />
      <div className="px-6">
        <h1 className="text-4xl font-bold text-center mb-4">Products</h1>
        <Edit />
      </div>
      <Footer />
    </>
  );
};

export default ProductPage;
