'use client';
import { useState, useCallback, useEffect, useMemo } from 'react';
import { CareerService } from '../api/careerService';
import { SchedulesFlow } from '../flows/schedulesFlow';
import { PricesFlow } from '../flows/pricesFlow';
import { CurriculumFlow } from '../flows/curriculumFlow';
import { ChatService } from '../services/chatService';
import type { ChatContext, BotResponse, Message } from '../types/chatTypes';

export const useChatLogic = () => {
  const [state, setState] = useState({
    messages: [] as Message[],
    input: '',
    context: null as ChatContext | null,
    chatService: null as ChatService | null,
    careerService: new CareerService(),
    isLoading: true,
    error: ''
  });

  const MAIN_OPTIONS = useMemo(() => [
    'Consultar horarios',
    'Consultar precios',
    'Ver correlatividades',
    'Información de carreras',
    'Otros trámites'
  ], []);

  const [quickReplies, setQuickReplies] = useState<string[]>(MAIN_OPTIONS);

  // Helpers para mensajes
  const addMessage = useCallback((text: string, sender: 'bot' | 'user', data?: any) => {
    setState(prev => ({
      ...prev,
      messages: [...prev.messages, { text, sender, data }]
    }));
  }, []);

  // Carga inicial
  useEffect(() => {
    const initialize = async () => {
      try {
        // Primero seleccionar carrera
        const careers = state.careerService.getAvailableCareers();
        setQuickReplies(careers.map(c => c.name));
        addMessage('Por favor selecciona tu carrera:', 'bot');
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Error desconocido';
        setState(prev => ({ ...prev, error: errorMsg }));
        addMessage('Ocurrió un error al cargar las carreras disponibles', 'bot');
      } finally {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    };
    
    initialize();
  }, [addMessage, state.careerService]);

const handleQuickReply = useCallback(async (text: string) => {
  // 1. Manejar selección de carrera
  if (state.context === null && !state.chatService) {
    const selectedCareer = state.careerService.getAvailableCareers()
      .find(c => c.name === text);
    
    if (selectedCareer) {
      try {
        setState(prev => ({ ...prev, isLoading: true }));
        const data = await state.careerService.loadCareerData(selectedCareer.id);
        setState(prev => ({
          ...prev,
          chatService: new ChatService(data),
          context: { type: 'main-menu' }
        }));
        addMessage(`Carrera seleccionada: ${selectedCareer.name}`, 'user');
        addMessage('¿En qué puedo ayudarte?', 'bot');
        setQuickReplies(MAIN_OPTIONS);
      } catch (error) {
        // Manejo de errores
      } finally {
        setState(prev => ({ ...prev, isLoading: false }));
      }
      return;
    }
  }

  // 2. Manejar opción "Volver al menú principal"
  if (text === 'Menú principal' || text === 'Volver al menú') {
    setState(prev => ({
      ...prev,
      context: { type: 'main-menu' }
    }));
    addMessage(text, 'user');
    addMessage('Volviendo al menú principal. ¿En qué puedo ayudarte?', 'bot');
    setQuickReplies(MAIN_OPTIONS);
    return;
  }

  // 3. Manejar flujos principales
  let response: BotResponse = {
    text: 'Opción no reconocida. ¿En qué puedo ayudarte?',
    quickReplies: MAIN_OPTIONS,
    contextUpdate: { type: 'main-menu' }
  };

  try {
    if (!state.context || state.context.type === 'main-menu') {
      switch (text) {
        case 'Consultar horarios':
          response = SchedulesFlow.handleInitialSelection(state.chatService!);
          break;
        case 'Consultar precios':
          response = PricesFlow.handleInitialSelection();
          break;
        case 'Ver correlatividades':
          response = CurriculumFlow.handleInitialSelection();
          break;
        case 'Volver':
          // Volver a selección de carrera
          setState(prev => ({ ...prev, chatService: null, context: null }));
          setQuickReplies(state.careerService.getAvailableCareers().map(c => c.name));
          addMessage('Por favor selecciona tu carrera:', 'bot');
          return;
      }
    } else {
      switch (state.context.type) {
        case 'horarios':
          response = SchedulesFlow.handleUserResponse(text, state.chatService!, state.context);
          break;
        case 'precios':
          response = PricesFlow.handleUserResponse(text, state.context);
          break;
        case 'correlatividades':
          response = CurriculumFlow.handleUserResponse(text, state.context);
          break;
      }
    }

    // Procesar la respuesta
    addMessage(text, 'user');
    addMessage(response.text, 'bot');
    setQuickReplies(response.quickReplies || MAIN_OPTIONS);
    setState(prev => ({
      ...prev,
      context: response.contextUpdate ?? { type: 'main-menu' }
    }));
  } catch (error) {
    console.error('Error handling quick reply:', error);
    addMessage(text, 'user');
    addMessage('Ocurrió un error al procesar tu solicitud. Volviendo al menú principal.', 'bot');
    setQuickReplies(MAIN_OPTIONS);
    setState(prev => ({ ...prev, context: { type: 'main-menu' } }));
  }
}, [state, MAIN_OPTIONS, addMessage]);
  return {
    ...state,
    quickReplies,
    handleQuickReply,
    setInput: (text: string) => setState(prev => ({ ...prev, input: text })),
    handleSend: () => {
      if (state.input.trim()) {
        handleQuickReply(state.input);
        setState(prev => ({ ...prev, input: '' }));
      }
    }
  };
};