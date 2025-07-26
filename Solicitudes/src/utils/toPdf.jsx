import html2pdf from 'html2pdf.js';
import ReactDOMServer from 'react-dom/server';
import PdfTemplate from './caseTemplate.jsx';

const types = [
  { req: 'change_lab', text: 'Cambio de Laboratorio' },
  { req: 'request_lab', text: 'Cupo para Laboratorio' }
];

const passToPDF = async (values, file, classes = []) => {
  const context = types.find((item) => item.req === values.request_type);
  const course_name = classes.find(c => c.id === values.have_class)?.name || 'No especificado';
  const lab_section = values.lab_section || 'N/A';

  let fileUrl = null;

  if (file && file.type.startsWith('image/')) {
    fileUrl = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(file);
    });
  }

  const html = ReactDOMServer.renderToStaticMarkup(
    <PdfTemplate
      values={values}
      context={context}
      course_name={course_name}
      lab_section={lab_section}
      fileUrl={fileUrl}
    />
  );

  const element = document.createElement('div');
  element.innerHTML = html;
  document.body.appendChild(element);

  const opt = {
    margin: 0.5,
    filename: 'solicitud.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
  };

  await html2pdf().set(opt).from(element).save();
  element.remove();
};

export default passToPDF;
