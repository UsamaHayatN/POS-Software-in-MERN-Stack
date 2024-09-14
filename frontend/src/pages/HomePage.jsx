import { useState, useEffect } from "react";
import { Spin, Button, Modal, Input, Form } from "antd";
import { PlusOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import CartTotals from "../components/cart/CartTotals";
import Categories from "../components/categories/Categories";
import Header from "../components/header/Header";
import Products from "../components/products/Products";
import Footer from "../components/footer/Footer"; // Import the Footer component

function HomePage() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searched, setSearched] = useState("");
  const [addCategoryModalVisible, setAddCategoryModalVisible] = useState(false);
  const [addProductModalVisible, setAddProductModalVisible] = useState(false);

  // Fetch categories
  useEffect(() => {
    const getCategories = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_SERVER_URL}/api/categories/get-all`
        );
        const data = await res.json();
        setCategories(data);
      } catch (error) {
        console.log(error);
      }
    };
    getCategories();
  }, []);

  // Fetch products
  useEffect(() => {
    const getProducts = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_SERVER_URL}/api/products/get-all`
        );
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.log(error);
      }
    };
    getProducts();
  }, []);

  // Handle adding new category
  const handleAddCategory = async (values) => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/api/categories/add`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        }
      );
      if (res.ok) {
        const newCategory = await res.json();
        setCategories([...categories, newCategory]);
        setAddCategoryModalVisible(false);
      }
    } catch (error) {
      console.log("Error adding category:", error);
    }
  };

  // Handle adding new product
  const handleAddProduct = async (values) => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/api/products/add`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        }
      );
      if (res.ok) {
        const newProduct = await res.json();
        setProducts([...products, newProduct]);
        setAddProductModalVisible(false);
      }
    } catch (error) {
      console.log("Error adding product:", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header setSearched={setSearched} />
      <div className="flex-1">
        {products.length > 0 && categories.length > 0 ? (
          <div className="home px-6 flex md:flex-row flex-col justify-between gap-10">
            {/* Categories Section */}
            <div className="categories overflow-auto md:max-h-[calc(100vh_-_112px)] min-h-[125px] pb-10">
              <h2 className="text-xl font-bold mb-4">Categories</h2>
              <Categories
                categories={categories}
                setCategories={setCategories}
                products={products}
                setFiltered={setFiltered}
              />
              <Button
                type="primary"
                onClick={() => setAddCategoryModalVisible(true)}
                className="mt-4"
                icon={<PlusOutlined />}
              >
                Add New Category
              </Button>
            </div>

            {/* Products Section */}
            <div className="products flex-[8] max-h-[calc(100vh_-_112px)] overflow-y-auto pb-10 min-h-[500px]">
              <h2 className="text-xl font-bold mb-4">Products</h2>
              <Products
                products={products}
                setProducts={setProducts}
                categories={categories}
                filtered={filtered}
                searched={searched}
              />
              <Button
                type="primary"
                onClick={() => setAddProductModalVisible(true)}
                className="mt-4"
                icon={<ShoppingCartOutlined />}
              >
                Add New Product
              </Button>
            </div>

            {/* Cart Totals */}
            <div className="cart-totals min-w-[300px] md:-mr-[24px] md:-mt-[24px] md:pb-0 pb-12 border">
              <CartTotals />
            </div>
          </div>
        ) : (
          <Spin size="large" className="absolute left-1/2 top-1/2" />
        )}

        {/* Add Category Modal */}
        <Modal
          title="Add New Category"
          visible={addCategoryModalVisible}
          onCancel={() => setAddCategoryModalVisible(false)}
          footer={null}
        >
          <Form onFinish={handleAddCategory}>
            <Form.Item
              name="name"
              label="Category Name"
              rules={[{ required: true, message: "Please input category name!" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Add Category
              </Button>
            </Form.Item>
          </Form>
        </Modal>

        {/* Add Product Modal */}
        <Modal
          title="Add New Product"
          visible={addProductModalVisible}
          onCancel={() => setAddProductModalVisible(false)}
          footer={null}
        >
          <Form onFinish={handleAddProduct}>
            <Form.Item
              name="name"
              label="Product Name"
              rules={[{ required: true, message: "Please input product name!" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="price"
              label="Price"
              rules={[{ required: true, message: "Please input product price!" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="category"
              label="Category"
              rules={[{ required: true, message: "Please select a category!" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Add Product
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
      <Footer /> 
    </div>
  );
}

export default HomePage;
