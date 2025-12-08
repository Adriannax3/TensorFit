import { Table, Button, Space, Popconfirm, Spin } from "antd";
import dayjs from "dayjs";

export default function CommentsAdmin({ comments, loading, onDelete }) {
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Autor",
      dataIndex: ["User", "username"],
      key: "author",
      render: (_, record) => record.User?.username || "Anonim",
    },
    {
      title: "Treść",
      dataIndex: "content",
      key: "content",
      render: (text) => text || "-",
    },
    {
      title: "Data",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => dayjs(date).format("YYYY-MM-DD HH:mm"),
    },
    {
      title: "Akcje",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Popconfirm
            title="Czy na pewno chcesz usunąć komentarz?"
            onConfirm={() => onDelete(record.id)}
            okText="Tak"
            cancelText="Nie"
          >
            <Button danger>Usuń</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  if (loading) return <Spin tip="Ładowanie komentarzy..." />;

  const safeComments = Array.isArray(comments) ? comments : [];

  return (
    <Table
      dataSource={safeComments}
      columns={columns}
      rowKey="id"
      locale={{ emptyText: "Brak komentarzy do wyświetlenia" }}
    />
  );
}
