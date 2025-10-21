import { useState } from 'react';
import axios from 'axios';
import Head from 'next/head';

// Template options - can be edited/expanded
const TEMPLATES = [
  { value: 'You are a helpful assistant.', label: 'Default Assistant' },
  { value: 'You are a creative writer who helps craft engaging stories and narratives.', label: 'Creative Writer' },
  { value: 'You are a technical expert who provides detailed, accurate explanations of complex topics.', label: 'Technical Expert' },
  { value: 'You are a friendly teacher who explains concepts in simple, easy-to-understand terms.', label: 'Friendly Teacher' },
  { value: 'You are a professional business consultant who provides strategic advice and insights.', label: 'Business Consultant' },
  { value: 'You are a code expert who helps debug, optimize, and explain programming concepts.', label: 'Code Expert' },
];

// Model options - comprehensive list from Together AI
const MODELS = [
  { value: 'meta-llama/Llama-Guard-3-11B-Vision-Turbo', label: 'Llama Guard 4 12B' },
  { value: 'openai/gpt-oss-20b', label: 'OpenAI GPT-OSS 20B' },
  { value: 'moonshot/kimi-k2-instruct-0905', label: 'Kimi K2‑Instruct 0905' },
  { value: 'Qwen/Qwen3-Next-80B-A3b-Instruct', label: 'Qwen3 Next 80B A3b Instruct' },
  { value: 'Qwen/Qwen3-Next-80B-A3b-Thinking', label: 'Qwen3 Next 80B A3b Thinking' },
  { value: 'Qwen/Qwen3-235B-A22B-Thinking-2507-FP8', label: 'Qwen3 235B A22B Thinking 2507 FP8' },
  { value: 'Qwen/Qwen3-Coder-480B-A35B-Instruct-Fp8', label: 'Qwen3 Coder 480B A35B Instruct Fp8' },
  { value: 'deepseek-ai/DeepSeek-R1-0528', label: 'DeepSeek R1‑0528' },
  { value: 'moonshot/kimi-k2-instruct', label: 'Kimi K2 Instruct' },
  { value: 'deepseek-ai/DeepSeek-V3-0324', label: 'DeepSeek V3‑0324' },
  { value: 'Qwen/Qwen3-235B-A22B-Instruct-2507-FP8-Throughput', label: 'Qwen3 235B A22B Instruct 2507 FP8 Throughput' },
  { value: 'meta-llama/Llama-4-Maverick-Instruct-17Bx128E', label: 'Llama 4 Maverick Instruct (17Bx128E)' },
  { value: 'google/gemma-3n-e4b-instruct', label: 'Gemma 3N E4B Instruct' },
  { value: 'black-forest-labs/FLUX.1-krea-dev', label: 'FLUX.1 Krea [dev]' },
  { value: 'black-forest-labs/FLUX.1-kontext-dev', label: 'FLUX.1 Kontext [dev]' },
  { value: 'meta-llama/Meta-Llama-3.3-70B-Instruct-Turbo', label: 'Meta Llama 3.3 70B Instruct Turbo' },
  { value: 'zhipu/glm-4.5-air-fp8', label: 'Glm 4.5 Air Fp8' },
  { value: 'meta-llama/Meta-Llama-3.3-70B-Instruct-Turbo-Free', label: 'Meta Llama 3.3 70B Instruct Turbo Free' },
  { value: 'mistralai/Mixtral-8x7B-Instruct-v0.1', label: 'Mixtral‑8x7B Instruct v0.1' },
  { value: 'mistralai/Mistral-7B-Instruct-v0.1', label: 'Mistral (7B) Instruct v0.1' },
  { value: 'black-forest-labs/FLUX.1-kontext-pro', label: 'FLUX.1 Kontext [pro]' },
  { value: 'black-forest-labs/FLUX.1-kontext-max', label: 'FLUX.1 Kontext [max]' },
  { value: 'Qwen/Qwen2.5-VL-72B-Instruct', label: 'Qwen2.5‑VL (72B) Instruct' },
  { value: 'meta-llama/Llama-4-Scout-Instruct-17Bx16E', label: 'Llama 4 Scout Instruct (17Bx16E)' },
  { value: 'marin/marin-8b-instruct', label: 'Marin 8B Instruct' },
  { value: 'intfloat/multilingual-e5-large-instruct', label: 'Multilingual E5 Large Instruct' },
  { value: 'deepseek-ai/DeepSeek-R1-0528-Throughput', label: 'DeepSeek R1 0528 Throughput' },
  { value: 'answerdotai/gte-modernbert-base', label: 'Gte Modernbert Base' },
  { value: 'refuel-ai/Refuel-LLM-V2-Small', label: 'Refuel LLM V2 Small' },
  { value: 'refuel-ai/Refuel-LLM-V2', label: 'Refuel LLM V2' },
  { value: 'cartesia/sonic-2', label: 'Cartesia Sonic 2' },
  { value: 'cartesia/sonic', label: 'Cartesia Sonic' },
  { value: 'mistralai/Mistral-Small-24B-Instruct-25.01', label: 'Mistral Small (24B) Instruct 25.01' },
  { value: 'Qwen/QwQ-32B', label: 'Qwen QwQ‑32B' },
  { value: 'deepseek-ai/DeepSeek-R1-Distill-Llama-70B', label: 'DeepSeek R1 Distill Llama 70B' },
  { value: 'deepseek-ai/DeepSeek-R1-Distill-Qwen-14B', label: 'DeepSeek R1 Distill Qwen 14B' },
  { value: 'deepseek-ai/DeepSeek-R1-Distill-Llama-70B-Free', label: 'DeepSeek R1 Distill Llama 70B Free' },
  { value: 'meta-llama/Meta-Llama-3.1-405B-Instruct-Turbo', label: 'Meta Llama 3.1 405B Instruct Turbo' },
  { value: 'Qwen/Qwen3-235B-A22B-FP8-Throughput', label: 'Qwen3 235B A22B FP8 Throughput' },
  { value: 'black-forest-labs/FLUX.1-dev', label: 'FLUX.1 [dev]' },
  { value: 'black-forest-labs/FLUX.1-dev-lora', label: 'FLUX.1 [dev] LoRA' },
  { value: 'black-forest-labs/FLUX.1-schnell', label: 'FLUX.1 Schnell' },
  { value: 'black-forest-labs/FLUX1.1-pro', label: 'FLUX1.1 [pro]' },
  { value: 'black-forest-labs/FLUX.1-pro', label: 'FLUX.1 [pro]' },
  { value: 'black-forest-labs/FLUX.1-schnell-Free', label: 'FLUX.1 [schnell] Free' },
  { value: 'arcee-ai/arcee-spotlight', label: 'Arcee AI Spotlight' },
  { value: 'meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo', label: 'Meta Llama 3.1 70B Instruct Turbo' },
  { value: 'Qwen/Qwen2.5-72B-Instruct-Turbo', label: 'Qwen2.5 72B Instruct Turbo' },
  { value: 'Qwen/Qwen2.5-7B-Instruct-Turbo', label: 'Qwen2.5 7B Instruct Turbo' },
  { value: 'meta-llama/Meta-Llama-3.2-3B-Instruct-Turbo', label: 'Meta Llama 3.2 3B Instruct Turbo' },
  { value: 'meta-llama/Meta-Llama-Guard-3-11B-Vision-Turbo', label: 'Meta Llama Guard 3 11B Vision Turbo' },
  { value: 'salesforce/llama-rank-v1-8b', label: 'Salesforce Llama Rank V1 (8B)' },
  { value: 'meta-llama/Meta-Llama-Guard-3-8B', label: 'Meta Llama Guard 3 8B' },
  { value: 'meta-llama/Meta-Llama-3-70B-Instruct-Turbo', label: 'Meta Llama 3 70B Instruct Turbo' },
  { value: 'meta-llama/Meta-Llama-3-8B-Instruct-Lite', label: 'Meta Llama 3 8B Instruct Lite' },
  { value: 'meta-llama/Meta-Llama-3-70B-Instruct-Reference', label: 'Meta Llama 3 70B Instruct Reference' },
  { value: 'mistralai/Mistral-7B-Instruct-v0.3', label: 'Mistral (7B) Instruct v0.3' },
  { value: 'meta-llama/Meta-Llama-Guard-2-8B', label: 'Meta Llama Guard 2 8B' },
  { value: 'meta-llama/Llama-2-70b-hf', label: 'LLaMA‑2 (70B)' },
  { value: 'arcee-ai/arcee-virtuoso-large', label: 'Arcee AI Virtuoso‑Large' },
  { value: 'arcee-ai/arcee-coder-large', label: 'Arcee AI Coder‑Large' },
  { value: 'arcee-ai/arcee-maestro', label: 'Arcee AI Maestro' },
  { value: 'scb10x/typhoon-2.1-12b', label: 'Typhoon 2.1 12B' },
  { value: 'mixedbread-ai/mxbai-rerank-large-v2', label: 'Mxbai Rerank Large V2' },
  { value: 'openai/whisper-large-v3', label: 'Whisper large‑v3' },
  { value: 'virtueguard/virtueguard-text-lite', label: 'Virtueguard Text Lite' },
  { value: 'deepcogito/cogito-v2-preview-deepseek-671b-moe', label: 'Cogito V2 Preview Deepseek 671B MoE' },
  { value: 'deepcogito/cogito-v2-preview-llama-109b-moe', label: 'Cogito V2 Preview Llama 109B MoE' },
  { value: 'arize-ai/Qwen2-1.5B-Instruct', label: 'Arize AI Qwen 2 1.5B Instruct' },
  { value: 'jinaai/m2-bert-retrieval-32k', label: 'M2‑BERT‑Retrieval‑32k' },
  { value: 'deepcogito/cogito-v2-preview-llama-70b', label: 'Deepcogito Cogito V2 Preview Llama 70B' },
  { value: 'deepcogito/cogito-v2-preview-llama-405b', label: 'Deepcogito Cogito V2 Preview Llama 405B' },
  { value: 'arcee-ai/arcee-afm-4.5b', label: 'Arcee AI AFM 4.5B' },
  { value: 'Qwen/Qwen2.5-Coder-32B-Instruct', label: 'Qwen 2.5 Coder 32B Instruct' },
  { value: 'openai/gpt-oss-120b', label: 'OpenAI GPT‑OSS 120B' },
  { value: 'jinaai/m2-bert-retrieval-2k', label: 'M2‑BERT‑Retrieval‑2K' },
  { value: 'jinaai/m2-bert-retrieval-8k', label: 'M2‑BERT‑Retrieval‑8k' },
  { value: 'whiterabbitneo/uae-large-v1', label: 'UAE‑Large‑V1' },
  { value: 'meta-llama/Llama-Guard-7b', label: 'Llama Guard (7B)' },
  { value: 'codellama/CodeLlama-34b-Instruct-hf', label: 'Code Llama Instruct (34B)' },
  { value: 'BAAI/bge-large-en-v1.5', label: 'BAAI‑Bge‑Large‑1.5' },
  { value: 'nvidia/Nemotron-Nano-9B-v2', label: 'Nvidia Nemotron Nano 9B V2' },
  { value: 'apriel/apriel-1.5-15b-thinker', label: 'Apriel 1.5 15B Thinker' },
  { value: 'deepseek-ai/DeepSeek-V3.1', label: 'Deepseek V3.1' },
  { value: 'meta-llama/Llama-2-13b-chat-hf', label: 'LLaMA‑2 Chat (13B)' },
  { value: 'deepseek-ai/deepseek-llm-67b-chat', label: 'DeepSeek LLM Chat (67B)' },
  { value: 'meta-llama/Meta-Llama-3-70B-Instruct-Lite', label: 'Meta Llama 3 70B Instruct Lite' },
  { value: 'upstage/SOLAR-10.7B-Instruct-v1.0', label: 'Upstage SOLAR Instruct v1 (11B)' },
  { value: 'BAAI/bge-base-en-v1.5', label: 'BAAI‑Bge‑Base‑1.5' },
];

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [template, setTemplate] = useState(TEMPLATES[0].value);
  const [model, setModel] = useState('');
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset states
    setAnswer('');
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('/api/ask', {
        prompt,
        template,
        model: model || undefined, // Let backend handle fallback
      });

      setAnswer(response.data.answer);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
        if (err.response.data.details) {
          setError(`${err.response.data.error}\nDetails: ${err.response.data.details}`);
        }
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
      console.error('Request failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Together AI Chat Interface</title>
        <meta name="description" content="Chat interface powered by Together AI" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Together AI Chat
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Powered by Together AI with multiple models and templates
            </p>
          </div>

          {/* Main Form */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Template Selection */}
              <div>
                <label htmlFor="template" className="block text-sm font-medium mb-2">
                  Template
                </label>
                <select
                  id="template"
                  value={template}
                  onChange={(e) => setTemplate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {TEMPLATES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Model Selection */}
              <div>
                <label htmlFor="model" className="block text-sm font-medium mb-2">
                  Model <span className="text-gray-500 text-xs">(optional - defaults to Llama 3.1 70B)</span>
                </label>
                <select
                  id="model"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Default (Meta Llama 3.1 70B Instruct Turbo)</option>
                  {MODELS.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Prompt Input */}
              <div>
                <label htmlFor="prompt" className="block text-sm font-medium mb-2">
                  Your Prompt
                </label>
                <textarea
                  id="prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Enter your question or prompt here..."
                  rows={6}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !prompt.trim()}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  'Send Prompt'
                )}
              </button>
            </form>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Error</h3>
                  <div className="mt-2 text-sm text-red-700 dark:text-red-300 whitespace-pre-wrap">
                    {error}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Answer Display */}
          {answer && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Response
              </h2>
              <div className="prose dark:prose-invert max-w-none">
                <pre className="whitespace-pre-wrap break-words bg-gray-50 dark:bg-gray-900 p-4 rounded-lg text-sm overflow-x-auto">
                  {answer}
                </pre>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}

