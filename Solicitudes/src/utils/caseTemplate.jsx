import React from 'react';
import logo from '/UT.png';

const PdfTemplate = ({ values, context, course_name, lab_section, fileUrl }) => {
  const full_name = `${values.first_name} ${values.second_name || ''} ${values.last_name} ${values.second_last_name || ''}`.trim();

  return (
    <div
      id="pdf-content"
      style={{
        padding: '40px',
        fontFamily: 'Times New Roman',
        lineHeight: 1.5,
        color: '#000',
        textAlign: 'justify',
      }}
    >
      {/* Logo alineado a la derecha */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <img src={logo} alt="logo" style={{ width: '40px' }} />
      </div>

      {/* Encabezado */}
      <h1 style={{ color: '#1e40af', marginBottom: '10px', text: '32px' }}>
        Formulario de Solicitud - {context?.text}
      </h1>

      {/* Línea separadora */}
      <hr style={{ border: '1px solid #1e40af', marginBottom: '30px' }} />

      {/* Contenido principal */}
      <p>
        El presente documento tiene como finalidad registrar la solicitud realizada por el estudiante
        <strong> {full_name}</strong>, con número de cuenta
        <strong> {values.account_number}</strong>, y correo electrónico
        <strong> {values.email}</strong>.
      </p>

      <p>
        Dicha solicitud corresponde a un <strong>{context?.text || 'tipo de solicitud no especificado'}</strong>,
        en el marco de la asignatura <strong>{course_name}</strong>
        {values.request_type === 'request_lab' && <> sección <strong>{values.section}</strong></>}.
      </p>

      {values.request_type === 'change_lab' ? (
        <p>
          El estudiante manifiesta pertenecer a la sección de laboratorio <strong>{lab_section}</strong>,
          y solicita el cambio por las razones que se detallan a continuación.
        </p>
      ) : (
        <p>
          El estudiante solicita ser asignado a un laboratorio disponible en esta asignatura.
        </p>
      )}

      <p><strong>Laboratorio solicitado:</strong> {values.want_class}</p>

      {/* Sección de Justificación enmarcada */}
      <div
        style={{
          border: '2px dashed #1e40af',
          padding: '20px',
          marginTop: '30px',
          backgroundColor: '#f9fafb',
        }}
      >
        <h3 style={{ marginTop: 0, color: '#1e40af' }}>Justificación:</h3>
        <p style={{ marginBottom: 0 }}>{values.justification}</p>
      </div>

      {/* Archivo Adjunto (si existe) */}
      {fileUrl && (
        <div style={{ marginTop: '40px', textAlign: 'center' }}>
          <h3 style={{ color: '#1e40af', marginBottom: '20px' }}>Archivo Adjunto</h3>
          <img
            src={fileUrl}
            alt="Adjunto"
            style={{
              width: '400px',
              maxWidth: '100%',
              display: 'block',           // hace que la imagen sea un bloque
              margin: '20px auto 0 auto', // centra horizontalmente y agrega margen superior
              border: '2px solid #ccc',
              padding: '5px',
              borderRadius: '8px',
              backgroundColor: '#fff'
            }}
          />
        </div>
      )}
    </div>
  );
};

export default PdfTemplate;
