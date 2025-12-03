import React, { useState, useEffect } from "react";
import { Modal, Input, Button, Space, message  } from "antd";

export default function ShareActivityModal({
  open,
  onClose,
  onSubmit,
  title: initialTitle = "",
  description: initialDescription = "",
  image,
}) {
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    if (open) {
      setTitle(initialTitle);
      setDescription(initialDescription);
    }
  }, [open, initialTitle, initialDescription]);

  const warning = (message) => {
    messageApi.open({
      type: 'warning',
      content: message,
    });
  };

  const handleSubmit = () => {
    if (!title || !title.trim().length) {
        warning("Proszę podać tytuł");
        return;
    }

    onSubmit?.({
      title,
      description,
      image,
    });
  };

  return (
    <>
    {contextHolder}
        <Modal
        open={open}
        onCancel={onClose}
        footer={null}
        title="Udostępnij aktywność"
        >
            <Space direction="vertical" style={{ width: "100%" }} size="middle">
                {image && (
                <div style={{ textAlign: "center" }}>
                    <img
                    src={image}
                    alt="preview"
                    style={{ width: "100%", maxHeight: 200, objectFit: "contain" }}
                    />
                </div>
                )}

                <Input
                placeholder="Tytuł"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                />

                <Input.TextArea
                placeholder="Opis"
                autoSize={{ minRows: 3 }}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                />

                <Space style={{ justifyContent: "flex-end", width: "100%" }}>
                <Button onClick={onClose}>Anuluj</Button>
                <Button type="primary" onClick={handleSubmit}>
                    Wyślij
                </Button>
                </Space>
            </Space>
        </Modal>
    </>
  );
}
