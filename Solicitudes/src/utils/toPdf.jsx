import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import ReactDOMServer from 'react-dom/server';
import PdfTemplate from './caseTemplate.jsx';
import supabase from './supabaseClient.js';

const types = [
  { req: 'change_lab', text: 'Cambio de laboratorio' },
  { req: 'request_lab', text: 'cupo para laboratorio' }
];

const passToPDF = async (values, file, classes = [], { in_section, want_section }) => {
  const context = types.find((item) => item.req === values.request_type);
  const course_name = classes.find((c) => c.id === values.have_class)?.name || "No especificado";

  let fileUrl = null;
  if (file && file.type.startsWith("image/")) {
    fileUrl = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(file);
    });
  }

  // Renderizar el componente React a HTML estático
  const html = ReactDOMServer.renderToStaticMarkup(
    <PdfTemplate
      values={values}
      context={context}
      course_name={course_name}
      lab_section={in_section}
      want_section={want_section}
      fileUrl={fileUrl}
    />
  );

  // Crear elemento DOM temporal y agregarlo al body
  const element = document.createElement("div");
  element.innerHTML = html;
  document.body.appendChild(element);

  // Esperar un poco para que el DOM se "pinte" (opcional pero recomendado)
  await new Promise((r) => setTimeout(r, 100));

  // Usar html2canvas para capturar el elemento
  const canvas = await html2canvas(element, { scale: 2 });

  // Obtener imagen del canvas
  const imgData = canvas.toDataURL("image/jpeg", 0.98);

  // Crear documento jsPDF (Letter, pulgadas)
  const pdf = new jsPDF("portrait", "in", "letter");

  // Calcular proporción para que la imagen ocupe todo el ancho
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

  // Agregar imagen al PDF
  pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);

  // Eliminar el elemento temporal del DOM
  element.remove();

  // Devolver el Blob PDF
  const pdfBlob = pdf.output("blob");
  return pdfBlob;
};

export default passToPDF;