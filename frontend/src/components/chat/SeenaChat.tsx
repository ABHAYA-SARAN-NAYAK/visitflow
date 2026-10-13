import { useState, useRef, useEffect } from 'react';
import { X, Maximize2, Minimize2, Send, Mic, Bot, User, Sparkles, MapPin, Bell, Calendar, ExternalLink, Share2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { ChatMessage } from '../../types';
import { places, getCrowdLabel, getCrowdLevelFromPct } from '../../data/places';

const SUGGESTED_PROMPTS = [
  { emoji: '🌿', text: 'Find me a quiet place to visit this weekend' },
  { emoji: '📍', text: 'Is Taj Mahal crowded right now?' },
  { emoji: '🗺', text: 'Plan a 2-day trip to Jaipur' },
  { emoji: '⏰', text: 'Best time to visit Hampi this month' },
  { emoji: '🏆', text: 'Hidden gems near Mumbai' },
];

export default function SeenaChat() {
  const { isChatOpen, toggleChat, chatMessages, addChatMessage, isChatStreaming, setChatStreaming, updateLastChatMessage } = useStore();
  const [message, setMessage] = useState('');
  const [isFullScreen, setIsFullScreen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  useEffect(() => {
    if (isChatOpen) inputRef.current?.focus();
  }, [isChatOpen]);

  const generateResponse = async (userMessage: string) => {
    // Entity extraction (simplified)
    const msgLower = userMessage.toLowerCase();
    const matchedPlaces = places.filter(p =>
      msgLower.includes(p.name.toLowerCase()) ||
      msgLower.includes(p.city.toLowerCase())
    );

    let response = '';

    // Crowd check
    if (msgLower.includes('crowded') || msgLower.includes('crowd') || msgLower.includes('busy')) {
      if (matchedPlaces.length > 0) {
        const p = matchedPlaces[0];
        const icon = p.liveCrowdPct > 70 ? '⚠️' : p.liveCrowdPct > 40 ? '🟡' : '🌿';
        response = `📍 **${p.name}** right now: **${p.liveCrowdPct}% crowd — ${getCrowdLabel(p.crowdLevel).toUpperCase()}**\n\n` +
          `👥 About ${p.visitorCount.toLocaleString()} visitors on-site\n` +
          `⏱ Current wait at main entrance: ~${p.waitTimeMins} minutes\n` +
          `${p.liveCrowdPct > 60 ? '❌ Not ideal right now.' : '✅ Reasonable time to visit!'}\n\n` +
          `✅ **Best window today:** ${p.bestVisitWindow} (crowd expected to drop to ~${Math.max(12, p.liveCrowdPct - 35)}%)\n` +
          `📊 Confidence: ${p.bestVisitConfidence}%\n\n` +
          `🅿️ Parking: ${p.parkingFreeSpaces > 0 ? `${p.parkingFreeSpaces} spaces available` : 'No parking data'}\n\n` +
          `Want me to set an alert for when it gets quiet? Or should I find alternatives?`;
      } else {
        response = `I can check crowd levels for any destination! Could you tell me which place you're interested in? Here are some popular ones:\n\n` +
          places.slice(0, 5).map(p => `• ${p.emoji} **${p.name}** (${p.city}) — ${p.liveCrowdPct}% ${getCrowdLabel(p.crowdLevel)}`).join('\n');
      }
    }
    // Best time
    else if (msgLower.includes('best time') || msgLower.includes('when should') || msgLower.includes('when to visit')) {
      if (matchedPlaces.length > 0) {
        const p = matchedPlaces[0];
        response = `🏯 **Best times to visit ${p.name} this week:**\n\n` +
          `🥇 **Tuesday 7–9 AM** → Crowd: 18% (LOW) · Wait: 4 min · 96% confident\n` +
          `🥈 **Wednesday 6–8 AM** → Crowd: 15% (LOW) · Wait: 3 min · 94% confident\n` +
          `🥉 **Thursday before 10 AM** → stays below 30%\n\n` +
          `⚠️ **Worst time:** Saturday 11 AM–3 PM (Crowd reaches 88%, wait up to 75 min)\n\n` +
          `🎟️ Entry: ₹${p.entryFeeIndian} Indian / ₹${p.entryFeeForeign} Foreign\n` +
          `🕐 Opens at ${p.openingTime}\n\n` +
          `Anything else you need — parking, alternatives, or should I add this to your itinerary?`;
      } else {
        response = `I'd love to find the best time for you! Which destination are you planning to visit? Just tell me the place name and I'll give you the optimal window.`;
      }
    }
    // Trip planning
    else if (msgLower.includes('plan') || msgLower.includes('trip') || msgLower.includes('itinerary')) {
      const city = matchedPlaces.length > 0 ? matchedPlaces[0].city : 'Agra';
      const cityPlaces = places.filter(p => p.city.toLowerCase() === city.toLowerCase() || p.state.toLowerCase().includes(city.toLowerCase()));
      const selected = cityPlaces.length > 0 ? cityPlaces.slice(0, 4) : places.slice(0, 4);

      response = `📸 **Perfect — here's your trip plan built around low-crowd windows:**\n\n` +
        `**DAY 1**\n\n` +
        selected.slice(0, 2).map((p, i) => (
          `⏰ **${i === 0 ? '06:00 AM' : '09:30 AM'}** → **${p.name}**\n` +
          `Crowd: **${getCrowdLabel(getCrowdLevelFromPct(Math.max(10, p.liveCrowdPct - 30))).toUpperCase()} (${Math.max(10, p.liveCrowdPct - 30)}%)**` +
          ` · Wait: ${Math.max(3, p.waitTimeMins - 15)} min · Entry: ₹${p.entryFeeIndian}/person\n` +
          `Duration: 2 hours\n`
        )).join('\n🚗 *Travel → 15 min drive*\n\n') +
        `\n\n🍽️ **12:30 PM** → Lunch break\n\n` +
        `**DAY 2**\n\n` +
        selected.slice(2, 4).map((p, i) => (
          `⏰ **${i === 0 ? '07:00 AM' : '10:00 AM'}** → **${p.name}**\n` +
          `Crowd: **${getCrowdLabel(getCrowdLevelFromPct(Math.max(10, p.liveCrowdPct - 25))).toUpperCase()} (${Math.max(10, p.liveCrowdPct - 25)}%)**` +
          ` · Wait: ${Math.max(2, p.waitTimeMins - 10)} min · Entry: ₹${p.entryFeeIndian}/person\n` +
          `Duration: 1.5 hours\n`
        )).join('\n🚗 *Travel → 20 min drive*\n\n') +
        `\n\n💰 **Total estimated cost (entry fees):** ₹${selected.reduce((s, p) => s + p.entryFeeIndian, 0)} per person\n\n` +
        `Want me to set crowd alerts for these places, or adjust anything — timing, budget, adding more spots?`;
    }
    // Hidden gems
    else if (msgLower.includes('hidden') || msgLower.includes('gem') || msgLower.includes('quiet') || msgLower.includes('unique') || msgLower.includes('offbeat')) {
      const gems = places.filter(p => p.hiddenGemScore >= 6).slice(0, 4);
      response = `🌿 **Hidden gems and quiet alternatives:**\n\n` +
        gems.map((p, i) => (
          `**${i + 1}. ${p.emoji} ${p.name}** (${p.city})\n` +
          `Crowd: Always **LOW** — rarely more than ${p.visitorCount * 2} visitors/day\n` +
          `What makes it special: ${p.description.slice(0, 120)}...\n` +
          `Entry: ${p.entryFeeIndian === 0 ? 'Free' : `₹${p.entryFeeIndian}`}\n` +
          `Best time: ${p.bestVisitWindow}\n`
        )).join('\n') +
        `\n\nAll of these are peaceful, uncrowded experiences. Want me to build an itinerary combining any of these?`;
    }
    // Parking
    else if (msgLower.includes('parking') || msgLower.includes('park')) {
      if (matchedPlaces.length > 0) {
        const p = matchedPlaces[0];
        response = `🅿️ **${p.name} Parking:**\n\n` +
          `**P1 — Main Parking**\n` +
          `• Distance: 350m walk to entrance\n` +
          `• Capacity: 200 cars\n` +
          `• Status right now: **${p.parkingFreeSpaces} spaces available**\n` +
          `• Cost: ${p.entryFeeIndian > 100 ? '₹50 for first 3 hours' : 'Free'}\n\n` +
          `⚠️ **Tip:** On weekends after 10 AM, parking fills up fast. Arrive by ${p.openingTime} to guarantee a spot.\n\n` +
          `🚻 Restrooms available at parking lot (open during visiting hours).\n` +
          `🏥 First aid post near main entrance.\n\n` +
          `Need anything else?`;
      } else {
        response = `I can check parking availability at any destination! Which place are you heading to?`;
      }
    }
    // Comparison
    else if (msgLower.includes('compare') || msgLower.includes('which is better') || msgLower.includes('vs') || msgLower.includes('versus')) {
      if (matchedPlaces.length >= 2) {
        const [a, b] = matchedPlaces;
        response = `📊 **Comparison: ${a.name} vs ${b.name}**\n\n` +
          `| | ${a.emoji} ${a.name} | ${b.emoji} ${b.name} |\n` +
          `|---|---|---|\n` +
          `| Crowd Now | ${a.liveCrowdPct}% ${getCrowdLabel(a.crowdLevel)} | ${b.liveCrowdPct}% ${getCrowdLabel(b.crowdLevel)} |\n` +
          `| Wait Time | ${a.waitTimeMins} min | ${b.waitTimeMins} min |\n` +
          `| Entry Fee | ₹${a.entryFeeIndian} | ₹${b.entryFeeIndian} |\n` +
          `| Rating | ⭐ ${a.rating} | ⭐ ${b.rating} |\n` +
          `| Best Time | ${a.bestVisitWindow} | ${b.bestVisitWindow} |\n\n` +
          `🏆 **Verdict:** Go to **${a.liveCrowdPct < b.liveCrowdPct ? a.name : b.name}** — it's significantly less crowded today.\n\n` +
          `Want me to add either to your itinerary?`;
      } else {
        response = `I can compare any two destinations! Just mention both names and I'll give you a detailed side-by-side comparison.`;
      }
    }
    // Default / generic
    else {
      response = `Hey! 👋 I'm **Seena**, your VISIT FLOW travel assistant. I know everything about every tourist destination — crowd levels, best times, parking, hidden gems, and more.\n\n` +
        `Here's what I can help with:\n\n` +
        `📍 **Crowd check** — "Is Taj Mahal crowded right now?"\n` +
        `⏰ **Best time** — "When should I visit Hawa Mahal this week?"\n` +
        `🗺️ **Trip planning** — "Plan a 2-day trip to Rajasthan"\n` +
        `🌿 **Hidden gems** — "Quiet places near Mysore"\n` +
        `🅿️ **Facilities** — "Parking at India Gate"\n` +
        `📊 **Compare** — "Qutub Minar vs Red Fort this Sunday"\n\n` +
        `What would you like to know?`;
    }

    return response;
  };

  const handleSend = async () => {
    if (!message.trim() || isChatStreaming) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: message.trim(),
      timestamp: new Date().toISOString(),
    };
    addChatMessage(userMsg);
    setMessage('');

    // Create streaming placeholder
    const assistantMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: '',
      timestamp: new Date().toISOString(),
      isStreaming: true,
    };
    addChatMessage(assistantMsg);
    setChatStreaming(true);

    // Generate response
    const fullResponse = await generateResponse(userMsg.content);

    // Simulate streaming
    let current = '';
    const words = fullResponse.split(' ');
    for (let i = 0; i < words.length; i++) {
      current += (i > 0 ? ' ' : '') + words[i];
      updateLastChatMessage(current);
      await new Promise(r => setTimeout(r, 20 + Math.random() * 30));
    }

    setChatStreaming(false);
  };

  const handlePromptClick = (prompt: string) => {
    setMessage(prompt);
    setTimeout(() => {
      setMessage(prompt);
      handleSendWithMessage(prompt);
    }, 100);
  };

  const handleSendWithMessage = async (msg: string) => {
    if (!msg.trim() || isChatStreaming) return;
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: msg.trim(),
      timestamp: new Date().toISOString(),
    };
    addChatMessage(userMsg);
    setMessage('');
    const assistantMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: '',
      timestamp: new Date().toISOString(),
      isStreaming: true,
    };
    addChatMessage(assistantMsg);
    setChatStreaming(true);
    const fullResponse = await generateResponse(msg);
    let current = '';
    const words = fullResponse.split(' ');
    for (let i = 0; i < words.length; i++) {
      current += (i > 0 ? ' ' : '') + words[i];
      updateLastChatMessage(current);
      await new Promise(r => setTimeout(r, 20 + Math.random() * 30));
    }
    setChatStreaming(false);
  };

  if (!isChatOpen) {
    return (
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-accent text-white rounded-full shadow-float hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center group"
        aria-label="Open Seena Chat"
      >
        <Bot className="w-6 h-6 group-hover:scale-110 transition-transform" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse" />
      </button>
    );
  }

  const panelClasses = isFullScreen
    ? 'fixed inset-0 z-50'
    : 'fixed bottom-6 right-6 z-50 w-[400px] h-[600px] max-h-[80vh] rounded-2xl shadow-chat';

  return (
    <div className={`${panelClasses} bg-surface flex flex-col overflow-hidden border border-border animate-slide-up`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-accent text-white flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-sm">Seena</h3>
            <p className="text-xs text-white/70 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
              VISIT FLOW
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsFullScreen(!isFullScreen)}
            className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center transition-colors"
          >
            {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          <button
            onClick={toggleChat}
            className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 chat-scroll">
        {chatMessages.length === 0 && (
          <div className="space-y-4">
            {/* Welcome */}
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-accent-light text-accent rounded-xl flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-chat-seena rounded-2xl rounded-tl-md p-4 max-w-[85%]">
                <p className="text-sm leading-relaxed">
                  Hey! 👋 I'm <strong>Seena</strong>, your AI travel assistant. I know real-time crowd levels, best visit times, parking, hidden gems, and can plan your entire trip in seconds.
                </p>
                <p className="text-sm leading-relaxed mt-2">
                  What would you like to know?
                </p>
              </div>
            </div>

            {/* Suggested Prompts */}
            <div className="flex flex-wrap gap-2 pl-11">
              {SUGGESTED_PROMPTS.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handlePromptClick(prompt.text)}
                  className="chip text-xs"
                >
                  {prompt.emoji} {prompt.text}
                </button>
              ))}
            </div>
          </div>
        )}

        {chatMessages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 bg-accent-light text-accent rounded-xl flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4" />
              </div>
            )}
            <div
              className={`rounded-2xl p-3.5 max-w-[85%] ${
                msg.role === 'user'
                  ? 'bg-accent text-white rounded-tr-md'
                  : 'bg-chat-seena text-text-primary rounded-tl-md'
              }`}
            >
              <div className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                {msg.content.split('\n').map((line, i) => {
                  // Bold
                  let formatted = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                  return (
                    <p key={i} className={i > 0 ? 'mt-1' : ''} dangerouslySetInnerHTML={{ __html: formatted }} />
                  );
                })}
              </div>
              {msg.isStreaming && (
                <span className="inline-block w-1.5 h-4 bg-accent ml-0.5 animate-pulse rounded-sm" />
              )}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isChatStreaming && chatMessages[chatMessages.length - 1]?.content === '' && (
          <div className="flex gap-3">
            <div className="w-8 h-8 bg-accent-light text-accent rounded-xl flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-chat-seena rounded-2xl rounded-tl-md px-4 py-3">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-accent/40 rounded-full animate-typing-dot" />
                <span className="w-2 h-2 bg-accent/40 rounded-full animate-typing-dot" />
                <span className="w-2 h-2 bg-accent/40 rounded-full animate-typing-dot" />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick actions after response */}
      {chatMessages.length > 0 && !isChatStreaming && chatMessages[chatMessages.length - 1]?.role === 'assistant' && (
        <div className="px-4 pb-2 flex flex-wrap gap-1.5 animate-slide-up">
          <button
            onClick={() => handlePromptClick('Set crowd alert')}
            className="flex items-center gap-1 px-3 py-1.5 bg-accent-light text-accent rounded-full text-xs font-medium hover:bg-accent hover:text-white transition-all"
          >
            <Bell className="w-3 h-3" /> Set Alert
          </button>
          <button
            onClick={() => navigate('/trip-planner')}
            className="flex items-center gap-1 px-3 py-1.5 bg-accent-light text-accent rounded-full text-xs font-medium hover:bg-accent hover:text-white transition-all"
          >
            <Calendar className="w-3 h-3" /> Add to Trip
          </button>
          <button
            className="flex items-center gap-1 px-3 py-1.5 bg-accent-light text-accent rounded-full text-xs font-medium hover:bg-accent hover:text-white transition-all"
          >
            <Share2 className="w-3 h-3" /> Share
          </button>
        </div>
      )}

      {/* Input */}
      <div className="flex items-center gap-2 px-4 py-3 border-t border-border bg-surface flex-shrink-0">
        <input
          ref={inputRef}
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask me anything about any destination..."
          className="flex-1 text-sm bg-bg-secondary rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-accent/20 transition-all placeholder:text-text-muted"
          disabled={isChatStreaming}
        />
        <button className="w-9 h-9 rounded-xl bg-bg-secondary text-text-muted hover:bg-accent-light hover:text-accent flex items-center justify-center transition-colors">
          <Mic className="w-4 h-4" />
        </button>
        <button
          onClick={handleSend}
          disabled={!message.trim() || isChatStreaming}
          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
            message.trim() && !isChatStreaming
              ? 'bg-accent text-white hover:bg-accent/90'
              : 'bg-bg-secondary text-text-muted'
          }`}
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
