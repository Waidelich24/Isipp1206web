import { parseScheduleXlsx } from './excelParser';

type Career = {
  id: string;
  name: string;
  filePath: string;
};

export class CareerService {
  private availableCareers: Career[] = [
    {
      id: 'seguridad-1ero-a',
      name: 'Seguridad Informática - 1° A',
      filePath: '/horarios/seguridad-1ero-a.xlsx'
    },
    // Agregar más carreras aquí
  ];

  async loadCareerData(careerId: string) {
    const career = this.availableCareers.find(c => c.id === careerId);
    if (!career) throw new Error('Carrera no encontrada');
    
    const response = await fetch(career.filePath);
    if (!response.ok) throw new Error(`Error HTTP ${response.status}`);
    
    const arrayBuffer = await response.arrayBuffer();
    return parseScheduleXlsx(arrayBuffer, career.name);
  }

  getAvailableCareers() {
    return this.availableCareers.map(c => ({
      id: c.id,
      name: c.name
    }));
  }
}