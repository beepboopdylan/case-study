import { processUserMessage } from "../agent/index.js";

export const getAIMessage = async (userQuery) => {

  const message = processUserMessage(userQuery);

  return {
    "role": "assistant", 
    "content": message.text || message.content || "(No content returned)",
    "products": message.products || [],
    "quickReplies": message.quickReplies || []
  };
};
