export function detectIntent(message) {
    const messageLower = message.toLowerCase();
  
    const hasPartLikePattern =
      /ps\d+/i.test(message) || 
      /\b[A-Z]+(?:-[A-Z]+)+\b/.test(message); 
  
    const hasModelLikePattern =
      /\b[A-Z]{2,4}\d{3,}[A-Z0-9]{2,}\b/i.test(message);
  
    const hasApplianceKeyword =
      messageLower.includes('fridge') ||
      messageLower.includes('refrigerator') ||
      messageLower.includes('dishwasher') ||
      messageLower.includes('whirlpool');
  
    const hasTaskKeyword =
      messageLower.includes('install') ||
      messageLower.includes('replace') ||
      messageLower.includes('compatible') ||
      messageLower.includes('fit') ||
      messageLower.includes('work with') ||
      messageLower.includes('part') ||
      messageLower.includes('model') ||
      messageLower.includes('order') ||
      messageLower.includes('buy') ||
      messageLower.includes('return') ||
      messageLower.includes('shipping') ||
      messageLower.includes('refund') ||
      messageLower.includes('troubleshoot') ||
      messageLower.includes('broken') ||
      messageLower.includes('not working') ||
      messageLower.includes('leak');
  
    const inDomain =
      hasApplianceKeyword ||
      hasTaskKeyword ||
      hasPartLikePattern ||
      hasModelLikePattern;
  
    if (!inDomain) {
      return { type: 'Out of scope' };
    }
    
    if (messageLower.includes('install') || messageLower.includes('replace')) {
      return { type: 'install' };
    }
  
    if (
      messageLower.includes('broken') ||
      messageLower.includes('not working') ||
      messageLower.includes('leak')
    ) {
      return { type: 'troubleshoot' };
    }
  
    if (
      messageLower.includes('work with') ||
      messageLower.includes('compatible with') ||
      messageLower.includes('compatible') ||
      messageLower.includes('fit')
    ) {
      return { type: 'compatible' };
    }
  
    if (
      messageLower.includes('order') ||
      messageLower.includes('buy') ||
      messageLower.includes('return') ||
      messageLower.includes('shipping') ||
      messageLower.includes('refund')
    ) {
      return { type: 'order_support' };
    }
  
    return { type: 'general_support' };
  }
