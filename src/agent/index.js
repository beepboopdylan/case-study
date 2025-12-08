import { detectIntent } from './user_intentions.js';
import {
  getPartsByNumber,
  getInstallInstructions,
  isPartCompatibleWithModel,
  troubleshootIssue,
} from './tools.js';

function extractPartNumber(message) {
    const psMatch = message.match(/ps\d+/i);
    if (psMatch) return psMatch[0].toUpperCase();
    
    // Also check for other part number formats like "ICE-MAKER-ASSY"
    // Look for all-caps words with hyphens or alphanumeric codes
    const otherMatch = message.match(/\b[A-Z]+(?:-[A-Z]+)+\b/);
    if (otherMatch) return otherMatch[0].toUpperCase();
    
    return null;
}

function extractModelNumber(message) {
    const matches = message.match(/\b[A-Z]{2,4}\d{3,}[A-Z0-9]{2,}\b/gi);
    if (!matches) return null;
    
    // Filter out part numbers (PS followed by digits)
    const modelMatch = matches.find(m => !m.toUpperCase().startsWith('PS'));
    return modelMatch ? modelMatch.toUpperCase() : null;
}

export function processUserMessage(message) {
    const intent = detectIntent(message);

    // Handle out of scope
    if (intent.type === "Out of scope") {
        return {
            text: "I'm here to help with refrigerator and dishwasher parts on PartSelect — things like finding parts, checking compatibility, installation, and basic troubleshooting. " +
            "Tell me your appliance type, model number, and what you're trying to do.",
            quickReplies: [
                "Installation help",
                "Check compatibility",
                "Troubleshooting"
            ]
        };
    }

    const partNumber = extractPartNumber(message);
    const modelNumber = extractModelNumber(message);

    // Handle install intent
    if (intent.type === 'install') {
        if (!partNumber) {
            return {
                text: "I'd be happy to help with installation! Which part number do you need installation instructions for? (e.g., PS11752778)",
                quickReplies: [
                    "PS11752778 installation",
                    "Find a part number"
                ]
            };
        }

        const installSteps = getInstallInstructions(partNumber);
        const part = getPartsByNumber(partNumber);

        if (!installSteps || !part) {
            return {
                text: `I couldn't find installation instructions for part number ${partNumber}. Please verify the part number, or contact our support team for assistance.`,
                quickReplies: [
                    "Check compatibility",
                    "Find similar parts"
                ]
            };
        }

        const stepsText = installSteps
            .map((step, index) => `${index + 1}. ${step}`)
            .join('\n\n');

        return {
            text: `Here are the installation instructions for **${part.name}** (${partNumber}):\n\n${stepsText}\n\n**Safety reminder:** Always unplug your appliance before starting any installation.`,
            products: [part],
            quickReplies: [
                "Check compatibility",
                "Find similar parts",
                "Order support"
            ]
        };
    }

    // Handle compatibility intent
    if (intent.type === 'compatible') {
        if (!partNumber && !modelNumber) {
            return {
                text: "To check compatibility, I'll need both a part number and a model number. Which part are you asking about, and what's your appliance model number?",
                quickReplies: [
                    "PS11752778 with WDT780SAEM1",
                    "How to find model number"
                ]
            };
        }

        if (!partNumber) {
            return {
                text: "Which part number are you asking about? (e.g., PS11752778)",
                quickReplies: [
                    "PS11752778",
                    "ICE-MAKER-ASSY"
                ]
            };
        }

        if (!modelNumber) {
            return {
                text: `What's your appliance model number? (e.g., WDT780SAEM1) This is usually found on a label inside the appliance.`,
                quickReplies: [
                    "WDT780SAEM1",
                    "How to find model number"
                ]
            };
        }

        const part = getPartsByNumber(partNumber);
        if (!part) {
            return {
                text: `I couldn't find part number ${partNumber}. Please verify the part number and try again.`,
                quickReplies: [
                    "Find a part",
                    "Check another part"
                ]
            };
        }

        const compatibility = isPartCompatibleWithModel(part, modelNumber);

        if (compatibility.compatible) {
            return {
                text: `**Yes!** Part ${partNumber} (${part.name}) is compatible with model ${modelNumber}.\n\n${compatibility.message}\n\nWould you like installation instructions or help ordering this part?`,
                products: [part],
                quickReplies: [
                    "Installation instructions",
                    "Order this part",
                    "Check another part"
                ]
            };
        } else {
            return {
                text: `Part ${partNumber} (${part.name}) is **not compatible** with model ${modelNumber}.\n\n${compatibility.message}`,
                products: [],
                quickReplies: [
                    "Find compatible parts",
                    "Check another model",
                    "Installation help"
                ]
            };
        }
    }

    // Handle troubleshoot intent
    if (intent.type === 'troubleshoot') {
        const lowerMessage = message.toLowerCase();
        let applianceType = null;
        
        if (lowerMessage.includes('refrigerator') || lowerMessage.includes('fridge') || lowerMessage.includes('freezer')) {
            applianceType = 'refrigerator';
        } else if (lowerMessage.includes('dishwasher')) {
            applianceType = 'dishwasher';
        }

        const suggestedParts = troubleshootIssue({ applianceType, symptom: message });

        if (suggestedParts.length === 0) {
            return {
                text: "I understand you're having an issue. Could you provide more details about:\n\n• What appliance are you working with? (refrigerator or dishwasher)\n• What specific problem are you experiencing?\n\nFor example: 'The ice maker on my Whirlpool fridge is not working.'",
                quickReplies: [
                    "Ice maker not working",
                    "Door not sealing",
                    "Rack not sliding"
                ]
            };
        }

        let responseText = "Here are some suggested parts that might help with your issue:\n\n";
        if (applianceType === 'refrigerator' && lowerMessage.includes('ice')) {
            responseText += "For ice maker issues, you may need to replace the ice maker assembly. Here are some options:";
        }

        return {
            text: responseText,
            products: suggestedParts,
            quickReplies: [
                "Installation help",
                "Check compatibility",
                "Order support"
            ]
        };
    }

    // Handle order support intent
    if (intent.type === 'order_support') {
        const lowerMessage = message.toLowerCase();
        
        if (lowerMessage.includes('return') || lowerMessage.includes('refund')) {
            return {
                text: "For returns and refunds, please contact our customer service team:\n\n• **Phone:** 1-800-PARTS-01\n• **Email:** support@partselect.com\n• **Hours:** Mon-Fri 8am-8pm EST\n\nHave your order number ready when you call.",
                quickReplies: [
                    "Track my order",
                    "Installation help"
                ]
            };
        }

        if (lowerMessage.includes('track') || lowerMessage.includes('shipping') || lowerMessage.includes('delivery')) {
            return {
                text: "To track your order:\n\n1. Check your email for a shipping confirmation with tracking number\n2. Visit our website and log into your account\n3. Or call customer service at 1-800-PARTS-01\n\nDo you have your order number?",
                quickReplies: [
                    "Return/refund info",
                    "Installation help"
                ]
            };
        }

        return {
            text: "I can help with basic order questions. What do you need?\n\n• Track an order\n• Return or refund\n• Shipping questions\n• Order status",
            quickReplies: [
                "Track my order",
                "Return/refund info",
                "Installation help"
            ]
        };
    }

    // Handle general support or part lookup
    if (partNumber) {
        const part = getPartsByNumber(partNumber);
        if (part) {
            return {
                text: `I found **${part.name}** (${partNumber}):\n\n${part.description}\n\nHow can I help you with this part?`,
                products: [part],
                quickReplies: [
                    "Check compatibility",
                    "Installation instructions",
                    "Order this part"
                ]
            };
        }
    }

    // Default general response
    return {
        text: "I can help you with refrigerator and dishwasher parts. What would you like to know?\n\n• Find a part\n• Installation instructions\n• Compatibility questions\n• Troubleshooting",
        quickReplies: [
            "Installation help",
            "Check compatibility",
            "Troubleshooting"
        ]
    };
}