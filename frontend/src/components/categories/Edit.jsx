import { Form, Modal, Table, Input, Button, message } from "antd";
import { useState } from "react";

const Edit = ({
  isEditModalOpen,
  setIsEditModalOpen,
  categories,
  setCategories,
}) => {
  const [editingRow, setEditingRow] = useState(null);
  const [form] = Form.useForm(); // Define form here

  const onFinish = async (values) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/api/categories/update-category`,
        {
          method: "PUT",
          body: JSON.stringify({ ...values, categoryId: editingRow._id }),
          headers: { "Content-type": "application/json; charset=UTF-8" },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update category");
      }

      message.success("Category updated successfully.");
      setCategories(
        categories.map((item) =>
          item._id === editingRow._id ? { ...item, title: values.title } : item
        )
      );
      setEditingRow(null); // Close editing mode
      form.resetFields(); // Reset form fields after saving
    } catch (error) {
      message.error("Failed to update category.");
      console.error("Error updating category:", error);
    }
  };

  const deleteCategory = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_SERVER_URL}/api/categories/delete-category`,
          {
            method: "DELETE",
            body: JSON.stringify({ categoryId: id }),
            headers: { "Content-type": "application/json; charset=UTF-8" },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to delete category");
        }

        message.success("Category deleted successfully.");
        setCategories(categories.filter((item) => item._id !== id));
      } catch (error) {
        message.error("Failed to delete category.");
        console.error("Error deleting category:", error);
      }
    }
  };

  const columns = [
    {
      title: "Category Name",
      dataIndex: "title",
      render: (text, record) => {
        if (record._id === editingRow?._id) {
          return (
            <Form.Item
              name="title"
              initialValue={record.title}
              style={{ marginBottom: 0 }}
            >
              <Input />
            </Form.Item>
          );
        } else {
          return <p>{record.title}</p>;
        }
      },
    },
    {
      title: "Actions",
      dataIndex: "action",
      render: (text, record) => (
        <div>
          {record._id === editingRow?._id ? (
            <Button
              type="link"
              onClick={() => {
                form.submit();
                setEditingRow(null);
              }}
            >
              Save
            </Button>
          ) : (
            <>
              <Button
                type="link"
                onClick={() => setEditingRow(record)}
              >
                Edit
              </Button>
              <Button
                type="text"
                danger
                onClick={() => deleteCategory(record._id)}
              >
                Delete
              </Button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <Modal
      title="Category Management"
      open={isEditModalOpen}
      onCancel={() => setIsEditModalOpen(false)}
      footer={null}
    >
      <Form onFinish={onFinish} form={form}>
        <Table
          bordered
          dataSource={categories}
          columns={columns}
          rowKey="_id"
          pagination={false}
        />
      </Form>
    </Modal>
  );
};

export default Edit;
