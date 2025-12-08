import { Table, Button, Space, Popconfirm, Spin, Image, Avatar } from "antd";

export default function EntriesAdmin({ entries, loading, onDelete, decodeImage }) {
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Tytuł",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Opis",
      dataIndex: "description",
      key: "description",
      render: (text) => text || "-",
    },
    {
      title: "Autor",
      key: "author",
      render: (_, record) => {
        const username = record.User?.username || "Anonim";
        const avatarColor = record.User?.avatarColor || "#ccc";
        const initial = username[0]?.toUpperCase() || "?";

        return <><Avatar style={{ backgroundColor: avatarColor }}>{initial}</Avatar> {username}</>;
      },
    },
    {
      title: "Obraz",
      dataIndex: "image",
      key: "image",
      render: (image) =>
        image ? (
          <Image
            src={decodeImage(image)}
            alt="Wpis"
            width={80}
            height={80}
            style={{ objectFit: "cover", cursor: "pointer" }}
            preview={{ mask: null }}
          />
        ) : (
          "-"
        ),
    },
    {
      title: "Akcje",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Popconfirm
            title="Czy na pewno chcesz usunąć wpis?"
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

  if (loading) return <Spin tip="Ładowanie wpisów..." />;

  const safeEntries = Array.isArray(entries) ? entries : [];

  return (
    <Table
      dataSource={safeEntries}
      columns={columns}
      rowKey="id"
      locale={{ emptyText: "Brak wpisów do wyświetlenia" }}
    />
  );
}
