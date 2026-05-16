import { useState, useRef, useEffect } from "react";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Mono:wght@400;500&family=Geist:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0d0f12;
    --surface: #13161b;
    --surface2: #1a1e25;
    --border: rgba(255,255,255,0.07);
    --border2: rgba(255,255,255,0.12);
    --accent: #6ee7b7;
    --accent2: #34d399;
    --accent-dim: rgba(110,231,183,0.12);
    --accent-glow: rgba(110,231,183,0.06);
    --text: #e8eaed;
    --text2: #8b929e;
    --text3: #555d6b;
    --user-bubble: #1e2d26;
    --user-border: rgba(110,231,183,0.2);
    --ai-bubble: #161a20;
    --danger: #f87171;
    --mono: 'DM Mono', monospace;
    --sans: 'Geist', sans-serif;
    --serif: 'Instrument Serif', serif;
  }

  body { background: var(--bg); color: var(--text); font-family: var(--sans); font-size: 15px; line-height: 1.6; min-height: 100vh; }

  #root { display: flex; height: 100vh; overflow: hidden; }

  .sidebar {
    width: 280px; flex-shrink: 0; background: var(--surface);
    border-right: 1px solid var(--border); display: flex; flex-direction: column;
    padding: 0; overflow: hidden;
  }

  .sidebar-header {
    padding: 24px 20px 20px;
    border-bottom: 1px solid var(--border);
  }

  .logo {
    font-family: var(--serif); font-size: 22px; color: var(--accent);
    letter-spacing: -0.3px; margin-bottom: 4px;
    font-style: italic;
  }

  .logo span { color: var(--text2); font-style: normal; font-family: var(--sans); font-size: 11px; font-weight: 400; display: block; margin-top: 2px; letter-spacing: 0.05em; text-transform: uppercase; }

  .drop-zone {
    margin: 16px;
    border: 1.5px dashed var(--border2);
    border-radius: 10px;
    padding: 20px 16px;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s;
    background: transparent;
    position: relative;
    overflow: hidden;
  }

  .drop-zone:hover, .drop-zone.drag-over {
    border-color: var(--accent);
    background: var(--accent-glow);
  }

  .drop-zone input[type=file] {
    position: absolute; inset: 0; opacity: 0; cursor: pointer; width: 100%; height: 100%;
  }

  .drop-icon {
    width: 36px; height: 36px; margin: 0 auto 10px;
    background: var(--accent-dim); border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    color: var(--accent); font-size: 18px;
  }

  .drop-text { font-size: 13px; color: var(--text2); }
  .drop-text strong { color: var(--text); font-weight: 500; display: block; margin-bottom: 2px; }

  .docs-list { flex: 1; overflow-y: auto; padding: 8px 12px; }

  .docs-label {
    font-size: 10px; font-weight: 600; color: var(--text3); letter-spacing: 0.1em;
    text-transform: uppercase; padding: 8px 8px 6px;
  }

  .doc-item {
    display: flex; align-items: center; gap: 10px;
    padding: 9px 10px; border-radius: 8px; cursor: pointer;
    transition: background 0.15s; border: 1px solid transparent;
    margin-bottom: 2px;
  }

  .doc-item:hover { background: var(--surface2); }
  .doc-item.active { background: var(--accent-dim); border-color: var(--user-border); }

  .doc-icon {
    width: 30px; height: 30px; border-radius: 6px; background: var(--surface2);
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    font-size: 13px;
  }
  .doc-item.active .doc-icon { background: var(--accent-dim); }

  .doc-name { font-size: 12px; color: var(--text); flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .doc-pages { font-size: 10px; color: var(--text3); }

  .doc-delete {
    opacity: 0; background: none; border: none; color: var(--danger);
    cursor: pointer; padding: 2px 4px; border-radius: 4px; font-size: 14px;
    transition: opacity 0.15s;
  }
  .doc-item:hover .doc-delete { opacity: 1; }

  .main { flex: 1; display: flex; flex-direction: column; overflow: hidden; }

  .topbar {
    height: 56px; border-bottom: 1px solid var(--border);
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 24px; flex-shrink: 0;
  }

  .topbar-doc { font-size: 13px; color: var(--text2); display: flex; align-items: center; gap: 8px; }
  .topbar-doc strong { color: var(--text); font-weight: 500; }
  .doc-badge { background: var(--accent-dim); color: var(--accent); font-size: 10px; font-weight: 600; padding: 2px 8px; border-radius: 20px; letter-spacing: 0.05em; }

  .quick-actions { display: flex; gap: 6px; }
  .quick-btn {
    background: var(--surface); border: 1px solid var(--border2); color: var(--text2);
    padding: 5px 12px; border-radius: 6px; font-size: 12px; cursor: pointer;
    transition: all 0.15s; font-family: var(--sans); white-space: nowrap;
  }
  .quick-btn:hover { border-color: var(--accent); color: var(--accent); background: var(--accent-glow); }

  .chat-area { flex: 1; overflow-y: auto; padding: 24px; display: flex; flex-direction: column; gap: 20px; }

  .empty-state {
    flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center;
    text-align: center; gap: 12px; color: var(--text3); padding: 40px;
  }

  .empty-icon {
    width: 64px; height: 64px; border-radius: 16px; background: var(--surface);
    border: 1px solid var(--border2); display: flex; align-items: center;
    justify-content: center; font-size: 28px; margin-bottom: 8px;
  }

  .empty-state h3 { font-family: var(--serif); font-size: 22px; color: var(--text); font-weight: 400; font-style: italic; }
  .empty-state p { font-size: 14px; max-width: 320px; line-height: 1.6; }

  .suggestion-chips { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; margin-top: 8px; }
  .chip {
    background: var(--surface); border: 1px solid var(--border2); color: var(--text2);
    padding: 7px 14px; border-radius: 20px; font-size: 12px; cursor: pointer;
    transition: all 0.15s;
  }
  .chip:hover { border-color: var(--accent); color: var(--accent); background: var(--accent-glow); }

  .message { display: flex; gap: 12px; max-width: 800px; animation: fadeUp 0.25s ease; }

  @keyframes fadeUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

  .message.user { align-self: flex-end; flex-direction: row-reverse; }

  .avatar {
    width: 32px; height: 32px; border-radius: 8px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center; font-size: 14px;
    margin-top: 2px;
  }
  .avatar.ai { background: var(--accent-dim); color: var(--accent); border: 1px solid var(--user-border); }
  .avatar.user { background: var(--surface2); color: var(--text2); border: 1px solid var(--border); }

  .bubble {
    padding: 12px 16px; border-radius: 12px; font-size: 14px; line-height: 1.7;
    max-width: 640px;
  }

  .message.user .bubble {
    background: var(--user-bubble); border: 1px solid var(--user-border);
    border-radius: 12px 4px 12px 12px; color: var(--text);
  }

  .message.ai .bubble {
    background: var(--ai-bubble); border: 1px solid var(--border);
    border-radius: 4px 12px 12px 12px; color: var(--text);
  }

  .bubble p { margin-bottom: 8px; }
  .bubble p:last-child { margin-bottom: 0; }

  .bubble strong { color: var(--accent); font-weight: 600; }

  .bubble code {
    font-family: var(--mono); font-size: 12px; background: rgba(255,255,255,0.06);
    padding: 1px 5px; border-radius: 4px; color: var(--accent);
  }

  .bubble ul, .bubble ol { padding-left: 18px; margin: 6px 0; }
  .bubble li { margin-bottom: 4px; }

  .typing-indicator {
    display: flex; gap: 4px; align-items: center; padding: 4px 0;
  }
  .dot {
    width: 6px; height: 6px; border-radius: 50%; background: var(--text3);
    animation: pulse 1.2s ease-in-out infinite;
  }
  .dot:nth-child(2) { animation-delay: 0.2s; }
  .dot:nth-child(3) { animation-delay: 0.4s; }
  @keyframes pulse { 0%,60%,100% { opacity: 0.3; transform: scale(0.9); } 30% { opacity: 1; transform: scale(1); } }

  .input-area {
    padding: 16px 24px 20px;
    border-top: 1px solid var(--border);
    background: var(--bg);
  }

  .input-row {
    display: flex; gap: 10px; align-items: flex-end;
    background: var(--surface); border: 1px solid var(--border2);
    border-radius: 12px; padding: 10px 12px; transition: border-color 0.2s;
  }
  .input-row:focus-within { border-color: var(--accent); }

  textarea {
    flex: 1; background: transparent; border: none; outline: none;
    color: var(--text); font-family: var(--sans); font-size: 14px;
    resize: none; max-height: 150px; line-height: 1.6; padding: 2px 0;
  }
  textarea::placeholder { color: var(--text3); }

  .send-btn {
    width: 34px; height: 34px; border-radius: 8px; border: none;
    background: var(--accent); color: #0d0f12; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    font-size: 16px; flex-shrink: 0; transition: all 0.15s; font-weight: 700;
  }
  .send-btn:hover:not(:disabled) { background: var(--accent2); transform: scale(1.05); }
  .send-btn:disabled { background: var(--surface2); color: var(--text3); cursor: not-allowed; transform: none; }

  .input-hint { font-size: 11px; color: var(--text3); margin-top: 8px; text-align: center; }

  .processing-bar {
    height: 2px; background: var(--border); position: relative; overflow: hidden;
    border-radius: 1px; margin: 0 24px 12px;
  }
  .processing-bar::after {
    content: ''; position: absolute; left: -50%; width: 50%; height: 100%;
    background: var(--accent); border-radius: 1px;
    animation: slide 1s linear infinite;
  }
  @keyframes slide { to { left: 150%; } }

  .status-pill {
    display: inline-flex; align-items: center; gap: 6px;
    background: var(--accent-dim); color: var(--accent);
    padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 500;
  }
  .status-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--accent); animation: pulse 1.2s infinite; }

  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 2px; }

  .upload-progress {
    margin: 8px 16px; background: var(--surface2); border-radius: 6px; overflow: hidden; height: 3px;
  }
  .upload-progress-bar { height: 100%; background: var(--accent); transition: width 0.3s; }

  .error-msg { color: var(--danger); font-size: 12px; padding: 8px 16px; }
