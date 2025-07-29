import React, { useEffect, useState } from "react";
import { Card, Table, Button, Space, Modal, message } from "antd";
import { PlusOutlined, DeleteOutlined, ImportOutlined, FileExcelOutlined } from "@ant-design/icons";
import AddSectionModal from "./modals/AddSectionModal";
import supabase from '../utils/supabaseClient';
import {downloadClassSectionTemplateExcel} from '../utils/excelUtils.js';

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
      .from('class_section')
      .select(`
      id,
      section,
      trimester,
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

    const handleImport = () => {

    };
    
    const handleExport = () => {
      downloadClassSectionTemplateExcel(classes.map((item)=> ({Id_Clase: item.value,Nombre: item.text})));
    };

  const handleAdd = async(newSection) => {
    const {data,error} = await supabase.from('class_section').insert([{class_id: newSection.class, section: newSection.section,trimester: newSection.trimester}]);
    console.log('Error: ', error);
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
      title: "Sección de Clase",
      dataIndex: "section",
      key: 'id',
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
        title="Secciones de Clases"
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
        <Table columns={columns} dataSource={data} pagination={{ position: ['bottomCenter'],pageSize: 5 }} />
        <Button className="border-none mt-5 !bg-blue-500 hover:!bg-blue-300 !text-white text-md " 
          icon={<FileExcelOutlined/>}
          onClick={handleExport}
        >
          Excel de Ejemplo
        </Button>
      </Card>

      {/* Modal para agregar sección */}
      <AddSectionModal
        open={isAddModalVisible}
        onCancel={() => setIsAddModalVisible(false)}
        onAdd={handleAdd}
      />
    </div>
  );
};

export default classSections;
