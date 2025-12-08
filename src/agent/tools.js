import { PARTS, MODELS } from './mock_data.js';

export function getPartsByNumber(partNumber) {
    if (!partNumber) {
        return null;
    }
    return PARTS.find(part => part.partNumber.toLowerCase() === partNumber.toLowerCase()) || null;
}

export function getInstallInstructions(partNumber) {
    const part = getPartsByNumber(partNumber);
    if (!part) {
        return null;
    }
    return part.installSteps || null;
}

export function isPartCompatibleWithModel(part, model) {
    if (!part) {
        return {
            compatible: false,
            message: 'Part not found',
        }
    }
    if (!model) {
        return {
            compatible: false,
            message: 'Model number missing',
        }
    }

    const compatible = part.compatibleModels?.includes(model) || false;

    return {
        compatible,
        message: compatible
        ? 'This model is listed as compatible for this part.'
        : 'This model is not listed as compatible for this part.',
    };
}

export function troubleshootIssue({ applianceType, symptom }) {
    const lower = (symptom || '').toLowerCase();
    const suggestions = [];
  
    if (applianceType === 'refrigerator' && lower.includes('ice')) {
      const iceParts = PARTS.filter(p =>
        p.name.toLowerCase().includes('ice') ||
        p.partNumber.toLowerCase().includes('ice')
      );
      suggestions.push(...iceParts);
    }

    return suggestions;
}