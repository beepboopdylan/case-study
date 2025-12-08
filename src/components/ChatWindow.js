import React, { useState, useEffect, useRef } from "react";
import "./ChatWindow.css";
import { getAIMessage } from "../api/api";
import { marked } from "marked";

function ChatWindow() {

  const defaultMessage = [{
    role: "assistant",
    content: "Hi, how can I help you today?"
  }];

  const [messages,setMessages] = useState(defaultMessage)
  const [input, setInput] = useState("");

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
      scrollToBottom();
  }, [messages]);

  const handleSend = async (value) => {

    const trimmed = (value ?? input).trim();

    if (trimmed !== "") {
      // Set user message
      setMessages(prevMessages => [
        ...prevMessages, 
        { role: "user", content: trimmed }]);
      setInput("");

      // Call API & set assistant message
      const newMessage = await getAIMessage(trimmed);

      setMessages(prevMessages => [...prevMessages, newMessage]);
    }
  };

  return (
      <div className="messages-container">
          {messages.map((message, index) => (
              <div key={index} className={`${message.role}-message-container`}>
                  {message.content && (
                      <div className={`message ${message.role}-message`}>
                          <div dangerouslySetInnerHTML={{__html: marked(message.content).replace(/<p>|<\/p>/g, "")}}></div>
                      </div>
                  )}
                  {message.products && message.products.length > 0 && (
                      <div className="products-container">
                          {message.products.map((product, productIndex) => (
                              <div key={productIndex} className="product-card">
                                  {product.imageUrl && (
                                      <img src={product.imageUrl} alt={product.name} className="product-image" />
                                  )}
                                  <div className="product-info">
                                      <div className="product-name">{product.name}</div>
                                      <div className="product-part-number">{product.partNumber}</div>
                                      {product.description && (
                                          <div className="product-description">{product.description}</div>
                                      )}
                                      {product.compatibleModels && product.compatibleModels.length > 0 && (
                                          <div className="product-compatible">
                                              Compatible with: {product.compatibleModels.join(", ")}
                                          </div>
                                      )}
                                  </div>
                              </div>
                          ))}
                      </div>
                  )}
              </div>
          ))}
          <div ref={messagesEndRef} />
          <div className="input-area">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              onKeyPress={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  handleSend(input);
                  e.preventDefault();
                }
              }}
              rows="3"
            />
            <button className="send-button" onClick={() => handleSend(input)}>
              Send
            </button>
          </div>
      </div>
);
}

export default ChatWindow;
