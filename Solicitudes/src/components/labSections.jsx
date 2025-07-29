import React, { useEffect, useState } from "react";
import { Card, Table, Button, Space, Modal, message } from "antd";
import { PlusOutlined, DeleteOutlined,ImportOutlined,FileExcelOutlined} from "@ant-design/icons";
import AddLabModal from "./modals/AddLabModal";
import supabase from '../utils/supabaseClient';

const classSections = () => {
  const [data, setData] = useState();
  const [classes, setClasses] = useState([]);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);

  const fetchClasses= async()=>
  {
    const { data, error } = await supabase.from('class').select('*');
    if (data?.length > 0) {
      setClasses(data.map((item)=> ({text: item.name, value: item.id})));
    }
  }

  const fetchData = async () => {
    const { data, error } = await supabase
      .from('lab_section')
      .select(`
      id,
      section,
      trimester,
      start_schedule,
      end_schedule,
      class (
        id,
        name
      )
     `);

    if (error) {
      setData([]);
    } else {
      console.log(data);
      setData(data);
    }
  };

  const formatSchedule = (start, end) => {
    // Solo toma HH:mm
    const startFormatted = start.slice(0,5); // "08:10"
    const endFormatted = end.slice(0,5); // "09:30"
    return `${startFormatted} - ${endFormatted}`;
  };


  const handleDelete = async (sectionId) => {
    const { error } = await supabase
        .from('class_section')
        .delete()
        .eq('id', sectionId);

    if (error) {
        console.error('Error eliminando sección:', error);
    } else {
        fetchData();
    }
    };


  const handleExport = () => {
    downloadLabSectionTemplateExcel(classes.map((item)=> ({Id_Clase: item.value,Nombre: item.text})));
  };

  const handleAdd = async(newSection) => {
    const startTime = newSection.start_schedule.format('HH:mm:ss');
    const endTime = newSection.end_schedule.format('HH:mm:ss');
    const { data, error } = await supabase
      .from('lab_section')
      .insert([{
        class_id: newSection.class,
        section: newSection.section,
        trimester: newSection.trimester,
        start_schedule: startTime,
        end_schedule: endTime,
      }]);
    fetchData();
  };


  useEffect(() => {fetchData(); fetchClasses();},[])

  const columns = [
    {
      title: "Clase",
      dataIndex: ['class','name'],
      key: ['class','id'],
      filters: classes,
      onFilter: (value, record) => record.class?.id === value
    },
    {
      title: 'Trimestre',
      dataIndex: 'trimester',
      key:'trimester'
    },
    {
      title: "Sección de Laboratorio",
      dataIndex: "section",
      key: 'id',
    },
    {
      title: "Horario",
      dataIndex: "schedule",
      key: "schedule",
      render: (_, record) => formatSchedule(record.start_schedule, record.end_schedule)
    },
    {
      title: "Acciones",
      key: "actions",
      render: (_, record) => (
        <Button
          type="primary"
          danger
          icon={<DeleteOutlined />}
          onClick={() => handleDelete(record?.id)}
        >
          Eliminar
        </Button>
      ),
    },
  ];

  return (
    <div className="p-4">
      <Card
        title="Secciones de Laboratorios"
        extra={
          <div className="flex space-x-5">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsAddModalVisible(true)}
          >
            Agregar sección
          </Button>
          <Button
            type="primary"
            icon={<ImportOutlined />}
            onClick={()=> handleImport()}
          >
            Importar Excel
          </Button>
        </div>
        }
        className="rounded-2xl shadow-md"
      >
        <Table columns={columns} dataSource={data} pagination={{ position: ['bottomCenter'], pageSize: 5 }} />
        <Button className="border-none mt-5 !bg-blue-500 hover:!bg-blue-300 !text-white text-md " 
          icon={<FileExcelOutlined/>}
          onClick={handleExport}
        >
          Excel de Ejemplo
        </Button>
      </Card>

      {/* Modal para agregar sección */}
      <AddLabModal
        open={isAddModalVisible}
        onCancel={() => setIsAddModalVisible(false)}
        onAdd={handleAdd}
      />
    </div>
  );
};

export default classSections;
