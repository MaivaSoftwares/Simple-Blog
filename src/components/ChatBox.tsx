import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Message {
  id: number;
  author: "user" | "assistant";
  text: string;
}

export function ChatBox() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const sendMessage = useCallback(() => {
    if (!input.trim()) return;
    const userMsg: Message = { id: Date.now(), author: "user", text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    // TODO: integrate AI response
    const botMsg: Message = { id: Date.now() + 1, author: "assistant", text: "Hello! How can I assist you with your post?" };
    setMessages(prev => [...prev, botMsg]);
  }, [input]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <Card className="flex flex-col h-full relative">
      <CardHeader>
        <CardTitle>AI Assistant</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col relative flex-1 overflow-hidden">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-2 chat-scroll pb-20">
          {messages.length === 0 ? (
            <p className="text-sm text-muted-foreground">Start a conversation...</p>
          ) : (
            messages.map(msg => (
              <div
                key={msg.id}
                className={`px-3 py-2 rounded-lg max-w-[80%] ${
                  msg.author === "user"
                    ? "bg-primary text-primary-foreground self-end"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 self-start"
                }`}
              >
                {msg.text}
              </div>
            ))
          )}
        </div>
        <div className="absolute bottom-0 left-0 w-full p-4 bg-background border-t flex space-x-2">
          <Input
            className="flex-1"
            placeholder="Ask AI..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && sendMessage()}
          />
          <Button onClick={sendMessage}>Send</Button>
        </div>
      </CardContent>
    </Card>
  );
}
