import { ScheduleEvent } from '../api/excelParser';

export class ChatService {
  private scheduleData: ScheduleEvent[];

  constructor(data: ScheduleEvent[]) {
    this.scheduleData = data;
  }

  getSubjects(): string[] {
    return Array.from(new Set(this.scheduleData.map(item => item.materia))).filter(Boolean);
  }

  getTeachers(): string[] {
    return Array.from(new Set(this.scheduleData.map(item => item.profesor))).filter(Boolean);
  }

  getAvailableDays(): string[] {
    return ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
  }

  getScheduleForSubject(subject: string) {
    return this.scheduleData
      .filter(item => item.materia === subject)
      .map(item => ({
        dia: item.dia,
        horario: `${item.inicio} a ${item.fin}`,
        profesor: item.profesor
      }));
  }

  getScheduleByTeacher(teacher: string) {
    return this.scheduleData
      .filter(item => item.profesor === teacher)
      .map(item => ({
        materia: item.materia,
        dia: item.dia,
        horario: `${item.inicio} a ${item.fin}`
      }));
  }

  getScheduleByDay(day: string) {
    return this.scheduleData
      .filter(item => item.dia === day)
      .map(item => ({
        materia: item.materia,
        horario: `${item.inicio} a ${item.fin}`,
        profesor: item.profesor
      }));
  }
}