`;

async function extractTextFromPDF(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const base64 = e.target.result.split(",")[1];
        resolve({ base64, name: file.name, size: file.size });
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function formatResponse(text) {
  const lines = text.split("\n");
  let html = "";
  lines.forEach((line) => {
    if (line.startsWith("**") && line.endsWith("**")) {
      html += `<p><strong>${line.slice(2, -2)}</strong></p>`;
    } else if (line.startsWith("- ") || line.startsWith("• ")) {
      html += `<li>${line.slice(2)}</li>`;
    } else if (line.trim()) {
      html += `<p>${line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/`(.*?)`/g, "<code>$1</code>")}</p>`;
    }
  });
  return html;
}

const QUICK_PROMPTS = [
  "Summarize this document",
  "What are the key concepts?",
  "Generate 5 flashcard questions",
  "What might appear on an exam?",
];

const SUGGESTIONS = [
  "Explain the main topic in simple terms",
  "List the 5 most important points",
  "Create practice quiz questions",
  "What should I focus on for the exam?",
];

export default function StudyAssistant() {
  const [docs, setDocs] = useState([]);
  const [activeDoc, setActiveDoc] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");
  const chatEndRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleFile = async (file) => {
    if (!file || file.type !== "application/pdf") {
      setError("Please upload a PDF file.");
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      setError("File too large. Max 20MB.");
      return;
    }
    setError("");
    setUploading(true);
    try {
      const data = await extractTextFromPDF(file);
      const doc = {
        id: Date.now(),
        name: file.name.replace(".pdf", ""),
        rawName: file.name,
        base64: data.base64,
        size: file.size,
        addedAt: new Date(),
      };
      setDocs((prev) => [...prev, doc]);
      setActiveDoc(doc);
      setMessages([]);
    } catch {
      setError("Failed to read PDF. Try another file.");
    }
    setUploading(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const sendMessage = async (text) => {
    const q = (text || input).trim();
    if (!q || !activeDoc || loading) return;
    setInput("");
    setError("");

    const userMsg = { role: "user", content: q, id: Date.now() };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const systemPrompt = `You are an expert academic study assistant. The student has uploaded a PDF document called "${activeDoc.rawName}". 
