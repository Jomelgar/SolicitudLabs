import { Form, Input, Row, Col, Typography, Card,Button,Select,Radio,Upload, message} from 'antd';
import supabase from '../utils/supabaseClient';
import { UploadOutlined } from '@ant-design/icons';
import { useState,useEffect, use } from 'react';
import passToPDF from '../utils/toPdf.jsx';

const { Title } = Typography;

const types = 
[
  {req:'change_lab',text:'Cambio de Laboratorio'},
  {req:'request_lab',text:'Cupo para Laboratorio'}
];

function Formulario() {
  const [form] = Form.useForm();
  const [files,setFiles] = useState();
  const request_type = Form.useWatch('request_type', form);
  const [classes, setClasses] = useState([]);
  const [classSections,setClassSections] = useState([]);
  const [labSections,setLabSections] = useState([]);

  //Fetches
  const fetchClasses = async () => {
      const { data, error } = await supabase.from('class').select('*');
      if(data.length > 0) {
        setClasses(data);
      }
  };

  const fetchClassSections = async () => {
    const {data,error} = await supabase.from('class_section').select('id,name');
    if(data.length > 0)
    {
      setClassSections(data);
    }
  };

  const fetchLabSections = async() =>{
    const {data, error} = await supabase.from().select('id,name,schedule');
  };

  const beforeUpload = (file) => {
    const validTypes = [
      'image/jpeg',
      'image/png',
      'image/gif'
    ];

    if (!validTypes.includes(file.type)) {
      message.error('Solo se permiten imágenes.');
      return Upload.LIST_IGNORE;
    }
    setFiles(file);
    return false; 
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleSubmit = (values) => {
    passToPDF(values,files,classes);

  };

  
  return (
    <Row justify="center" align="middle" style={{ minHeight: '100vh' }}>
      <Col xs={24} sm={22} md={20} lg={16} xl={12}>
        <Card
          title={
            <h1
              level={2} 
              className="text-center m-0 mt-3 text-blue-500 font-extrabold text-2xl sm:text-2xl md:text-3xl lg:text-2xl xl:text-4xl break-words"
              style={{ whiteSpace: 'normal', lineHeight: 1.2 }}
            >
              <img alt='unitec' src='/UT.png' className='w-5 mb-5 xl:w-10 md:w-8'/>
              Formulario de Solicitud
            </h1>
          }
          bordered={true}
          className="rounded-none md:rounded-lg xl:rounded-xl"
          style={{ backgroundColor: '#f0f2f5', padding: '24px' }}
        >
          <Form layout="vertical" form={form} onFinish={(allValues) => handleSubmit(allValues.values)} onFinishFailed={(allValues) => handleSubmit(allValues.values)}>
            <Card className='mb-4'
              title={<h2 className='text-black  '>Información  Personal</h2>}
              bordered={false}
            >
              {/* Número de Cuenta */}
              <Form.Item
                label="Número de Cuenta"
                name="account_number"
                rules={[{ required: true, message: 'Este campo es obligatorio' }]}
              >
                <Input type='number' placeholder="Número de Cuenta" />
              </Form.Item>

              {/* Primer y Segundo Nombre */}
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Primer Nombre"
                    name="first_name"
                    rules={[{ required: true, message: 'Este campo es obligatorio' }]}
                  >
                    <Input placeholder="Primer Nombre" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item label="Segundo Nombre" name="second_name">
                    <Input placeholder="Segundo Nombre" />
                  </Form.Item>
                </Col>
              </Row>  
              {/* Primer y Segundo Apellido */}
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Primer Apellido"
                    name="last_name"
                    rules={[{ required: true, message: 'Este campo es obligatorio' }]}
                  >
                    <Input placeholder="Primer Apellido" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item label="Segundo Apellido" name="second_last_name">
                    <Input placeholder="Segundo Apellido" />
                  </Form.Item>
                </Col>
              </Row>

              {/* Correo Electrónico */}
              <Form.Item
                label="Correo Electrónico"
                name="email"
                rules={[
                  { required: true, message: 'Este campo es obligatorio' },
                  { type: 'email', message: 'Correo no válido' },
                ]}
              >
                <Input placeholder="Correo Electrónico" />
              </Form.Item>
            </Card>

            <Card className='mb-4' title={<h2 className='text-black mb-3 mt-3'>Información de Solicitud</h2>} bordered={true}>
                
                {/*Tipo de Solicitud*/}
                <Form.Item label="Motivo de Solicitud" name="request_type" rules={[
                  { required: true, message: 'Este campo es obligatorio' }]}>
                  <Radio.Group className='mt-2 mb-2' name='request_type'>
                    <Radio className='text-black mr-5 mb-2' value='request_lab'>Cupo de Laboratorio</Radio>
                    <Radio className='text-black' value='change_lab'>Cambio de Sección</Radio>
                  </Radio.Group>
                </Form.Item>

                <Row gutter={16}>
                  {/*Clase que cursa*/}
                  <Col xs={24} md={12}>
                      <Form.Item 
                          label="Clase que cursa"
                          name="have_class"
                          rules={[{ required: true, message: 'Este campo es obligatorio' }]}
                      >
                          <Select name='have_class' placeholder='Clase'>
                            {classes.map((item) => (
                              <Select.Option key={item.id} value={item.id}>
                                {item.name}
                              </Select.Option>
                            ))}
                          </Select>
                      </Form.Item>
                  </Col>
                  {/* Sección de Clase */}
                  <Col xs={24} md={12}>
                      <Form.Item label='Sección de Clase' name='section' 
                          rules={[{ required: true, message: 'Este campo es obligatorio' }]}
                      >
                          <Select placeholder='Sección de Clase'/>
                      </Form.Item>
                      
                  </Col>
              </Row>
              <Row gutter={16}>
                {/*Seccion de Laboratorio en la que esta*/}
                {request_type === 'change_lab' && 
                (
                  <Col xs={24} md={24}>
                    <Form.Item label='Sección de Laboratorio' name='lab_section' 
                      rules={[{ required: true, message: 'Este campo es obligatorio' }]}
                  >
                      <Select placeholder='Sección de Laboratorio' options={[]}/>
                  </Form.Item>
                  </Col>
                )}
              </Row>
              {/* Clase que desea cursar */}
              <Form.Item label='Laboratorio solicitado' name='want_class' 
                rules={[{ required: true, message: 'Este campo es obligatorio' }]}
              >
                <Select placeholder='Laboratorio solicitado' options={[]} />
              </Form.Item>
              {/* Justificación */}
              <Form.Item label='Justificación' name='justification'
                rules={[{ required: true, message: 'Este campo es obligatorio' }]}
              >
                <Input.TextArea placeholder='Justificación' rows={6}/>
              </Form.Item>
              {/* Adjuntar Archivo */}
              <Form.Item
                label="Adjuntar Archivo"
                name="attach_file"
                rules={[{ required: true, message: "Este campo es obligatorio" }]}
              >
                <p className='mb-4'>(Imagenes como: Captura de Pantalla, Hojas de Confirmacion, Constancia de Trabajo)</p>
                <Upload beforeUpload={(file) => beforeUpload(file)} showUploadList={{ showRemoveIcon: true }} maxCount={1}>
                  <Button icon={<UploadOutlined />}>Seleccionar Archivo</Button>
                </Upload>
              </Form.Item>
            </Card>
            {/* Botón de Enviar */}
            <Form.Item className='text-center'>
                <button type='primary' htmlType='submit' className='rounded-md h-8 mt-3 bg-blue-500 hover:bg-blue-300 text-white text-lg w-[80%]'>Enviar</button>
            </Form.Item>
          </Form>
        </Card>
      </Col>
    </Row>
  );
}

export default Formulario;
