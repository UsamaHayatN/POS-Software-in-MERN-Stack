import Header from "../components/header/Header";
import { Table, Button, Input, Space } from "antd";
import { useEffect, useState, useRef } from "react";
import PrintInvoice from "../components/invoice/PrintInvoice";
import Highlighter from "react-highlight-words";
import { SearchOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import Footer from "../components/footer/Footer";


const InvoicePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [invoices, setInvoices] = useState();
  const [printData, setPrintData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);

  useEffect(() => {
    const getInvoices = async () => {
      try {
        const res = await fetch(
          process.env.REACT_APP_SERVER_URL + "/api/invoices/get-all"
        );
        const data = await res.json();
        const newData = data.map((item) => {
          return { ...item, key: item._id };
        });
        setInvoices(newData);
      } catch (error) {
        console.log(error);
      }
    };

    getInvoices();
  }, []);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            Close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1890ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const columns = [
    {
      title: "Customer Name",
      dataIndex: "customerName",
      key: "customerName",
      ...getColumnSearchProps("customerName"),
    },
    {
      title: "Phone Number",
      dataIndex: "customerPhoneNumber",
      key: "customerPhoneNumber",
      ...getColumnSearchProps("customerPhoneNumber"),
    },
    {
      title: "Creation Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text, record) => {
        return <span>{text.substring(0, 10)}</span>;
      },
    },
    {
      title: "Payment Method",
      dataIndex: "paymentMode",
      key: "paymentMode",
    },
    {
      title: "Total Amount",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (text, record) => {
        return <span>{text} Rs</span>;
      },
      sorter: (a, b) => a.totalAmount - b.totalAmount,
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      width: "100px",
      render: (text, record) => {
        return (
          <Button
            size="small"
            type="primary"
            className="mt-4 w-full"
            onClick={() => {
              setIsModalOpen(true);
              setPrintData(record);
            }}
          >
            Print
          </Button>
        );
      },
    },
  ];

  return (
    <>
      <Header />
      {invoices ? (
        <div className="px-6 min-h-[550px]">
          <h1 className="text-4xl text-center font-bold mb-4">Invoices</h1>
          <Table
            dataSource={invoices}
            columns={columns}
            bordered
            pagination={true}
            scroll={{ x: 1200, y: 300 }}
            rowKey="_id"
          />
        </div>
      ) : (
        <Spin size="large" className="absolute left-1/2 top-1/2" />
      )}
      <PrintInvoice
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        printData={printData}
      />
      <Footer />
    </>
  );
};

export default InvoicePage;
