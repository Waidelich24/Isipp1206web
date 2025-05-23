export type Message = {
  text: string;
  sender: 'bot' | 'user';
  data?: any;
};

export type BotResponse = {
  text: string;
  quickReplies?: string[];
  contextUpdate?: ChatContext | null;
};

// Tipos de contexto específicos
export type MainMenuContext = {
  type: 'main-menu';
};

export type ScheduleContext = {
  type: 'horarios';
  flow: 'materia' | 'profesor' | 'día';
  filters?: {
    materia?: string;
    profesor?: string;
    dia?: string;
  };
};

export type PriceContext = {
  type: 'precios';
  flow: 'carrera' | 'materia' | 'tramite';
  filters?: {
    carrera?: string;
    materia?: string;
    tramite?: string;
  };
};

export type CurriculumContext = {
  type: 'correlatividades';
  flow: 'materia' | 'nivel';
  filters?: {
    materia?: string;
    nivel?: string;
  };
};

// Tipo unión para todos los contextos posibles
export type ChatContext = 
  | MainMenuContext
  | ScheduleContext
  | PriceContext
  | CurriculumContext;