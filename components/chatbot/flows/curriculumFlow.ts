import { BotResponse } from '../types/chatTypes';

// Datos de ejemplo - deberías reemplazarlos con tus datos reales
const CURRICULUM_DATA = {
  niveles: ['Primer Año', 'Segundo Año', 'Tercer Año', 'Cuarto Año'],
  materias: [
    {
      nombre: 'Matemática I',
      nivel: 'Primer Año',
      correlativas: {
        paraCursar: [],
        paraAprobar: []
      }
    },
    {
      nombre: 'Programación I',
      nivel: 'Primer Año',
      correlativas: {
        paraCursar: [],
        paraAprobar: []
      }
    },
    {
      nombre: 'Programación II',
      nivel: 'Segundo Año',
      correlativas: {
        paraCursar: ['Programación I'],
        paraAprobar: ['Programación I', 'Matemática I']
      }
    },
    {
      nombre: 'Bases de Datos',
      nivel: 'Tercer Año',
      correlativas: {
        paraCursar: ['Programación II'],
        paraAprobar: ['Programación II']
      }
    }
  ]
};

export const CurriculumFlow = {
  /**
   * Maneja la selección inicial del tipo de consulta de correlatividades
   */
  handleInitialSelection(): BotResponse {
    return {
      text: '¿Cómo deseas consultar las correlatividades?',
      quickReplies: ['Por materia', 'Por nivel', 'Volver'],
      contextUpdate: { type: 'correlatividades', flow: 'materia' }

    };
  },

  /**
   * Maneja la selección de consulta por materia
   */
  handleMateriaSelection(): BotResponse {
    const materias = CURRICULUM_DATA.materias.map(m => m.nombre);
    return {
      text: 'Selecciona una materia para ver sus correlatividades:',
      quickReplies: [...materias, 'Volver'],
      contextUpdate: { 
        type: 'correlatividades',
        flow: 'materia'
      }
    };
  },

  /**
   * Procesa la consulta por materia y muestra las correlatividades
   */
  handleMateriaFlow(materiaNombre: string): BotResponse {
    const materia = CURRICULUM_DATA.materias.find(m => m.nombre === materiaNombre);
    
    if (!materia) {
      return {
        text: `No encontré información para la materia ${materiaNombre}`,
        quickReplies: ['Consultar otra materia', 'Volver'],
        contextUpdate: { 
          type: 'correlatividades',
          flow: 'materia',
          filters: { materia: materiaNombre }
        }
      };
    }

    const formatCorrelativas = (correlativas: string[]) => 
      correlativas.length > 0 
        ? correlativas.join(', ') 
        : 'Ninguna';

    const responseText = `📚 Correlatividades para ${materia.nombre} (${materia.nivel}):\n\n` +
      `🔹 Para cursar: ${formatCorrelativas(materia.correlativas.paraCursar)}\n` +
      `🔹 Para aprobar: ${formatCorrelativas(materia.correlativas.paraAprobar)}\n\n` +
      `¿Qué más deseas consultar?`;

    return {
      text: responseText,
      quickReplies: ['Consultar otra materia', 'Ver por nivel', 'Menú principal'],
      contextUpdate: null
    };
  },

  /**
   * Maneja la selección de consulta por nivel
   */
  handleNivelSelection(): BotResponse {
    return {
      text: 'Selecciona un nivel para ver sus materias:',
      quickReplies: [...CURRICULUM_DATA.niveles, 'Volver'],
      contextUpdate: { 
        type: 'correlatividades',
        flow: 'nivel'
      }
    };
  },

  /**
   * Procesa la consulta por nivel y muestra las materias
   */
  handleNivelFlow(nivel: string): BotResponse {
    const materiasDelNivel = CURRICULUM_DATA.materias
      .filter(m => m.nivel === nivel)
      .map(m => m.nombre);

    if (materiasDelNivel.length === 0) {
      return {
        text: `No encontré materias para el nivel ${nivel}`,
        quickReplies: ['Consultar otro nivel', 'Volver'],
        contextUpdate: { 
          type: 'correlatividades',
          flow: 'nivel',
          filters: { nivel }
        }
      };
    }

    return {
      text: `📖 Materias de ${nivel}:\n\n${materiasDelNivel.join('\n')}\n\n` +
            'Selecciona una materia para ver sus correlatividades o consulta otro nivel:',
      quickReplies: [...materiasDelNivel, 'Consultar otro nivel', 'Menú principal'],
      contextUpdate: { 
        type: 'correlatividades',
        flow: 'materia' // Cambia al flujo de materia si seleccionan una
      }
    };
  },

  /**
   * Maneja la respuesta del usuario según el contexto actual
   */
  handleUserResponse(text: string, context: any): BotResponse {
    // Manejar opciones generales primero
    if (text === 'Volver') {
      return this.handleInitialSelection();
    }

    if (text === 'Menú principal') {
      return {
        text: 'Volviendo al menú principal',
        quickReplies: [], // El hook principal manejará las opciones principales
        contextUpdate: null
      };
    }

    // Manejar según el flujo actual
    switch (context?.flow) {
      case 'materia':
        if (text === 'Consultar otra materia') {
          return this.handleMateriaSelection();
        }
        if (text === 'Ver por nivel') {
          return this.handleNivelSelection();
        }
        return this.handleMateriaFlow(text);

      case 'nivel':
        if (text === 'Consultar otro nivel') {
          return this.handleNivelSelection();
        }
        // Si selecciona una materia desde el listado por nivel
        if (CURRICULUM_DATA.materias.some(m => m.nombre === text)) {
          return this.handleMateriaFlow(text);
        }
        return this.handleNivelFlow(text);

      default:
        // Si no hay flujo específico pero estamos en contexto de correlatividades
        if (text === 'Por materia') {
          return this.handleMateriaSelection();
        }
        if (text === 'Por nivel') {
          return this.handleNivelSelection();
        }
        return {
          text: 'Opción no reconocida. ¿Cómo deseas consultar las correlatividades?',
          quickReplies: ['Por materia', 'Por nivel', 'Volver'],
          contextUpdate: { type: 'correlatividades', flow: 'materia' }

        };
    }
  }
};