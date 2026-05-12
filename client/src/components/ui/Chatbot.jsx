import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User, ExternalLink, Minimize2, Loader2 } from 'lucide-react';
import axios from 'axios';
import './Chatbot.css';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Namaste! I am your AI assistant. How can I help you today?", sender: 'bot', time: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { id: Date.now(), text: input, sender: 'user', time: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:8000/chat', { query: input });
      
      if (response.data && response.data.length > 0) {
        const botResponse = {
          id: Date.now() + 1,
          text: response.data[0].answer,
          url: response.data[0].url,
          confidence: response.data[0].confidence,
          sender: 'bot',
          time: new Date()
        };
        setMessages(prev => [...prev, botResponse]);
      } else {
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          text: "I'm sorry, I couldn't find an answer to that. Could you please rephrase?",
          sender: 'bot',
          time: new Date()
        }]);
      }
    } catch (error) {
      console.error("Chatbot Error:", error);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: "System is offline. Please make sure the backend is running.",
        sender: 'bot',
        time: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chatbot-container">
      {/* Floating Button */}
      <motion.button
        className={`chatbot-toggle ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="chatbot-window"
            initial={{ opacity: 0, y: 100, scale: 0.8, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {/* Header */}
            <div className="chatbot-header">
              <div className="header-info">
                <div className="bot-avatar">
                  <Bot size={20} color="#fff" />
                  <span className="online-indicator"></span>
                </div>
                <div>
                  <h3>AI Assistant</h3>
                  <p>Always Online</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="close-btn">
                <Minimize2 size={18} />
              </button>
            </div>

            {/* Messages Area */}
            <div className="chatbot-messages" data-lenis-prevent>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, x: msg.sender === 'user' ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`message-wrapper ${msg.sender}`}
                >
                  <div className="message-bubble">
                    <p>{msg.text.replace(/â/g, "'").replace(/âs/g, "'s").replace(/â/g, "-")}</p>
                    {msg.url && (
                      <a href={msg.url} target="_blank" rel="noopener noreferrer" className="source-link">
                        Source <ExternalLink size={12} />
                      </a>
                    )}
                    <span className="message-time">
                      {msg.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <motion.div className="message-wrapper bot">
                  <div className="message-bubble typing">
                    <div className="typing-dots">
                      <span></span><span></span><span></span>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form className="chatbot-input" onSubmit={handleSend}>
              <input
                type="text"
                placeholder="Ask me something..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading}
              />
              <button type="submit" disabled={!input.trim() || isLoading}>
                {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Chatbot;
