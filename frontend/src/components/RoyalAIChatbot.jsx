// src/components/RoyalAIChatbot.jsx
import { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Send, Crown, Loader2, GripVertical } from 'lucide-react';
import API from '../services/api';

const QUICK_PROMPTS = [
    "Bridal Kundan sets dikhao",
    "₹2000 ke andar gift options?",
    "Kya jewellery anti-tarnish hai?"
];

const RoyalAIChatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState([
        {
            sender: 'bot',
            text: 'Namaste! 👑 Main Royal Jewels ka AI Stylist hoon. Aapko kis occasion ya outfit ke liye jewellery chahiye?'
        }
    ]);

    // Draggable & 4-Corner Snap States
    const [corner, setCorner] = useState('bottom-right'); // 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
    const [dragPos, setDragPos] = useState(null); // { x, y } jab drag ho raha ho
    const [isDragging, setIsDragging] = useState(false);

    const dragStartRef = useRef({ x: 0, y: 0, origLeft: 0, origTop: 0 });
    const hasMovedRef = useRef(false);
    const containerRef = useRef(null);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isOpen]);

    // Touch & Mouse Drag Handlers
    const handlePointerDown = (e) => {
        // Input ya close/send buttons par drag start na ho
        if (e.target.closest('input, textarea, form')) return;

        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect) return;

        hasMovedRef.current = false;
        dragStartRef.current = {
            x: clientX,
            y: clientY,
            origLeft: rect.left,
            origTop: rect.top
        };
        setIsDragging(true);
    };

    useEffect(() => {
        if (!isDragging) return;

        const handlePointerMove = (e) => {
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;

            const dx = clientX - dragStartRef.current.x;
            const dy = clientY - dragStartRef.current.y;

            if (Math.abs(dx) > 6 || Math.abs(dy) > 6) {
                hasMovedRef.current = true;
            }

            if (!hasMovedRef.current) return;

            const rect = containerRef.current?.getBoundingClientRect();
            const width = rect ? rect.width : 140;
            const height = rect ? rect.height : 48;

            const maxX = Math.max(8, window.innerWidth - width - 8);
            const maxY = Math.max(8, window.innerHeight - height - 8);

            const nextX = Math.max(8, Math.min(maxX, dragStartRef.current.origLeft + dx));
            const nextY = Math.max(8, Math.min(maxY, dragStartRef.current.origTop + dy));

            setDragPos({ x: nextX, y: nextY });
        };

        const handlePointerUp = () => {
            setIsDragging(false);

            if (hasMovedRef.current && containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;

                const isLeft = centerX < window.innerWidth / 2;
                const isTop = centerY < window.innerHeight / 2;

                const snappedCorner = `${isTop ? 'top' : 'bottom'}-${isLeft ? 'left' : 'right'}`;
                setCorner(snappedCorner);
            }
            setDragPos(null);
        };

        window.addEventListener('mousemove', handlePointerMove);
        window.addEventListener('mouseup', handlePointerUp);
        window.addEventListener('touchmove', handlePointerMove, { passive: false });
        window.addEventListener('touchend', handlePointerUp);

        return () => {
            window.removeEventListener('mousemove', handlePointerMove);
            window.removeEventListener('mouseup', handlePointerUp);
            window.removeEventListener('touchmove', handlePointerMove);
            window.removeEventListener('touchend', handlePointerUp);
        };
    }, [isDragging]);

    const handleToggleChat = () => {
        // Agar user ne drag kiya tha toh click trigger na ho
        if (hasMovedRef.current) {
            hasMovedRef.current = false;
            return;
        }
        setIsOpen((prev) => !prev);
    };

    const sendMessage = async (textToSend) => {
        const userText = (textToSend || input).trim();
        if (!userText || loading) return;

        const updatedMessages = [...messages, { sender: 'user', text: userText }];
        setMessages(updatedMessages);
        setInput('');
        setLoading(true);

        try {
            const res = await API.post('/ai/chat', {
                message: userText,
                history: messages.slice(1)
            });

            setMessages((prev) => [
                ...prev,
                { sender: 'bot', text: res.data.reply }
            ]);
        } catch {
            setMessages((prev) => [
                ...prev,
                {
                    sender: 'bot',
                    text: 'Network issue aa raha hai. Aap hamare Kundan, Polki aur AD sets upar Collections mein dekh sakte hain!'
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        sendMessage();
    };

    // Corner-based positioning classes
    const cornerPositionClasses = {
        'bottom-right': 'bottom-4 right-3.5 sm:bottom-6 sm:right-6 items-end',
        'bottom-left': 'bottom-4 left-3.5 sm:bottom-6 sm:left-6 items-start',
        'top-right': 'top-20 right-3.5 sm:top-24 sm:right-6 items-end',
        'top-left': 'top-20 left-3.5 sm:top-24 sm:left-6 items-start'
    };

    const isTopCorner = corner.startsWith('top');

    return (
        <div
            ref={containerRef}
            style={
                dragPos
                    ? {
                        left: `${dragPos.x}px`,
                        top: `${dragPos.y}px`,
                        right: 'auto',
                        bottom: 'auto',
                        transition: 'none'
                    }
                    : undefined
            }
            className={`fixed z-50 font-sans flex flex-col ${isTopCorner ? 'flex-col-reverse' : 'flex-col'
                } ${!dragPos ? `${cornerPositionClasses[corner]} transition-all duration-300 ease-out` : ''}`}
        >
            {/* Chat Window */}
            {isOpen && (
                <div
                    className={`${isTopCorner ? 'mt-3 sm:mt-4' : 'mb-3 sm:mb-4'
                        } w-[calc(100vw-28px)] max-w-[380px] bg-[#FAF8F5] rounded-2xl sm:rounded-3xl shadow-2xl border border-[#D4AF37]/60 sm:border-2 overflow-hidden flex flex-col animate-in fade-in duration-200`}
                >
                    {/* Header (Drag Handle on Desktop/Mobile too) */}
                    <div
                        onMouseDown={handlePointerDown}
                        onTouchStart={handlePointerDown}
                        className="bg-[#2B040B] text-[#FAF8F5] px-4 sm:px-5 py-3.5 sm:py-4 flex items-center justify-between border-b border-[#D4AF37]/40 cursor-grab active:cursor-grabbing select-none touch-none"
                    >
                        <div className="flex items-center gap-2.5 sm:gap-3">
                            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37] flex items-center justify-center text-[#D4AF37] shrink-0">
                                <Crown size={17} />
                            </div>
                            <div>
                                <h3 className="font-serif font-bold text-xs sm:text-sm text-[#D4AF37] tracking-wide flex items-center gap-1">
                                    Royal AI Concierge
                                </h3>
                                <p className="text-[10px] text-emerald-400 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                                    Online • Drag header to move
                                </p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="text-gray-300 hover:text-[#D4AF37] transition cursor-pointer bg-transparent border-none p-1"
                        >
                            <X size={19} />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="h-64 sm:h-80 overflow-y-auto p-3.5 sm:p-4 space-y-2.5 sm:space-y-3 bg-[#FAF8F5]">
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[84%] px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl text-xs leading-relaxed whitespace-pre-line break-words ${msg.sender === 'user'
                                            ? 'bg-[#2B040B] text-[#FAF8F5] rounded-br-none shadow-sm'
                                            : 'bg-white text-[#2B040B] border border-[#EED9C4] rounded-bl-none shadow-xs'
                                        }`}
                                >
                                    {msg.text}
                                </div>
                            </div>
                        ))}

                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-white border border-[#EED9C4] px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl rounded-bl-none flex items-center gap-2 text-xs text-gray-500">
                                    <Loader2 size={14} className="animate-spin text-[#D4AF37]" />
                                    Stylist typing...
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Quick Suggestion Chips */}
                    {messages.length <= 2 && (
                        <div className="px-3.5 sm:px-4 pb-2 flex flex-wrap gap-1.5 bg-[#FAF8F5]">
                            {QUICK_PROMPTS.map((q, i) => (
                                <button
                                    key={i}
                                    type="button"
                                    onClick={() => sendMessage(q)}
                                    className="text-[10px] bg-white hover:bg-[#2B040B] hover:text-[#D4AF37] text-[#2B040B] border border-[#D4AF37]/50 px-2.5 py-1 rounded-full transition cursor-pointer"
                                >
                                    {q}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Input Box */}
                    <form
                        onSubmit={handleSubmit}
                        className="p-2.5 sm:p-3 bg-white border-t border-[#EED9C4] flex items-center gap-2"
                    >
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask about Kundan, Polki, price..."
                            className="flex-1 min-w-0 text-xs px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl bg-[#FAF8F5] border border-[#EED9C4] text-[#2B040B] focus:outline-none focus:border-[#D4AF37]"
                        />
                        <button
                            type="submit"
                            disabled={loading || !input.trim()}
                            className="bg-[#2B040B] text-[#D4AF37] hover:bg-[#4A0A17] disabled:opacity-50 p-2 sm:p-2.5 rounded-xl transition cursor-pointer border-none shrink-0"
                        >
                            <Send size={15} />
                        </button>
                    </form>
                </div>
            )}

            {/* Draggable Floating Button */}
            <button
                type="button"
                onMouseDown={handlePointerDown}
                onTouchStart={handlePointerDown}
                onClick={handleToggleChat}
                title="Tap to Chat • Drag to move corner"
                className="bg-[#2B040B] text-[#D4AF37] border border-[#D4AF37] sm:border-2 px-3 sm:px-4 py-2.5 sm:py-3 rounded-full shadow-2xl flex items-center gap-1.5 font-bold text-[11px] sm:text-xs tracking-wider hover:scale-105 active:scale-95 transition-transform cursor-grab active:cursor-grabbing select-none touch-none"
            >
                <GripVertical size={13} className="opacity-60 -ml-1" />
                {isOpen ? <X size={15} /> : <Sparkles size={15} />}
                <span>{isOpen ? 'Close Stylist' : 'Ask Royal AI'}</span>
            </button>
        </div>
    );
};

export default RoyalAIChatbot;