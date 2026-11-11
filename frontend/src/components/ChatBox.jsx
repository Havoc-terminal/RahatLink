import React, { useState, useEffect, useRef } from 'react';
import { Send, X, User, Building2 } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const ChatBox = ({ requestId, sender, ngoName, onClose }) => {
    const { t } = useAppContext();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        const interval = setInterval(fetchMessages, 3000);
        fetchMessages();
        return () => clearInterval(interval);
    }, [requestId]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const fetchMessages = async () => {
        try {
            const res = await fetch(`http://localhost:8000/api/chat/${requestId}`);
            const data = await res.json();
            setMessages(data);
        } catch (e) {
            console.error("Chat fetch error:", e);
        }
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;
        setLoading(true);
        try {
            await fetch('http://localhost:8000/api/chat/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    request_id: requestId,
                    sender: sender,
                    text: newMessage
                })
            });
            setNewMessage('');
            fetchMessages();
        } catch (e) {
            console.error("Chat send error:", e);
        }
        setLoading(false);
    };

    return (
        <div style={{ position: 'fixed', bottom: 20, right: 20, width: 320, height: 450, background: 'rgb(var(--panel))', border: '1px solid rgb(var(--border))', borderRadius: 20, boxShadow: '0 12px 40px rgba(0,0,0,0.3)', display: 'flex', flexDirection: 'column', zIndex: 1000, overflow: 'hidden', animation: 'slideUp 0.3s ease-out' }}>
            <div style={{ padding: '14px 18px', borderBottom: '1px solid rgb(var(--border))', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgb(var(--primary) / 0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 10, background: 'rgb(var(--primary) / 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgb(var(--primary))' }}>
                        {sender === 'victim' ? <Building2 size={16} /> : <User size={16} />}
                    </div>
                    <div>
                        <h4 style={{ fontSize: 13, fontWeight: 700, color: 'rgb(var(--text-primary))' }}>{sender === 'victim' ? ngoName : 'Victim Support'}</h4>
                        <p style={{ fontSize: 10, color: 'rgb(var(--low))' }}>{t('online') || 'Active'}</p>
                    </div>
                </div>
                <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'rgb(var(--text-secondary))', cursor: 'pointer' }}><X size={18} /></button>
            </div>

            <div style={{ flex: 1, padding: 16, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
                {messages.length === 0 && (
                    <div style={{ textAlign: 'center', color: 'rgb(var(--text-secondary))', fontSize: 11, marginTop: 40 }}>
                        Start a coordination chat for Request {requestId}
                    </div>
                )}
                {messages.map((m, i) => {
                    const isMe = m.sender === sender;
                    return (
                        <div key={i} style={{ alignSelf: isMe ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
                            <div style={{ padding: '8px 12px', borderRadius: isMe ? '14px 14px 2px 14px' : '14px 14px 14px 2px', background: isMe ? 'rgb(var(--primary))' : 'rgb(var(--background))', color: isMe ? '#fff' : 'rgb(var(--text-primary))', fontSize: 13, border: isMe ? 'none' : '1px solid rgb(var(--border))' }}>
                                {m.text}
                            </div>
                            <span style={{ fontSize: 9, color: 'rgb(var(--text-secondary))', marginTop: 4, display: 'block', textAlign: isMe ? 'right' : 'left' }}>{m.timestamp}</span>
                        </div>
                    );
                })}
                <div ref={scrollRef} />
            </div>

            <form onSubmit={sendMessage} style={{ padding: 12, borderTop: '1px solid rgb(var(--border))', display: 'flex', gap: 8 }}>
                <input 
                    value={newMessage} 
                    onChange={e => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    style={{ flex: 1, background: 'rgb(var(--background))', border: '1px solid rgb(var(--border))', borderRadius: 10, padding: '8px 12px', color: 'rgb(var(--text-primary))', fontSize: 13, outline: 'none' }}
                />
                <button disabled={loading} style={{ width: 36, height: 36, borderRadius: 10, background: 'rgb(var(--primary))', border: 'none', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                    <Send size={16} />
                </button>
            </form>
            <style>{`
                @keyframes slideUp {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default ChatBox;
