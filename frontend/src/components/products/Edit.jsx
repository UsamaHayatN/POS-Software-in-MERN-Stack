
import { Form, Table, Input, Button, message, Select, Modal } from "antd";
import { useState, useEffect } from "react";

const Edit = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState({});
  const [form] = Form.useForm();

  useEffect(() => {
    const getProduct = async () => {
      try {
        const res = await fetch(process.env.REACT_APP_SERVER_URL + "/api/products/get-all");
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.log(error);
      }
    };
    getProduct();
  }, []);

  useEffect(() => {
    const getCategory = async () => {
      try {
        const res = await fetch(process.env.REACT_APP_SERVER_URL + "/api/categories/get-all");
        const data = await res.json();
        setCategories(data);
      } catch (error) {
        console.log(error);
      }
    };
    getCategory();
  }, []);

  const onFinish = async (values) => {
    try {
      await fetch(process.env.REACT_APP_SERVER_URL + "/api/products/update-product", {
        method: "PUT",
        body: JSON.stringify({ ...values, productId: editingItem._id }),
        headers: { "Content-type": "application/json; charset=UTF-8" },
      });
      setProducts(products.map((item) => item._id === editingItem._id ? { ...item, ...values } : item));
      message.success("Product successfully updated.");
      setIsEditModalOpen(false);
    } catch (error) {
      message.error("Something went wrong...");
    }
  };

  const deleteCategory = async (id) => {
    if (window.confirm("Are you sure you want to delete?")) {
      try {
        await fetch(process.env.REACT_APP_SERVER_URL + "/api/products/delete-product", {
          method: "DELETE",
          body: JSON.stringify({ productId: id }),
          headers: { "Content-type": "application/json; charset=UTF-8" },
        });
        message.success("Product successfully deleted.");
        setProducts(products.filter((item) => item._id !== id));
      } catch (error) {
        message.error("Something went wrong...");
      }
    }
  };

  const columns = [
    {
      title: "Product Name",
      dataIndex: "title",
      width: "8%",
      render: (_, record) => <p>{record.title}</p>,
    },
    {
      title: "Product Image",
      dataIndex: "img",
      width: "4%",
      render: (_, record) => <img src={record.img} alt="" className="w-full h-20 object-cover" />,
    },
    {
      title: "Product Price",
      dataIndex: "price",
      width: "8%",
    },
    {
      title: "Category",
      dataIndex: "category",
      width: "8%",
    },
    {
      title: "Action",
      dataIndex: "action",
      width: "8%",
      render: (_, record) => (
        <div>
          <Button
            type="text"
            className="pl-0"
            onClick={() => {
              setIsEditModalOpen(true);
              setEditingItem(record);
              form.setFieldsValue(record);
            }}
          >
            Edit
          </Button>
          <Button type="text" danger onClick={() => deleteCategory(record._id)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <Table
        bordered
        dataSource={products}
        columns={columns}
        rowKey={"_id"}
        scroll={{ x: 1000, y: 500 }}
      />
      <Modal
        title="Edit Product"
        open={isEditModalOpen}
        onCancel={() => setIsEditModalOpen(false)}
        footer={false}
      >
        <Form
          layout="vertical"
          onFinish={onFinish}
          form={form}
        >
          <Form.Item
            label="Product Name"
            name="title"
            rules={[{ required: true, message: "This field cannot be empty!" }]}
          >
            <Input placeholder="Enter product name" />
          </Form.Item>
          <Form.Item
            label="Product Image URL"
            name="img"
            rules={[{ required: true, message: "This field cannot be empty!" }]}
          >
            <Input placeholder="Enter product image URL" />
          </Form.Item>
          <Form.Item
            label="Product Price"
            name="price"
            rules={[{ required: true, message: "This field cannot be empty!" }]}
          >
            <Input placeholder="Enter product price" />
          </Form.Item>
          <Form.Item
            label="Select Category"
            name="category"
            rules={[{ required: true, message: "This field cannot be empty!" }]}
          >
            <Select
              showSearch
              placeholder="Type to select a category"
              optionFilterProp="children"
              filterOption={(input, option) => (option?.title ?? "").includes(input)}
              filterSort={(optionA, optionB) =>
                (optionA?.title ?? "").toLowerCase().localeCompare((optionB?.title ?? "").toLowerCase())
              }
              options={categories.map((item) => ({
                value: item.title,
                label: item.title,
              }))}
            />
          </Form.Item>
          <Form.Item className="flex justify-end mb-0">
            <Button type="primary" htmlType="submit">
              Update
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Edit;