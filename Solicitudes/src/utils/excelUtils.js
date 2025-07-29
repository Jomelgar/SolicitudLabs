import * as XLSX from 'xlsx';

/**
 * Lee un archivo Excel que contiene las hojas:
 * - 'lab_section'
 * - 'class_reference'
 * 
 * @param {string|Buffer} input - Ruta al archivo o buffer con el archivo Excel
 * @param {boolean} isBuffer - Si true, input es buffer, sino ruta
 * @returns {{ labSections: Array, classReferences: Array }}
 */
export function readLabSectionExcel(input, isBuffer = false) {
  const workbook = isBuffer
    ? XLSX.read(input, { type: 'buffer' })
    : XLSX.readFile(input);

  const labSections = workbook.Sheets['lab_section']
    ? XLSX.utils.sheet_to_json(workbook.Sheets['lab_section'])
    : [];

  const classReferences = workbook.Sheets['class_reference']
    ? XLSX.utils.sheet_to_json(workbook.Sheets['class_reference'])
    : [];

  return { labSections, classReferences };
}

export function downloadLabSectionTemplateExcel(classReferenceData) {
  // Plantilla vacía para lab_section
  const labSectionTemplate = [
    { Id_Clase: '0', Seccion: '0000', Trimestre: 'Q1',Empieza: '8:10:00', Termina: '9:55:00' }
  ];

  const workbook = XLSX.utils.book_new();

  const labSheet = XLSX.utils.json_to_sheet(labSectionTemplate);
  XLSX.utils.book_append_sheet(workbook, labSheet, 'Laboratorios');

  const classSheet = XLSX.utils.json_to_sheet(classReferenceData);
  XLSX.utils.book_append_sheet(workbook, classSheet, 'Clases para Sacar Id');

  // Generar archivo Excel en formato binary string
  const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

  // Crear blob con el contenido del archivo
  const blob = new Blob([wbout], { type: 'application/octet-stream' });

  // Crear URL temporal para descarga
  const url = window.URL.createObjectURL(blob);

  // Crear enlace invisible y hacer click para descargar
  const a = document.createElement('a');
  a.href = url;
  a.download = 'Plantilla_Seccion_Lab.xlsx';
  document.body.appendChild(a);
  a.click();

  // Limpiar
  setTimeout(() => {
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, 0);
}

export function downloadClassSectionTemplateExcel(classReferenceData) {
  // Plantilla vacía para lab_section
  const ClassSectionTemplate = [
    { Id_Clase: '0', Seccion: '0000',Trimestre:'Q1'}
  ];

  const workbook = XLSX.utils.book_new();

  const labSheet = XLSX.utils.json_to_sheet(ClassSectionTemplate);
  XLSX.utils.book_append_sheet(workbook, labSheet, 'Secciones de Clase');

  const classSheet = XLSX.utils.json_to_sheet(classReferenceData);
  XLSX.utils.book_append_sheet(workbook, classSheet, 'Clases para Sacar Id');

  // Generar archivo Excel en formato binary string
  const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

  // Crear blob con el contenido del archivo
  const blob = new Blob([wbout], { type: 'application/octet-stream' });

  // Crear URL temporal para descarga
  const url = window.URL.createObjectURL(blob);

  // Crear enlace invisible y hacer click para descargar
  const a = document.createElement('a');
  a.href = url;
  a.download = 'Plantilla_Seccion_Clase.xlsx';
  document.body.appendChild(a);
  a.click();

  // Limpiar
  setTimeout(() => {
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, 0);
}