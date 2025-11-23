import { Form, Input, Button, Card } from "antd";

export default function RegisterForm({ onSubmit }) {
  const [form] = Form.useForm();

  const handleFinish = (values) => {
    if (onSubmit) {
      onSubmit(values);
    }
    console.log("Register data:", values);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100%",
      }}
    >
      <Card title="Rejestracja" style={{ width: 320 }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          autoComplete="off"
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
            label="Nazwa użytkownika"
            name="username"
            rules={[{ required: true, message: "Podaj nazwę użytkownika!" }]}
          >
            <Input placeholder="Nazwa użytkownika" />
          </Form.Item>

          <Form.Item
            label="Hasło"
            name="password"
            rules={[{ required: true, message: "Podaj hasło!" }]}
            hasFeedback
          >
            <Input.Password placeholder="Hasło" />
          </Form.Item>

          <Form.Item
            label="Potwierdź hasło"
            name="confirmPassword"
            dependencies={["password"]}
            hasFeedback
            rules={[
              { required: true, message: "Potwierdź hasło!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Hasła muszą się zgadzać!"));
                },
              }),
            ]}
          >
            <Input.Password placeholder="Powtórz hasło" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Zarejestruj się
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
