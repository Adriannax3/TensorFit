import { useState, useEffect } from "react";
import { Modal, Input, Button, Space, message  } from "antd";
import axios from '../axios';

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

  function dataURLtoFile(dataUrl, filename) {
    if (!dataUrl || typeof dataUrl !== "string") {
      throw new Error("image is empty or not a string");
    }
  
    if (!dataUrl.startsWith("data:image")) {
      throw new Error("image is not a valid dataURL");
    }
  
    const [meta, data] = dataUrl.split(",");
    if (!meta || !data) {
      throw new Error("dataURL is malformed");
    }
  
    const mimeMatch = meta.match(/data:(.*?)(;|,)/);
    const mime = mimeMatch ? mimeMatch[1] : "image/png";
    const isBase64 = meta.includes(";base64");
  
    if (isBase64) {
      const bstr = atob(data);
      const n = bstr.length;
      const u8arr = new Uint8Array(n);
      for (let i = 0; i < n; i++) {
        u8arr[i] = bstr.charCodeAt(i);
      }
      return new File([u8arr], filename, { type: mime });
    }
  
    const decoded = decodeURIComponent(data);
    return new File([decoded], filename, { type: mime });
  }


  const handleSubmit = async () => {
    if (!title.trim()) {
      messageApi.warning("Wpisz tytuł.");
      return;
    }
  
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    
    if (image && typeof image === "string" && image.startsWith("data:image")) {
      const file = dataURLtoFile(image, "chart.png");
      formData.append("image", file);
    }
  
    try {
      await axios.post("/entries", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      messageApi.success("Aktywność udostępniona!");
      onClose();
    } catch (err) {
      messageApi.error(err.message || "Wystąpił błąd");
    }
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
