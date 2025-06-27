import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface VacationRequestData {
  employeeName: string;
  department: string | undefined;
  startDate: string;
  endDate: string;
  applicationDate: string;
}

export const generateVacationRequestPDF = async (data: VacationRequestData) => {
  const tempDiv = document.createElement('div');
  tempDiv.style.fontFamily = 'Times New Roman';
  tempDiv.style.padding = '40px';
  tempDiv.style.backgroundColor = 'white';
  tempDiv.style.lineHeight = '1.5';
  tempDiv.style.width = '800px';
  tempDiv.style.position = 'absolute';
  tempDiv.style.left = '-9999px';
  
  tempDiv.innerHTML = `
    <div style="text-align: right; margin-bottom: 30px;">
      <p>ООО "Сыктывкарский фанерный завод</p>
      <p>от ${data.employeeName}</p>
      <p>отдела ${data.department}</p>
    </div>

    <h2 style="text-align: center; margin: 30px 0;">ЗАЯВЛЕНИЕ</h2>

    <p style="text-indent: 30px; margin-bottom: 20px;">
      Прошу предоставить мне оплачиваемый отпуск с ${data.startDate} по ${data.endDate}, 
      продолжительностью ${calculateVacationDays(data.startDate, data.endDate)} календарных дней.
    </p>

    <p style="text-indent: 30px; margin-bottom: 40px;">
      Дата составления заявления: ${data.applicationDate}
    </p>

    <div style="display: flex; justify-content: space-between; margin-top: 60px;">
      <div style="width: 200px; border-top: 1px solid black;">
        <p style="text-align: center;">Начальник</p>
      </div>
      <div style="width: 200px; border-top: 1px solid black;">
        <p style="text-align: center;">${data.employeeName}</p>
      </div>
    </div>
  `;

  document.body.appendChild(tempDiv);

  try {
    const canvas = await html2canvas(tempDiv, {
      scale: 2,
      logging: false,
      useCORS: true,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Заявление_на_отпуск_${data.employeeName.replace(/\s+/g, '_')}.pdf`);
  } catch (error) {
    console.error('Ошибка при генерации PDF:', error);
  } finally {
    document.body.removeChild(tempDiv);
  }
};

function calculateVacationDays(startDate: string, endDate: string): number {
 const date1 = new Date(endDate);
const date2 = new Date(startDate);

const diffInMs = Number(date1) - Number(date2);

const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

console.log(diffInDays);
  return diffInDays;
}