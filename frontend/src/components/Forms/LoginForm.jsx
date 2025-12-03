import { Form, Input, Button, Card } from "antd";
import { useNavigate } from "react-router-dom";

export default function LoginForm({ onSubmit }) {
  const [form] = Form.useForm();

  const handleFinish = (values) => {
    if (onSubmit) {
      onSubmit(values);
    }
  };

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Card title="Logowanie" style={{ width: 320 }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          autoComplete="off"
          initialValues={{
            email: "email@example.com",
            password: "123"
          }}
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Podaj adres email!" },
              { type: "email", message: "Niepoprawny email!" },
            ]}
          >
            <Input placeholder="Email" />
          </Form.Item>

          <Form.Item
            label="Hasło"
            name="password"
            rules={[{ required: true, message: "Podaj hasło!" }]}
          >
            <Input.Password placeholder="Hasło" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Zaloguj
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
