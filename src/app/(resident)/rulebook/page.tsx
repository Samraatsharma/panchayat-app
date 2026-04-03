"use client";

import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { answerRuleQuestion } from "@/lib/ai";
import { Loader2 } from "lucide-react";

export default function RulebookPage() {
  const [faqs, setFaqs] = useState<{question: string, answer: string}[]>([]);
  const [question, setQuestion] = useState("");
  const [activeQuestion, setActiveQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadFaqs = async () => {
      try {
        const snapshot = await getDocs(collection(db, "faqs"));
        const faqList = snapshot.docs.map(doc => doc.data() as {question: string, answer: string});
        if (faqList.length === 0) {
           const dummy = [
             { question: "What are the pool timings?", answer: "Pool is open from 6 AM to 10 PM. Maintenance on Mondays." },
             { question: "How to register domestic help?", answer: "Go to the admin office with ID proof." }
           ];
           setFaqs(dummy);
        } else {
          setFaqs(faqList);
        }
      } catch (e) {
        console.error("Failed to load FAQs", e);
      }
    };
    loadFaqs();
  }, []);

  const handleAsk = async (e?: React.FormEvent, directQuestion?: string) => {
    if (e) e.preventDefault();
    const q = directQuestion || question;
    if (!q.trim()) return;
    
    setLoading(true);
    setActiveQuestion(q);
    setAnswer("");
    
    // Logic first: Direct text search in FAQs
    const exactMatch = faqs.find(f => f.question.toLowerCase().includes(q.toLowerCase()));
    
    if (exactMatch) {
       setTimeout(() => {
         setAnswer(exactMatch.answer);
         setLoading(false);
       }, 500);
       return;
    }

    // AI Fallback
    try {
      const res = await answerRuleQuestion(q, faqs);
      setAnswer(res || "Sorry, I couldn't find an answer. Try rephrasing.");
    } catch (e) {
      setAnswer("Sorry, I am unable to connect to the Rulebook AI right now. Please call the office.");
    }
    setLoading(false);
  };

  return (
    <div className="w-full flex flex-col pt-8 animate-in fade-in duration-500">
      {/* Hero / Search Section */}
      <section className="mb-12">
        <h2 className="text-display-md font-extrabold text-primary mb-2 text-4xl">Rulebook AI</h2>
        <p className="text-body-lg text-on-surface-variant mb-8 text-xl">Instant answers to society rules and protocols.</p>
        
        <form onSubmit={handleAsk} className="relative group">
          <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
            <span className="material-symbols-outlined text-outline text-2xl">search</span>
          </div>
          <input 
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="w-full h-20 pl-16 pr-32 bg-surface-container-highest rounded-2xl border-none text-xl focus:ring-4 focus:ring-secondary transition-all placeholder:text-outline outline-none" 
            placeholder="What are the visitor parking rules?" 
            type="text"
            disabled={loading}
          />
          <div className="absolute inset-y-2 right-2 flex items-center">
            <button 
              type="submit"
              disabled={loading || !question.trim()}
              className="flex items-center gap-2 bg-gradient-to-r from-primary to-primary-container text-on-primary px-6 h-16 rounded-xl font-bold hover:opacity-90 transition-all shadow-lg active:scale-95 disabled:opacity-50"
            >
               {loading ? <Loader2 className="animate-spin text-white w-6 h-6" /> : <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>mic</span>}
               <span className="hidden md:block">{loading ? "Thinking" : "Speak to Ask"}</span>
            </button>
          </div>
        </form>
      </section>

      {/* FAQ Bento Grid */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-headline-lg font-bold text-2xl">Quick Guides</h3>
          <span className="text-primary font-bold flex items-center gap-1 cursor-pointer hover:underline">View All <span className="material-symbols-outlined">arrow_forward</span></span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div onClick={() => { setQuestion("What are the parking rules?"); handleAsk(undefined, "What are the parking rules?"); }} className="bg-surface-container-lowest p-8 rounded-3xl group cursor-pointer hover:bg-primary-fixed transition-colors border-2 border-transparent hover:border-primary-fixed-dim shadow-sm">
            <div className="w-14 h-14 bg-secondary-container text-on-secondary-container rounded-2xl flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-3xl">local_parking</span>
            </div>
            <h4 className="text-xl font-bold mb-2">Parking</h4>
            <p className="text-on-surface-variant leading-snug">Guest slots, EV charging, and designated zones.</p>
          </div>
          
          <div onClick={() => { setQuestion("What are visitor protocols?"); handleAsk(undefined, "What are visitor protocols?"); }} className="bg-surface-container-lowest p-8 rounded-3xl group cursor-pointer hover:bg-primary-fixed transition-colors border-2 border-transparent hover:border-primary-fixed-dim shadow-sm">
            <div className="w-14 h-14 bg-tertiary-fixed text-on-tertiary-fixed-variant rounded-2xl flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-3xl">group</span>
            </div>
            <h4 className="text-xl font-bold mb-2">Visitors</h4>
            <p className="text-on-surface-variant leading-snug">Entry logs, night stays, and delivery protocols.</p>
          </div>
          
          <div onClick={() => { setQuestion("What are the noise rules?"); handleAsk(undefined, "What are the noise rules?"); }} className="bg-surface-container-lowest p-8 rounded-3xl group cursor-pointer hover:bg-primary-fixed transition-colors border-2 border-transparent hover:border-primary-fixed-dim shadow-sm">
            <div className="w-14 h-14 bg-primary-fixed text-on-primary-fixed-variant rounded-2xl flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-3xl">volume_off</span>
            </div>
            <h4 className="text-xl font-bold mb-2">Noise Rules</h4>
            <p className="text-on-surface-variant leading-snug">Quiet hours, renovations, and event guidelines.</p>
          </div>
        </div>
      </section>

      {/* Gemini AI Chat Interface */}
      {(loading || answer || activeQuestion) && (
        <section className="bg-surface-container-low rounded-[40px] p-8 md:p-12 mb-12 relative overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <span className="material-symbols-outlined text-[120px]" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
              </div>
              <span className="text-primary font-black tracking-widest text-sm uppercase">Gemini AI Engine</span>
            </div>
            
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="flex-1">
                  <div className="bg-white p-8 rounded-t-3xl rounded-br-3xl shadow-sm border-l-8 border-secondary">
                    <p className="text-body-lg font-medium text-on-surface mb-4">"{activeQuestion}"</p>
                    
                    {loading ? (
                       <div className="flex items-center gap-4 text-on-surface-variant py-4">
                         <div className="flex gap-2">
                           <div className="w-3 h-3 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                           <div className="w-3 h-3 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                           <div className="w-3 h-3 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                         </div>
                         <span className="text-sm font-bold">AI is reading the rulebook...</span>
                       </div>
                    ) : (
                      <div className="bg-surface-container-low p-6 rounded-2xl animate-in fade-in duration-300">
                        <h5 className="text-secondary font-bold mb-3 flex items-center gap-2">
                          <span className="material-symbols-outlined text-lg">check_circle</span>
                          Short, clear, and simple:
                        </h5>
                        <p className="text-xl text-primary font-semibold leading-relaxed whitespace-pre-line">
                          {answer}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Fallback Section */}
      <section className="flex flex-col md:flex-row items-center justify-between gap-8 bg-surface-container-highest p-10 rounded-[32px] mt-auto">
        <div className="max-w-md text-center md:text-left">
          <h4 className="text-2xl font-extrabold text-primary mb-2">Still need help?</h4>
          <p className="text-on-surface-variant">If the AI can't find specific details, our human administrators are just a call away.</p>
        </div>
        <a href="tel:+911234567890" className="w-full md:w-auto flex items-center justify-center gap-4 bg-surface-container-lowest text-primary border-4 border-primary px-10 h-20 rounded-2xl font-black text-xl hover:bg-primary hover:text-white transition-all group active:scale-95">
          <span className="material-symbols-outlined text-3xl group-hover:scale-110 transition-transform">support_agent</span>
          Call Society Office
        </a>
      </section>
    </div>
  );
}
