'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Send, ArrowRight, User, CheckCheck, MessageCircle } from 'lucide-react';
import { useLanguageStore } from '@/shared/store/useLanguageStore';

interface ChatMessage {
  id: number;
  text: string;
  sender: 'user' | 'other';
  time: string;
  read: boolean;
}

interface Conversation {
  id: number;
  name: string;
  role: string;
  lastMsg: string;
  time: string;
  unread: number;
  online: boolean;
  messages: ChatMessage[];
}

export default function MessagesPage() {
  const { language } = useLanguageStore();
  const isAr = language === 'ar';

  const [selectedChat, setSelectedChat] = useState<number | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: 1,
      name: isAr ? 'دعم مهام إكسبو' : 'Maham Expo Support',
      role: isAr ? 'فريق الدعم' : 'Support Team',
      lastMsg: isAr ? 'مرحبا، كيف يمكننا مساعدتك؟' : 'Hello, how can we help?',
      time: '10:30', unread: 2, online: true,
      messages: [
        { id: 1, text: isAr ? 'مرحبا بك في مهام إكسبو!' : 'Welcome to Maham Expo!', sender: 'other', time: '10:25', read: true },
        { id: 2, text: isAr ? 'كيف يمكننا مساعدتك اليوم؟ نحن هنا لخدمتك.' : 'How can we help you today? We are here to serve you.', sender: 'other', time: '10:30', read: false },
      ],
    },
    {
      id: 2,
      name: isAr ? 'إدارة المعارض' : 'Expo Management',
      role: isAr ? 'مدير المعارض' : 'Expo Manager',
      lastMsg: isAr ? 'تم تأكيد حجزك للجناح A12' : 'Your booking for booth A12 is confirmed',
      time: '09:15', unread: 0, online: true,
      messages: [
        { id: 1, text: isAr ? 'السلام عليكم، أود الاستفسار عن حجز الجناح A12' : 'Hello, I would like to inquire about booth A12 booking', sender: 'user', time: '09:00', read: true },
        { id: 2, text: isAr ? 'وعليكم السلام! نعم، الجناح A12 متاح حاليا. مساحته 12م وسعره 13,500 ر.س' : 'Hello! Yes, booth A12 is currently available. Area: 12m, Price: 13,500 SAR', sender: 'other', time: '09:05', read: true },
        { id: 3, text: isAr ? 'ممتاز، أريد حجزه من فضلكم' : 'Excellent, I would like to book it please', sender: 'user', time: '09:10', read: true },
        { id: 4, text: isAr ? 'تم تأكيد حجزك للجناح A12. يرجى مراجعة صفحة الحجوزات لإكمال الإجراءات.' : 'Your booking for booth A12 is confirmed. Please check the bookings page to complete the process.', sender: 'other', time: '09:15', read: true },
      ],
    },
    {
      id: 3,
      name: isAr ? 'قسم المدفوعات' : 'Payments Department',
      role: isAr ? 'محاسبة' : 'Accounting',
      lastMsg: isAr ? 'تم استلام الدفعة بنجاح. الإيصال في المرفقات.' : 'Payment received successfully. Receipt attached.',
      time: isAr ? 'أمس' : 'Yesterday', unread: 1, online: false,
      messages: [
        { id: 1, text: isAr ? 'تم استلام الدفعة بنجاح. الإيصال في المرفقات.' : 'Payment received successfully. Receipt attached.', sender: 'other', time: '14:30', read: false },
      ],
    },
    {
      id: 4,
      name: isAr ? 'خدمات العارضين' : 'Exhibitor Services',
      role: isAr ? 'منسق خدمات' : 'Services Coordinator',
      lastMsg: isAr ? 'تم تأكيد طلب خدمة تصميم البوث' : 'Booth design service request confirmed',
      time: isAr ? 'أمس' : 'Yesterday', unread: 0, online: false,
      messages: [
        { id: 1, text: isAr ? 'مرحبا، أريد طلب خدمة تصميم بوث احترافي' : 'Hello, I want to request professional booth design service', sender: 'user', time: '11:00', read: true },
        { id: 2, text: isAr ? 'بالتأكيد! سنرسل لك عرض سعر خلال 24 ساعة. هل لديك تصور معين للتصميم؟' : 'Of course! We will send you a quote within 24 hours. Do you have a specific design concept?', sender: 'other', time: '11:15', read: true },
        { id: 3, text: isAr ? 'نعم، أريد تصميم عصري بألوان الشركة (أزرق وذهبي)' : 'Yes, I want a modern design with company colors (blue and gold)', sender: 'user', time: '11:20', read: true },
        { id: 4, text: isAr ? 'تم تأكيد طلب خدمة تصميم البوث. سيتواصل معك المصمم قريبا.' : 'Booth design service request confirmed. The designer will contact you soon.', sender: 'other', time: '11:30', read: true },
      ],
    },
  ]);

  const activeChat = conversations.find(c => c.id === selectedChat);
  const filteredChats = conversations.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedChat, conversations]);

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedChat) return;
    const msg: ChatMessage = {
      id: Date.now(),
      text: newMessage.trim(),
      sender: 'user',
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
      read: false,
    };
    setConversations(prev => prev.map(c => c.id === selectedChat ? { ...c, messages: [...c.messages, msg], lastMsg: newMessage.trim(), time: msg.time } : c));
    setNewMessage('');
    setTimeout(() => {
      const reply: ChatMessage = {
        id: Date.now() + 1,
        text: isAr ? 'شكرا لرسالتك! سنرد عليك في أقرب وقت ممكن.' : 'Thanks for your message! We will reply as soon as possible.',
        sender: 'other',
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
        read: false,
      };
      setConversations(prev => prev.map(c => c.id === selectedChat ? { ...c, messages: [...c.messages, reply], lastMsg: reply.text, time: reply.time } : c));
    }, 2000);
  };

  return (
    <div className="pb-20 lg:pb-0">
      <h1 className="text-2xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', 'Noto Sans Arabic', serif" }}>
        {isAr ? 'الرسائل' : 'Messages'}
      </h1>

      <div className="grid lg:grid-cols-3 gap-4" style={{ height: 'calc(100vh - 180px)' }}>
        {/* Chat List */}
        <div className={`lg:col-span-1 rounded-xl bg-card border border-border/50 overflow-hidden flex flex-col ${selectedChat ? 'hidden lg:flex' : 'flex'}`}>
          <div className="p-3 border-b border-border/50">
            <div className="relative">
              <Search className="absolute top-1/2 -translate-y-1/2 start-3 w-4 h-4 text-muted-foreground" />
              <input
                placeholder={isAr ? 'بحث في الرسائل...' : 'Search messages...'}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full ps-10 pe-4 py-2 rounded-lg bg-accent/30 border border-border/50 text-sm focus:outline-none focus:border-[#C5A55A]/50"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filteredChats.map(chat => (
              <button
                key={chat.id}
                onClick={() => { setSelectedChat(chat.id); setConversations(prev => prev.map(c => c.id === chat.id ? { ...c, unread: 0 } : c)); }}
                className={`w-full p-3 flex items-center gap-3 hover:bg-accent/50 transition-colors text-start border-b border-border/20 ${selectedChat === chat.id ? 'bg-accent/50' : ''}`}
              >
                <div className="relative shrink-0">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#C5A55A] to-[#E8D5A3] flex items-center justify-center text-[#0A0A12] font-bold text-sm">
                    {chat.name.charAt(0)}
                  </div>
                  {chat.online && <span className="absolute bottom-0 end-0 w-3 h-3 rounded-full bg-green-400 border-2 border-card" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium truncate">{chat.name}</p>
                    <span className="text-[10px] text-muted-foreground shrink-0">{chat.time}</span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{chat.lastMsg}</p>
                </div>
                {chat.unread > 0 && (
                  <span className="w-5 h-5 rounded-full bg-[#C5A55A] text-[#0A0A12] text-[10px] font-bold flex items-center justify-center shrink-0">
                    {chat.unread}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Message Thread */}
        <div className={`lg:col-span-2 rounded-xl bg-card border border-border/50 flex flex-col ${selectedChat ? 'flex' : 'hidden lg:flex'}`}>
          {activeChat ? (
            <>
              {/* Chat Header */}
              <div className="p-3 border-b border-border/50 flex items-center gap-3">
                <button onClick={() => setSelectedChat(null)} className="lg:hidden">
                  <ArrowRight className="w-5 h-5 rotate-180" />
                </button>
                <div className="relative">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#C5A55A] to-[#E8D5A3] flex items-center justify-center text-[#0A0A12] font-bold text-xs">
                    {activeChat.name.charAt(0)}
                  </div>
                  {activeChat.online && <span className="absolute bottom-0 end-0 w-2.5 h-2.5 rounded-full bg-green-400 border-2 border-card" />}
                </div>
                <div>
                  <p className="font-medium text-sm">{activeChat.name}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {activeChat.role} {activeChat.online ? (isAr ? '- متصل' : '- Online') : ''}
                  </p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3">
                {activeChat.messages.map(msg => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-2 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
                  >
                    {msg.sender === 'other' && (
                      <div className="w-7 h-7 rounded-full bg-accent flex items-center justify-center shrink-0">
                        <User className="w-3.5 h-3.5 text-muted-foreground" />
                      </div>
                    )}
                    <div className={`max-w-[75%] p-3 rounded-xl text-sm ${msg.sender === 'user' ? 'bg-[#C5A55A]/10 text-foreground' : 'bg-accent'}`}>
                      {msg.text}
                      <div className={`flex items-center gap-1 mt-1 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                        <span className="text-[10px] text-muted-foreground">{msg.time}</span>
                        {msg.sender === 'user' && <CheckCheck className={`w-3 h-3 ${msg.read ? 'text-blue-400' : 'text-muted-foreground'}`} />}
                      </div>
                    </div>
                  </motion.div>
                ))}
                <div ref={bottomRef} />
              </div>

              {/* Input */}
              <div className="p-3 border-t border-border/50 flex gap-2">
                <input
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendMessage()}
                  placeholder={isAr ? 'اكتب رسالتك...' : 'Type a message...'}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-accent/30 border border-border/50 text-sm focus:outline-none focus:border-[#C5A55A]/50"
                />
                <button
                  onClick={sendMessage}
                  disabled={!newMessage.trim()}
                  className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-[#C5A55A] to-[#E8D5A3] text-[#0A0A12] hover:opacity-90 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground text-sm">{isAr ? 'اختر محادثة للبدء' : 'Select a chat to start'}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
