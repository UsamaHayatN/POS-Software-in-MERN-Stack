import { Form, Modal, Input, Button, message } from "antd";

const Add = ({
  isAddModalOpen,
  setIsAddModalOpen,
  categories,
  setCategories,
}) => {
  const [form] = Form.useForm(); // Define form here

  const onFinish = async (values) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/api/categories/add-category`,
        {
          method: "POST",
          body: JSON.stringify(values),
          headers: { "Content-type": "application/json; charset=UTF-8" },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add category");
      }

      message.success("Category added successfully.");
      setCategories([
        ...categories,
        {
          _id: Math.random().toString(36).substr(2, 9), // Use a unique ID or server-generated ID
          title: values.title,
        },
      ]);
      setIsAddModalOpen(false); // Close modal after saving
      form.resetFields(); // Reset form fields after saving
    } catch (error) {
      message.error("Failed to add category.");
      console.error("Error adding category:", error);
    }
  };

  return (
    <Modal
      title="Add New Category"
      open={isAddModalOpen}
      onCancel={() => setIsAddModalOpen(false)}
      footer={null}
    >
      <Form onFinish={onFinish} form={form}>
        <Form.Item
          label="Category Name"
          name="title"
          rules={[{ required: true, message: 'Please input the category name!' }]}
        >
          <Input placeholder="Enter category name" />
        </Form.Item>
        <Form.Item className="flex justify-end mb-0">
          <Button type="primary" htmlType="submit">
            Create
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Add;
