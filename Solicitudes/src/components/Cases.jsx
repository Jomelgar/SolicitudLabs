import React, { useEffect, useState } from "react";
import { Table, Card, Button, message, Space } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import supabase from "../utils/supabaseClient";

const Cases = () => {
  const [data, setData] = useState([]);

  const fetchData = async () => {
    const { data, error } = await supabase
    .from("case")
    .select(`
      id,
      type,
      url,
      phase,
      student (
        id,
        account_number,
        first_name,
        last_name,
        email
      ),
      class_section (
        id,
        section,
        class (
          id,
          name
        )
      )
    `).eq('phase',"Procesando");


    if (error) {
      message.error("Error al cargar los casos");
      setData([]);
    } else {
      setData(data);
      console.log(data);
    }
  };

  const handleApprove = async (id) => {
    const { error } = await supabase
      .from("case")
      .update({ phase: "Aceptado" })
      .eq("id", id);

    if (error) {
      message.error("Error al aprobar el caso");
    } else {
      message.success("Caso aprobado");
      fetchData();
    }
  };

  const handleDeny = async (id) => {
    const { error } = await supabase
      .from("case")
      .update({ phase: "Denegado" })
      .eq("id", id);

    if (error) {
      message.error("Error al denegar el caso");
    } else {
      message.success("Caso denegado");
      fetchData();
    }
  };

  const columns = [
    {
        title: "Tipo de Caso",
        dataIndex: "type",
        key: "type",
        filters: Array.from(new Set(data.map(d => d.type)))
        .filter(Boolean)
        .map(type => ({ text: type, value: type })),
        onFilter: (value, record) => record.type === value,
    },
    {
        title: "Clase",
        key: "class_name",
        filters: Array.from(new Set(data.map(d => d.class_section?.class?.name)))
        .filter(Boolean)
        .map(name => ({ text: name, value: name })),
        onFilter: (value, record) => record.class_section?.class?.name === value,
        render: (_, record) => record.class_section?.class?.name ?? "—",
    },
    {
        title: "Sección",
        key: "section",
        filters: Array.from(new Set(data.map(d => d.class_section?.section)))
        .filter(Boolean)
        .map(section => ({ text: section, value: section })),
        onFilter: (value, record) => record.class_section?.section === value,
        render: (_, record) => record.class_section?.section ?? "—",
    },
    {
        title: "N° de Cuenta",
        dataIndex: ["student", "account_number"],
        key: "account_number",
    },
    {
        title: "Nombre",
        key: "student_name",
        render: (_, record) =>
        `${record.student?.first_name ?? ""} ${record.student?.last_name ?? ""}`,
    },
    {
        title: "Correo",
        dataIndex: ["student", "email"],
        key: "email",
    },
    {
        title: "URL del Caso",
        dataIndex: "url",
        key: "url",
        render: (url) => (
        <a className='text-blue-400 hover:text-blue-800 underline' href={url} target="_blank">
            Ver caso
        </a>
        ),
    },
    {
        title: "Fase",
        dataIndex: "phase",
        key: "phase",
    },
    {
        title: "Acciones",
        key: "actions",
        render: (_, record) => (
        <Space>
            <Button
            type="primary"
            icon={<CheckOutlined />}
            onClick={() => handleApprove(record.id)}
            >
            Aprobar
            </Button>
            <Button
            type="default"
            danger
            icon={<CloseOutlined />}
            onClick={() => handleDeny(record.id)}
            >
            Denegar
            </Button>
        </Space>
        ),
    },
    ];

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-4">
        <Card
        title={<h1 className="font-bold">Solicitudes de Casos</h1>}
        className="rounded-2xl shadow-md w-full"
        style={{ maxWidth: "100%", overflowX: "auto" }}
        >
        <Table
            columns={columns}
            dataSource={data}
            rowKey="id"
            pagination={{ position: ["bottomCenter"], pageSize: 5 }}
            scroll={{ x: "max-content" }}
        />
        </Card>
    </div>
    );

};

export default Cases;
