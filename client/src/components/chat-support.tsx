import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ChatSupport() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hi there! How can I help you with your ride today?", isBot: true }
  ]);
  const [messageInput, setMessageInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll chat to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  
  const toggleChat = () => {
    setIsOpen(!isOpen);
  };
  
  const handleSendMessage = () => {
    if (!messageInput.trim()) return;
    
    // Add user message
    setMessages(prev => [...prev, { text: messageInput, isBot: false }]);
    setMessageInput("");
    
    // Simulate bot response after a delay
    setTimeout(() => {
      setMessages(prev => [
        ...prev, 
        { 
          text: "Thanks for reaching out! A customer support agent will respond to your query shortly.", 
          isBot: true 
        }
      ]);
    }, 1000);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };
  
  return (
    <div className="fixed bottom-20 right-4 z-30">
      <Button 
        onClick={toggleChat}
        size="icon"
        className="h-12 w-12 rounded-full shadow-lg"
      >
        <MessageCircle className="h-5 w-5" />
      </Button>
      
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="bg-primary text-primary-foreground p-3 flex justify-between items-center">
            <h3 className="font-medium">Customer Support</h3>
            <Button variant="ghost" size="icon" onClick={toggleChat} className="h-8 w-8 text-primary-foreground hover:text-primary-foreground/80">
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="h-[300px] p-4 overflow-y-auto bg-gray-50">
            {messages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`flex mb-3 ${msg.isBot ? 'justify-start' : 'justify-end'}`}
              >
                <div 
                  className={`rounded-lg p-3 max-w-[80%] ${
                    msg.isBot 
                      ? 'bg-muted text-foreground' 
                      : 'bg-primary text-primary-foreground'
                  }`}
                >
                  <p className="text-sm">{msg.text}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          
          <div className="p-3 border-t border-muted">
            <div className="flex">
              <Input 
                type="text" 
                placeholder="Type a message..." 
                className="rounded-r-none focus-visible:ring-0"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <Button 
                className="rounded-l-none"
                onClick={handleSendMessage}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
