import { BotResponse } from '../types/chatTypes';

type PriceContext = {
  type: 'precios';
  flow: 'carrera' | 'materia' | 'tramite';
  filters?: {
    carrera?: string;
    materia?: string;
    tramite?: string;
  };
};

// Datos de ejemplo - deberías reemplazarlos con tus datos reales
const PRICE_DATA = {
  carreras: [
    { id: 'seguridad', name: 'Seguridad Informática', arancel: 15000 },
    { id: 'software', name: 'Desarrollo de Software', arancel: 14000 },
  ],
  materias: [
    { name: 'Matemáticas I', costo: 2000, carrera: 'seguridad' },
    { name: 'Programación I', costo: 2500, carrera: 'software' },
  ],
  tramites: [
    { name: 'Inscripción', costo: 1000 },
    { name: 'Certificado Analítico', costo: 500 },
  ]
};

export const PricesFlow = {
  /**
   * Maneja la selección inicial del tipo de consulta de precios
   */
  handleInitialSelection(): BotResponse {
    return {
      text: '¿Qué información de precios necesitas?',
      quickReplies: ['Arancel por carrera', 'Costo de materias', 'Precio de trámites', 'Volver'],
      contextUpdate: { type: 'precios', flow: 'carrera' }

    };
  },

  /**
   * Maneja la selección de carrera para ver aranceles
   */
  handleCarreraSelection(): BotResponse {
    const carreras = PRICE_DATA.carreras.map(c => c.name);
    return {
      text: 'Selecciona una carrera para ver el arancel:',
      quickReplies: [...carreras, 'Volver'],
      contextUpdate: { 
        type: 'precios',
        flow: 'carrera'
      }
    };
  },

  /**
   * Procesa la consulta por carrera y muestra el arancel
   */
  handleCarreraFlow(carreraName: string): BotResponse {
    const carrera = PRICE_DATA.carreras.find(c => c.name === carreraName);
    
    if (!carrera) {
      return {
        text: `No encontré información para la carrera ${carreraName}`,
        quickReplies: ['Consultar otra carrera', 'Volver'],
        contextUpdate: { 
          type: 'precios',
          flow: 'carrera',
          filters: { carrera: carreraName }
        }
      };
    }

    return {
      text: `💵 Arancel para ${carrera.name}: $${carrera.arancel} por mes\n\n¿Necesitas información sobre otra cosa?`,
      quickReplies: ['Consultar otra carrera', 'Ver costos de materias', 'Ver precios de trámites', 'Menú principal'],
      contextUpdate: null
    };
  },

  /**
   * Maneja la selección de materia para ver costos
   */
  handleMateriaSelection(): BotResponse {
    const materias = PRICE_DATA.materias.map(m => m.name);
    return {
      text: 'Selecciona una materia para ver su costo:',
      quickReplies: [...materias, 'Volver'],
      contextUpdate: { 
        type: 'precios',
        flow: 'materia'
      }
    };
  },

  /**
   * Procesa la consulta por materia y muestra el costo
   */
  handleMateriaFlow(materiaName: string): BotResponse {
    const materia = PRICE_DATA.materias.find(m => m.name === materiaName);
    
    if (!materia) {
      return {
        text: `No encontré información para la materia ${materiaName}`,
        quickReplies: ['Consultar otra materia', 'Volver'],
        contextUpdate: { 
          type: 'precios',
          flow: 'materia',
          filters: { materia: materiaName }
        }
      };
    }

    const carrera = PRICE_DATA.carreras.find(c => c.id === materia.carrera);

    return {
      text: `📚 Costo de ${materia.name}: $${materia.costo}\n` +
            (carrera ? `(Carrera: ${carrera.name})\n\n` : '\n') +
            '¿Necesitas información sobre otra cosa?',
      quickReplies: ['Consultar otra materia', 'Ver aranceles por carrera', 'Ver precios de trámites', 'Menú principal'],
      contextUpdate: null
    };
  },

  /**
   * Maneja la selección de trámite para ver precios
   */
  handleTramiteSelection(): BotResponse {
    const tramites = PRICE_DATA.tramites.map(t => t.name);
    return {
      text: 'Selecciona un trámite para ver su precio:',
      quickReplies: [...tramites, 'Volver'],
      contextUpdate: { 
        type: 'precios',
        flow: 'tramite'
      }
    };
  },

  /**
   * Procesa la consulta por trámite y muestra el precio
   */
  handleTramiteFlow(tramiteName: string): BotResponse {
    const tramite = PRICE_DATA.tramites.find(t => t.name === tramiteName);
    
    if (!tramite) {
      return {
        text: `No encontré información para el trámite ${tramiteName}`,
        quickReplies: ['Consultar otro trámite', 'Volver'],
        contextUpdate: { 
          type: 'precios',
          flow: 'tramite',
          filters: { tramite: tramiteName }
        }
      };
    }

    return {
      text: `📝 Precio del trámite "${tramite.name}": $${tramite.costo}\n\n` +
            '¿Necesitas información sobre otra cosa?',
      quickReplies: ['Consultar otro trámite', 'Ver aranceles por carrera', 'Ver costos de materias', 'Menú principal'],
      contextUpdate: null
    };
  },

  /**
   * Maneja la respuesta del usuario según el contexto actual
   */
  handleUserResponse(text: string, context: PriceContext): BotResponse {
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
      case 'carrera':
        if (text === 'Consultar otra carrera') {
          return this.handleCarreraSelection();
        }
        if (text === 'Ver costos de materias') {
          return this.handleMateriaSelection();
        }
        if (text === 'Ver precios de trámites') {
          return this.handleTramiteSelection();
        }
        return this.handleCarreraFlow(text);

      case 'materia':
        if (text === 'Consultar otra materia') {
          return this.handleMateriaSelection();
        }
        if (text === 'Ver aranceles por carrera') {
          return this.handleCarreraSelection();
        }
        if (text === 'Ver precios de trámites') {
          return this.handleTramiteSelection();
        }
        return this.handleMateriaFlow(text);

      case 'tramite':
        if (text === 'Consultar otro trámite') {
          return this.handleTramiteSelection();
        }
        if (text === 'Ver aranceles por carrera') {
          return this.handleCarreraSelection();
        }
        if (text === 'Ver costos de materias') {
          return this.handleMateriaSelection();
        }
        return this.handleTramiteFlow(text);

      default:
        // Si no hay flujo específico pero estamos en contexto de precios
        if (text === 'Arancel por carrera') {
          return this.handleCarreraSelection();
        }
        if (text === 'Costo de materias') {
          return this.handleMateriaSelection();
        }
        if (text === 'Precio de trámites') {
          return this.handleTramiteSelection();
        }
        return {
          text: 'Opción no reconocida. ¿Qué información de precios necesitas?',
          quickReplies: ['Arancel por carrera', 'Costo de materias', 'Precio de trámites', 'Volver'],
          contextUpdate: { type: 'precios', flow: 'carrera' }

        };
    }
  }
};