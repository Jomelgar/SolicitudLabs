import React from "react";
import { Card, Form, Input, Button, Typography } from "antd";

const { Title, Text } = Typography;

function Profile() {
  const [form] = Form.useForm();

  const handleSubmit = (values) => {
    console.log("Cambiar contraseña:", values);
    // Lógica para enviar cambios
  };

  return (
    <div className="w-full h-full justify-center items-centerpx-4 py-8">
      <Card
        title={<Title level={3}>Mi Perfil</Title>}
        bordered={false}
        className="w-full h-full"
      >
        <div className="max-w-2xl">
            <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{
                email: "usuario@ejemplo",
            }}
            >
            <Form.Item label="Correo electrónico">
                <Input value="usuario@ejemplo.com" disabled />
            </Form.Item>

            <Form.Item
                label="Nueva contraseña"
                name="password"
                rules={[
                { required: true, message: "Por favor ingrese la nueva contraseña" },
                { min: 6, message: "Debe tener al menos 6 caracteres" },
                ]}
            >
                <Input.Password placeholder="********" />
            </Form.Item>

            <Form.Item>
                <Button className='mt-10' type="primary" htmlType="submit" block>
                Actualizar contraseña
                </Button>
            </Form.Item>
            </Form>
        </div>
      </Card>
    </div>
  );
}

export default Profile;
