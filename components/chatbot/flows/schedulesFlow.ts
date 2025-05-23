import { ChatService } from '../services/chatService';
import { BotResponse } from '../types/chatTypes';

type ScheduleContext = {
  type: 'horarios';
  flow: 'materia' | 'profesor' | 'día';
  filters?: {
    materia?: string;
    profesor?: string;
    dia?: string;
  };
};

export const SchedulesFlow = {
  /**
   * Maneja la selección inicial del tipo de consulta de horarios
   */
  handleInitialSelection(chatService: ChatService): BotResponse {
    return {
      text: '¿Cómo deseas consultar los horarios?',
      quickReplies: ['Por materia', 'Por profesor', 'Por día', 'Volver'],
      contextUpdate: { type: 'horarios' } // Contexto genérico sin flow específico
    };
  },

  /**
   * Maneja la selección de una materia específica
   */
  handleMateriaSelection(chatService: ChatService): BotResponse {
    const subjects = chatService.getSubjects();
    return {
      text: 'Selecciona una materia:',
      quickReplies: [...subjects, 'Volver'],
      contextUpdate: { 
        type: 'horarios',
        flow: 'materia'
      }
    };
  },

  /**
   * Procesa la consulta por materia y muestra los resultados
   */
  handleMateriaFlow(subject: string, chatService: ChatService): BotResponse {
    const horarios = chatService.getScheduleForSubject(subject);
    
    if (horarios.length === 0) {
      return {
        text: `No encontré horarios para ${subject}`,
        quickReplies: ['Consultar otra materia', 'Volver'],
        contextUpdate: { 
          type: 'horarios',
          flow: 'materia',
          filters: { materia: subject }
        }
      };
    }

    const horariosText = horarios.map(h => 
      `${h.dia}: ${h.horario} (Prof. ${h.profesor})`
    ).join('\n');
    
    return {
      text: `📚 Horarios para ${subject}:\n\n${horariosText}`,
      quickReplies: ['Consultar otra materia', 'Ver por profesor', 'Ver por día', 'Menú principal'],
      contextUpdate: null // Reseteamos el contexto después de mostrar resultados
    };
  },

  /**
   * Maneja la selección de un profesor específico
   */
  handleProfesorSelection(chatService: ChatService): BotResponse {
    const teachers = chatService.getTeachers();
    return {
      text: 'Selecciona un profesor:',
      quickReplies: [...teachers, 'Volver'],
      contextUpdate: { 
        type: 'horarios',
        flow: 'profesor'
      }
    };
  },

  /**
   * Procesa la consulta por profesor y muestra los resultados
   */
  handleProfesorFlow(teacher: string, chatService: ChatService): BotResponse {
    const horarios = chatService.getScheduleByTeacher(teacher);
    
    if (horarios.length === 0) {
      return {
        text: `No encontré horarios para el profesor ${teacher}`,
        quickReplies: ['Consultar otro profesor', 'Volver'],
        contextUpdate: { 
          type: 'horarios',
          flow: 'profesor',
          filters: { profesor: teacher }
        }
      };
    }

    const horariosText = horarios.map(h => 
      `${h.materia}: ${h.dia} ${h.horario}`
    ).join('\n');
    
    return {
      text: `👨‍🏫 Horarios del profesor ${teacher}:\n\n${horariosText}`,
      quickReplies: ['Consultar otro profesor', 'Ver por materia', 'Ver por día', 'Menú principal'],
      contextUpdate: null
    };
  },

  /**
   * Maneja la selección de un día específico
   */
  handleDiaSelection(chatService: ChatService): BotResponse {
    const days = chatService.getAvailableDays();
    return {
      text: 'Selecciona un día:',
      quickReplies: [...days, 'Volver'],
      contextUpdate: { 
        type: 'horarios',
        flow: 'día'
      }
    };
  },

  /**
   * Procesa la consulta por día y muestra los resultados
   */
  handleDiaFlow(day: string, chatService: ChatService): BotResponse {
    const horarios = chatService.getScheduleByDay(day);
    
    if (horarios.length === 0) {
      return {
        text: `No encontré horarios para el día ${day}`,
        quickReplies: ['Consultar otro día', 'Volver'],
        contextUpdate: { 
          type: 'horarios',
          flow: 'día',
          filters: { dia: day }
        }
      };
    }

    const horariosText = horarios.map(h => 
      `${h.materia}: ${h.horario} (Prof. ${h.profesor})`
    ).join('\n');
    
    return {
      text: `📅 Horarios para el ${day}:\n\n${horariosText}`,
      quickReplies: ['Consultar otro día', 'Ver por materia', 'Ver por profesor', 'Menú principal'],
      contextUpdate: null
    };
  },

  /**
   * Maneja la respuesta del usuario según el contexto actual
   */
  handleUserResponse(
    text: string, 
    chatService: ChatService, 
    context: ScheduleContext
  ): BotResponse {
    // Manejar opciones generales primero
    if (text === 'Volver') {
      return this.handleInitialSelection(chatService);
    }

    if (text === 'Menú principal') {
      return {
        text: 'Volviendo al menú principal',
        quickReplies: [], // El hook principal manejará las opciones principales
        contextUpdate: null
      };
    }

    // Manejar según el flujo actual
    switch (context.flow) {
      case 'materia':
        if (text === 'Consultar otra materia') {
          return this.handleMateriaSelection(chatService);
        }
        if (text === 'Ver por profesor') {
          return this.handleProfesorSelection(chatService);
        }
        if (text === 'Ver por día') {
          return this.handleDiaSelection(chatService);
        }
        return this.handleMateriaFlow(text, chatService);

      case 'profesor':
        if (text === 'Consultar otro profesor') {
          return this.handleProfesorSelection(chatService);
        }
        if (text === 'Ver por materia') {
          return this.handleMateriaSelection(chatService);
        }
        if (text === 'Ver por día') {
          return this.handleDiaSelection(chatService);
        }
        return this.handleProfesorFlow(text, chatService);

      case 'día':
        if (text === 'Consultar otro día') {
          return this.handleDiaSelection(chatService);
        }
        if (text === 'Ver por materia') {
          return this.handleMateriaSelection(chatService);
        }
        if (text === 'Ver por profesor') {
          return this.handleProfesorSelection(chatService);
        }
        return this.handleDiaFlow(text, chatService);

      default:
        // Si no hay flujo específico pero estamos en contexto de horarios
        if (text === 'Por materia') {
          return this.handleMateriaSelection(chatService);
        }
        if (text === 'Por profesor') {
          return this.handleProfesorSelection(chatService);
        }
        if (text === 'Por día') {
          return this.handleDiaSelection(chatService);
        }
        return {
          text: 'Opción no reconocida. ¿Cómo deseas consultar los horarios?',
          quickReplies: ['Por materia', 'Por profesor', 'Por día', 'Volver'],
          contextUpdate: { type: 'horarios' }
        };
    }
  }
};