Your job is to help them understand, study, and master the content.

Guidelines:
- Answer questions based on the document content
- Be clear, educational, and encouraging
- For summaries: use bullet points with key concepts highlighted
- For flashcards: format as Q: [question] / A: [answer] pairs
- For exam prep: focus on likely test topics and concepts
- Keep responses focused and well-structured
- If a question isn't covered in the document, say so honestly`;

      const response = await fetch('/api/ask', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1000,
    system: systemPrompt,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'document',
            source: {
              type: 'base64',
              media_type: 'application/pdf',
              data: activeDoc.base64,
            },
          },
          { type: 'text', text: q },
        ],
      },
    ],
  }),
});

      const data = await response.json();

      if (data.error) throw new Error(data.error.message);

      const aiText = data.content?.find((b) => b.type === "text")?.text || "No response.";
      setMessages((prev) => [...prev, { role: "ai", content: aiText, id: Date.now() }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: `Sorry, something went wrong: ${err.message}`, id: Date.now(), isError: true },
      ]);
    }
    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const deleteDoc = (id, e) => {
    e.stopPropagation();
    setDocs((prev) => prev.filter((d) => d.id !== id));
    if (activeDoc?.id === id) {
      setActiveDoc(null);
      setMessages([]);
    }
  };

  return (
    <>
      <style>{STYLES}</style>
      <div id="root">
        <aside className="sidebar">
          <div className="sidebar-header">
            <div className="logo">
              StudyAI
              <span>powered by Claude</span>
            </div>
          </div>

          <div
            className={`drop-zone ${dragOver ? "drag-over" : ""}`}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => handleFile(e.target.files[0])}
            />
            <div className="drop-icon">📄</div>
            <div className="drop-text">
              <strong>Upload PDF</strong>
              Click or drag & drop
            </div>
          </div>

          {uploading && (
            <div className="upload-progress" style={{ margin: "0 16px 8px" }}>
              <div className="upload-progress-bar" style={{ width: "70%" }} />
            </div>
          )}

          {error && <div className="error-msg">{error}</div>}

          <div className="docs-list">
            {docs.length > 0 && <div className="docs-label">Your documents</div>}
            {docs.map((doc) => (
              <div
                key={doc.id}
                className={`doc-item ${activeDoc?.id === doc.id ? "active" : ""}`}
                onClick={() => { setActiveDoc(doc); setMessages([]); }}
              >
                <div className="doc-icon">📑</div>
                <div style={{ flex: 1, overflow: "hidden" }}>
                  <div className="doc-name">{doc.name}</div>
                  <div className="doc-pages">{(doc.size / 1024).toFixed(0)} KB</div>
                </div>
                <button className="doc-delete" onClick={(e) => deleteDoc(doc.id, e)} title="Remove">✕</button>
              </div>
            ))}
          </div>
        </aside>

        <main className="main">
          <div className="topbar">
            <div className="topbar-doc">
              {activeDoc ? (
                <>
                  <span className="doc-badge">ACTIVE</span>
                  <strong>{activeDoc.name}</strong>
                </>
              ) : (
                <span>No document selected</span>
              )}
            </div>
            {activeDoc && (
              <div className="quick-actions">
                {QUICK_PROMPTS.map((p) => (
                  <button key={p} className="quick-btn" onClick={() => sendMessage(p)}>
                    {p}
                  </button>
                ))}
              </div>
            )}
          </div>

          {loading && <div className="processing-bar" />}

          <div className="chat-area">
            {!activeDoc ? (
              <div className="empty-state">
                <div className="empty-icon">📚</div>
                <h3>Upload a lecture to begin</h3>
                <p>Drop any PDF — lecture slides, textbook chapters, research papers — and start asking questions.</p>
              </div>
            ) : messages.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">✨</div>
                <h3>Ready to study</h3>
                <p>Ask anything about <strong style={{ color: "var(--accent)" }}>{activeDoc.name}</strong></p>
                <div className="suggestion-chips">
                  {SUGGESTIONS.map((s) => (
                    <button key={s} className="chip" onClick={() => sendMessage(s)}>{s}</button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((msg) => (
                <div key={msg.id} className={`message ${msg.role}`}>
                  <div className={`avatar ${msg.role}`}>
                    {msg.role === "ai" ? "✦" : "You"[0]}
                  </div>
                  <div
                    className="bubble"
                    dangerouslySetInnerHTML={{
                      __html: msg.role === "ai"
                        ? formatResponse(msg.content)
                        : `<p>${msg.content}</p>`,
                    }}
                  />
                </div>
              ))
            )}

            {loading && (
              <div className="message ai">
                <div className="avatar ai">✦</div>
                <div className="bubble">
                  <div className="typing-indicator">
                    <div className="dot" /><div className="dot" /><div className="dot" />
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="input-area">
            <div className="input-row">
              <textarea
                ref={textareaRef}
                rows={1}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  e.target.style.height = "auto";
                  e.target.style.height = Math.min(e.target.scrollHeight, 150) + "px";
                }}
                onKeyDown={handleKeyDown}
                placeholder={activeDoc ? `Ask anything about "${activeDoc.name}"…` : "Upload a PDF to start…"}
                disabled={!activeDoc || loading}
              />
              <button
                className="send-btn"
                onClick={() => sendMessage()}
                disabled={!input.trim() || !activeDoc || loading}
              >
                ↑
              </button>
            </div>
            <div className="input-hint">
              Enter to send · Shift+Enter for new line · Claude reads your full PDF
            </div>
          </div>
        </main>
      </div>
    </>
  );
}