/**
 * Consolidate duplicate chat implementation into unified messageController.ts
 * Both /chat and /messages now route through authoritative conversation & messaging pipeline.
 */
import { getMessages, sendMessage } from './messageController';

export const getChatMessages = getMessages;
export const sendChatMessage = sendMessage;

export default {
  getChatMessages,
  sendChatMessage,
};
