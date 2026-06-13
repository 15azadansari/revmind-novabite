const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function askLLM(question, dataContext) {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const prompt = `You are a business analyst for NovaBite Consumer Goods, a CPG company.
Answer the user's question using ONLY the data context provided below.
Be concise, specific, and use exact numbers from the data. If the data doesn't contain
enough information to answer the question, say so clearly.

DATA CONTEXT:
${dataContext}

QUESTION: ${question}

ANSWER:`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}

module.exports = { askLLM };