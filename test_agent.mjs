// Test script for the agent
import { processUserMessage } from './src/agent/index.js';

const testCases = [
  {
    name: "Installation with part number",
    input: "How do I install PS11752778?",
    expectedIntent: "install",
    shouldContain: ["installation instructions", "Refrigerator Door Gasket", "PS11752778"]
  },
  {
    name: "Compatibility check",
    input: "Is PS11752778 compatible with my WDT780SAEM1 model?",
    expectedIntent: "compatible",
    shouldContain: ["PS11752778", "WDT780SAEM1"]
  },
  {
    name: "Installation without part number",
    input: "I need installation help",
    expectedIntent: "install",
    shouldContain: ["installation", "part number"]
  },
  {
    name: "Troubleshooting",
    input: "My refrigerator ice maker is not working",
    expectedIntent: "troubleshoot",
    shouldContain: ["issue", "ice"]
  },
  {
    name: "General part lookup",
    input: "Tell me about PS11752778",
    expectedIntent: "general_support",
    shouldContain: ["PS11752778", "Refrigerator Door Gasket"]
  },
  {
    name: "Out of scope - weather",
    input: "What's the weather today?",
    expectedIntent: "Out of scope",
    shouldContain: ["refrigerator", "dishwasher", "PartSelect"]
  },
  {
    name: "Compatibility without model",
    input: "Is PS11752778 compatible?",
    expectedIntent: "compatible",
    shouldContain: ["model number"]
  },
  {
    name: "Order support",
    input: "I want to return my order",
    expectedIntent: "order_support",
    shouldContain: ["return", "refund", "customer service"]
  }
];

console.log("🧪 Testing Agent Responses\n");
console.log("=".repeat(60));

let passed = 0;
let failed = 0;

for (const testCase of testCases) {
  console.log(`\n📝 Test: ${testCase.name}`);
  console.log(`   Input: "${testCase.input}"`);
  
  try {
    const result = processUserMessage(testCase.input);
    const resultText = result.text.toLowerCase();
    
    // Check if response contains expected keywords
    const allKeywordsFound = testCase.shouldContain.every(keyword => 
      resultText.includes(keyword.toLowerCase())
    );
    
    if (allKeywordsFound) {
      console.log(`   ✅ PASSED`);
      console.log(`   Response preview: ${result.text.substring(0, 100)}...`);
      passed++;
    } else {
      console.log(`   ❌ FAILED`);
      const missing = testCase.shouldContain.filter(k => !resultText.includes(k.toLowerCase()));
      console.log(`   Missing keywords: ${missing.join(", ")}`);
      console.log(`   Response: ${result.text.substring(0, 200)}`);
      failed++;
    }
  } catch (error) {
    console.log(`   ❌ ERROR: ${error.message}`);
    console.log(`   Stack: ${error.stack}`);
    failed++;
  }
}

console.log("\n" + "=".repeat(60));
console.log(`\n📊 Results: ${passed} passed, ${failed} failed`);

