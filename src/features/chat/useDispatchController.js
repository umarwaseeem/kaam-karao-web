import { useCallback, useReducer, useRef } from 'react';
import { apiChatStream, apiGetThreadHistory } from '../../lib/dispatch.js';

const uuidv4 = () => crypto.randomUUID();
import { readSSEStream } from '../../lib/sseClient.js';

/** @typedef {{ id:string, text:string, isUser:boolean, timestamp:string, agentSteps?:any[], rankedProviders?:any[], selectedProvider?:any, bookingResult?:any, recommendation?:any, plan?:any, reminder?:any, trace?:any[], requiresClarification?:boolean, clarificationQuestion?:string }} Message */

const initialState = {
  messages: [],
  threadId: uuidv4(),
  isStreaming: false,
  streamingText: '',
  liveSteps: [],
  inputMode: 'text', // 'text' | 'voice'
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_THREAD': return { ...state, threadId: action.threadId, messages: [] };
    case 'SET_MESSAGES': return { ...state, messages: action.messages };
    case 'ADD_USER_MSG':
      return { ...state, messages: [...state.messages, { id: uuidv4(), isUser: true, text: action.text, timestamp: new Date().toISOString() }] };
    case 'STREAMING_START':
      return { ...state, isStreaming: true, streamingText: '', liveSteps: [] };
    case 'STREAMING_TOKEN':
      return { ...state, streamingText: state.streamingText + action.text };
    case 'STEP_PENDING':
      return { ...state, liveSteps: [...state.liveSteps, { tool: action.tool, agentLabel: action.agentLabel, isPending: true, inProgress: false, success: null }] };
    case 'STEP_START':
      return {
        ...state,
        liveSteps: state.liveSteps.map((s) =>
          s.tool === action.tool ? { ...s, isPending: false, inProgress: true, inputSummary: action.inputSummary } : s
        ),
      };
    case 'STEP_END':
      return {
        ...state,
        liveSteps: state.liveSteps.map((s) =>
          s.tool === action.tool ? { ...s, inProgress: false, success: action.success, outputSummary: action.outputSummary } : s
        ),
      };
    case 'STREAMING_FINAL': {
      const { payload } = action;
      const aiMsg = {
        id: uuidv4(),
        isUser: false,
        text: payload.response_text ?? state.streamingText,
        timestamp: new Date().toISOString(),
        agentSteps: state.liveSteps,
        rankedProviders: payload.ranked_providers,
        selectedProvider: payload.selected_provider,
        bookingResult: payload.booking_result,
        recommendation: payload.recommendation,
        plan: payload.plan,
        reminder: payload.reminder,
        trace: payload.trace,
        requiresClarification: payload.requires_clarification,
        clarificationQuestion: payload.clarification_question,
      };
      return { ...state, messages: [...state.messages, aiMsg], isStreaming: false, streamingText: '', liveSteps: [] };
    }
    case 'STREAMING_ERROR': {
      const errMsg = { id: uuidv4(), isUser: false, text: action.error, timestamp: new Date().toISOString(), agentSteps: [] };
      return { ...state, messages: [...state.messages, errMsg], isStreaming: false, streamingText: '', liveSteps: [] };
    }
    case 'SET_INPUT_MODE': return { ...state, inputMode: action.mode };
    case 'NEW_THREAD': return { ...initialState, threadId: uuidv4() };
    default: return state;
  }
}

export function useDispatchController({ userId, location }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const abortRef = useRef(null);

  const sendMessage = useCallback(async (text) => {
    if (!text.trim() || state.isStreaming) return;
    dispatch({ type: 'ADD_USER_MSG', text });
    dispatch({ type: 'STREAMING_START' });

    const payload = {
      thread_id: state.threadId,
      user_id: userId,
      message: text,
      user_location: location ? { lat: location.lat, lng: location.lng, label: location.areaLabel ?? '' } : undefined,
      utc_offset_minutes: -new Date().getTimezoneOffset(),
    };

    try {
      const response = await apiChatStream(payload);
      abortRef.current = null;

      await readSSEStream(response, (event) => {
        switch (event.type) {
          case 'token':        dispatch({ type: 'STREAMING_TOKEN', text: event.text ?? '' }); break;
          case 'tool_pending': dispatch({ type: 'STEP_PENDING', tool: event.tool, agentLabel: event.agent_label ?? event.tool }); break;
          case 'tool_start':   dispatch({ type: 'STEP_START',   tool: event.tool, inputSummary: event.input_summary }); break;
          case 'tool_end':     dispatch({ type: 'STEP_END',     tool: event.tool, success: event.success, outputSummary: event.output_summary }); break;
          case 'final':        dispatch({ type: 'STREAMING_FINAL', payload: event.payload ?? event }); break;
          default: break;
        }
      });

      // If final event never arrived (backend sends complete payload in last chunk), flush streaming text
      if (state.isStreaming) dispatch({ type: 'STREAMING_FINAL', payload: { response_text: state.streamingText } });
    } catch (err) {
      dispatch({ type: 'STREAMING_ERROR', error: err?.message ?? 'Something went wrong. Please try again.' });
    }
  }, [state.threadId, state.isStreaming, state.streamingText, userId, location]);

  const loadThread = useCallback(async (threadId) => {
    dispatch({ type: 'SET_THREAD', threadId });
    try {
      const data = await apiGetThreadHistory(threadId);
      const msgs = (data?.messages ?? []).map((m) => ({
        id: uuidv4(),
        isUser: m.type === 'human',
        text: m.text ?? '',
        timestamp: m.created_at ?? new Date().toISOString(),
        rankedProviders: m.ranked_providers,
        bookingResult: m.booking_result,
        trace: m.trace,
        agentSteps: [],
      }));
      dispatch({ type: 'SET_MESSAGES', messages: msgs });
    } catch {}
  }, []);

  const newThread = useCallback(() => dispatch({ type: 'NEW_THREAD' }), []);
  const setInputMode = useCallback((mode) => dispatch({ type: 'SET_INPUT_MODE', mode }), []);

  return { state, sendMessage, loadThread, newThread, setInputMode };
}
