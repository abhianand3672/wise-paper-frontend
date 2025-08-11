import { useState } from 'react';

const AIAssistant = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: "Hello! I'm your AI research assistant. I can help you understand research papers, answer questions about academic topics, and provide explanations in simple terms. What would you like to know?"
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: input
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/ai/answer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ question: input })
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      let content = '';
      if (data.success && typeof data.answer === 'string') {
        content = data.answer;
      } else {
        content = "Looks like API rate limit exceeded.Please contact the admin or try again after some time.";
      }
      setMessages(prev => [...prev, { id: Date.now() + 1, type: 'ai', content }]);
    } catch (error) {
      setMessages(prev => [...prev, { id: Date.now() + 1, type: 'ai', content: "Sorry, there was an error connecting to the AI service. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-4">AI Research Assistant</h1>
        <p className="text-gray-600">Ask me about science, engineering, medicine, research papers, or academic subjects!</p>
        <p className="text-sm text-gray-500 mt-2">I specialize in academic and research-related questions only.</p>
      </div>
      <div className="bg-white rounded-lg shadow-lg p-6">
        {/* Chat Messages */}
        <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${message.type === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'}`}>
                <p className="text-sm">{message.content}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span className="text-sm">AI is thinking...</span>
                </div>
              </div>
            </div>
          )}
        </div>
        {/* Input Area */}
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about science, engineering, medicine, research papers, or academic subjects..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </div>
        {/* Quick Questions */}
        <div className="mt-6">
          <p className="text-sm text-gray-600 mb-3">Academic questions to try:</p>
          <div className="flex flex-wrap gap-2">
            {[
              "What is machine learning?",
              "Explain quantum computing",
              "How does CRISPR work?",
              "What are neural networks?",
              "Explain the theory of relativity",
              "How do vaccines work?"
            ].map((question, index) => (
              <button
                key={index}
                onClick={() => setInput(question)}
                className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full text-gray-700 transition-colors"
              >
                {question}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-2">I can help with science, engineering, medicine, research papers, and academic subjects.</p>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant; 