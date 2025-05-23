import { ChatService } from './chatService';

type BotResponse = {
  text: string;
  quickReplies?: string[];
  contextUpdate?: any;
};

export const ConversationFlows = {
  handleInitialOptions(option: string, chatService: ChatService): BotResponse {
    switch (option) {
      case 'Consultar horarios de materias':
        return {
          text: '¿Qué materia deseas consultar?',
          quickReplies: [...chatService.getSubjects(), 'Volver'],
          contextUpdate: { type: 'horarios', flow: 'materia' }
        };
      case 'Buscar por profesor':
        return {
          text: '¿Qué profesor deseas consultar?',
          quickReplies: [...chatService.getTeachers(), 'Volver'],
          contextUpdate: { type: 'horarios', flow: 'profesor' }
        };
      case 'Ver horarios por día':
        return {
          text: '¿Qué día de la semana deseas consultar?',
          quickReplies: [...chatService.getAvailableDays(), 'Volver'],
          contextUpdate: { type: 'horarios', flow: 'día' }
        };
      default:
        return {
          text: 'No entendí tu consulta. ¿Podrías ser más específico?',
          quickReplies: ['Consultar horarios de materias', 'Buscar por profesor', 'Ver horarios por día', 'Tengo otra consulta']
        };
    }
  },

  handleSubjectFlow(subject: string, chatService: ChatService): BotResponse {
    const horarios = chatService.getScheduleForSubject(subject);
    
    if (horarios.length === 0) {
      return {
        text: `No encontré horarios para ${subject}. ¿Quieres consultar otra materia?`,
        quickReplies: [...chatService.getSubjects(), 'Volver'],
        contextUpdate: null
      };
    }

    const horariosText = horarios.map(h => 
      `${h.dia}: ${h.horario} (Prof. ${h.profesor})`
    ).join('\n');
    
    return {
      text: `Horarios para ${subject}:\n${horariosText}\n\n¿En qué más puedo ayudarte?`,
      quickReplies: ['Consultar horarios de materias', 'Buscar por profesor', 'Ver horarios por día', 'Tengo otra consulta'],
      contextUpdate: null
    };
  },

  handleTeacherFlow(teacher: string, chatService: ChatService): BotResponse {
    const horarios = chatService.getScheduleByTeacher(teacher);
    
    if (horarios.length === 0) {
      return {
        text: `No encontré horarios para el profesor ${teacher}. ¿Quieres consultar otro profesor?`,
        quickReplies: [...chatService.getTeachers(), 'Volver'],
        contextUpdate: null
      };
    }

    const horariosText = horarios.map(h => 
      `${h.materia}: ${h.dia} ${h.horario}`
    ).join('\n');
    
    return {
      text: `Horarios del profesor ${teacher}:\n${horariosText}\n\n¿En qué más puedo ayudarte?`,
      quickReplies: ['Consultar horarios de materias', 'Buscar por profesor', 'Ver horarios por día', 'Tengo otra consulta'],
      contextUpdate: null
    };
  },

  handleDayFlow(day: string, chatService: ChatService): BotResponse {
    const horarios = chatService.getScheduleByDay(day);
    
    if (horarios.length === 0) {
      return {
        text: `No encontré horarios para el día ${day}. ¿Quieres consultar otro día?`,
        quickReplies: [...chatService.getAvailableDays(), 'Volver'],
        contextUpdate: null
      };
    }

    const horariosText = horarios.map(h => 
      `${h.materia}: ${h.horario} (Prof. ${h.profesor})`
    ).join('\n');
    
    return {
      text: `Horarios para el ${day}:\n${horariosText}\n\n¿En qué más puedo ayudarte?`,
      quickReplies: ['Consultar horarios de materias', 'Buscar por profesor', 'Ver horarios por día', 'Tengo otra consulta'],
      contextUpdate: null
    };
  }
};