import { Table, Button, Space, Spin } from "antd";

export default function UsersAdmin({ users, loading, onToggleBlock }) {
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Nazwa użytkownika",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Status",
      dataIndex: "isBlocked",
      key: "isBlocked",
      render: (blocked) => (blocked ? "Zablokowany" : "Aktywny"),
    },
    {
      title: "Akcje",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type={record.isBlocked ? "default" : "primary"}
            danger={!record.isBlocked}
            onClick={() => onToggleBlock(record.id)}
          >
            {record.isBlocked ? "Odblokuj" : "Zablokuj"}
          </Button>
        </Space>
      ),
    },
  ];

  if (loading) return <Spin tip="Ładowanie użytkowników..." />;

  return <Table dataSource={users} columns={columns} rowKey="id" />;
}
