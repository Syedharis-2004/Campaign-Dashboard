import React, { useState } from 'react';
import { Sparkles, Download, Loader2 } from 'lucide-react';

export default function CreativeBuilder() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [form, setForm] = useState({
    clientName: '',
    industry: '',
    objective: '',
    budget: '',
    tone: 'Professional',
    keywords: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult('');
    
    // Simulate AI SSE Streaming connection
    try {
      const response = await fetch('http://localhost:5001/generate/copy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: `Create a campaign for ${form.clientName} in ${form.industry}. Objective: ${form.objective}. Budget: ${form.budget}.`,
          tone: form.tone,
          keywords: form.keywords.split(',').map(k => k.trim())
        })
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.replace('data: ', '');
            if (dataStr === '[DONE]') break;
            try {
              const data = JSON.parse(dataStr);
              if (data.text) {
                setResult(prev => (prev || '') + data.text);
              }
            } catch (e) {}
          }
        }
      }
    } catch (error) {
      setResult('Failed to generate copy. Ensure AI microservice is running.');
    } finally {
      setLoading(false);
    }
  };

  const Step1 = () => (
    <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
      <h2 className="text-xl font-bold dark:text-white mb-6">Step 1: Client Details</h2>
      <div>
        <label className="block text-sm font-medium dark:text-gray-300 mb-1">Client Name</label>
        <input type="text" className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg dark:text-white"
          value={form.clientName} onChange={e => setForm({...form, clientName: e.target.value})} placeholder="Acme Corp" required/>
      </div>
      <div>
        <label className="block text-sm font-medium dark:text-gray-300 mb-1">Industry</label>
        <input type="text" className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg dark:text-white"
          value={form.industry} onChange={e => setForm({...form, industry: e.target.value})} placeholder="E-commerce" required/>
      </div>
      <div className="flex justify-end pt-4">
        <button type="button" onClick={() => setStep(2)} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700">Next</button>
      </div>
    </div>
  );

  const Step2 = () => (
    <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
      <h2 className="text-xl font-bold dark:text-white mb-6">Step 2: Campaign Strategy</h2>
      <div>
        <label className="block text-sm font-medium dark:text-gray-300 mb-1">Objective</label>
        <select className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg dark:text-white"
          value={form.objective} onChange={e => setForm({...form, objective: e.target.value})}>
          <option value="">Select Objective</option>
          <option>Brand Awareness</option>
          <option>Lead Generation</option>
          <option>Sales Conversion</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium dark:text-gray-300 mb-1">Budget Setup</label>
        <input type="text" className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg dark:text-white"
          value={form.budget} onChange={e => setForm({...form, budget: e.target.value})} placeholder="$50,000" />
      </div>
      <div className="flex justify-between pt-4">
        <button type="button" onClick={() => setStep(1)} className="px-6 py-2 text-gray-600 dark:text-gray-400 font-medium">Back</button>
        <button type="button" onClick={() => setStep(3)} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700">Next</button>
      </div>
    </div>
  );

  const Step3 = () => (
    <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
      <h2 className="text-xl font-bold dark:text-white mb-6">Step 3: Creative Direction</h2>
      <div>
        <label className="block text-sm font-medium dark:text-gray-300 mb-1">Tone of Voice</label>
        <select className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg dark:text-white"
          value={form.tone} onChange={e => setForm({...form, tone: e.target.value})}>
          <option>Professional</option>
          <option>Playful</option>
          <option>Urgent</option>
          <option>Inspirational</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium dark:text-gray-300 mb-1">Keywords (comma separated)</label>
        <input type="text" className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg dark:text-white"
          value={form.keywords} onChange={e => setForm({...form, keywords: e.target.value})} placeholder="innovation, fast, seamless" />
      </div>
      <div className="flex justify-between pt-4">
        <button type="button" onClick={() => setStep(2)} className="px-6 py-2 text-gray-600 dark:text-gray-400 font-medium">Back</button>
        <button type="submit" disabled={loading} className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-medium flex items-center space-x-2 disabled:opacity-70">
          {loading ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
          <span>Generate Brief</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden flex">
        
        {/* Progress Sidebar */}
        <div className="w-1/3 bg-gray-50 dark:bg-gray-900/50 p-8 border-r border-gray-100 dark:border-gray-700 hidden md:block">
          <h3 className="text-lg font-semibold mb-8 dark:text-white flex items-center gap-2"><Sparkles className="text-purple-500"/> AI Builder</h3>
          <div className="space-y-6">
            {[1, 2, 3].map(num => (
              <div key={num} className={`flex items-center space-x-3 ${step >= num ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 opacity-50'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= num ? 'border-blue-600 dark:border-blue-400 font-bold' : 'border-gray-400'}`}>
                  {num}
                </div>
                <span className="font-medium">
                  {num === 1 ? 'Client Details' : num === 2 ? 'Strategy' : 'Creative'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Form Area */}
        <div className="flex-1 p-8">
          <form onSubmit={handleSubmit}>
            {step === 1 && <Step1 />}
            {step === 2 && <Step2 />}
            {step === 3 && <Step3 />}
          </form>

          {/* Result Area */}
          {(result || loading) && (
            <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-700 animate-in fade-in zoom-in-95">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold dark:text-white">Generated Brief</h3>
                {result && !loading && (
                   <button className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-700 font-medium">
                     <Download size={16} /> <span>Export PDF</span>
                   </button>
                )}
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-xl relative min-h-[150px]">
                 {loading && !result && (
                   <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                     <Loader2 className="animate-spin w-8 h-8 text-blue-500" />
                   </div>
                 )}
                 <div className="prose dark:prose-invert max-w-none text-sm leading-relaxed whitespace-pre-wrap">
                   {result}
                 </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
