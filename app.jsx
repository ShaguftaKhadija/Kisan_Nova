import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title } from 'chart.js';
import { Doughnut, Bar, Line } from 'react-chartjs-2';
import './App.css';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title);

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

export default function App() {
  const [lang, setLang] = useState('en');
  const [activeTab, setActiveTab] = useState('home');

  // Backend Task & Crop State
  const [tasks, setTasks] = useState([]);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDueDate, setTaskDueDate] = useState('');
  const [taskPriority, setTaskPriority] = useState('Medium');
  const [cropAdvice, setCropAdvice] = useState([]);
  const [loading, setLoading] = useState(false);

  // Modal State for Tools
  const [activeModal, setActiveModal] = useState(null);

  // AI Chat State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    {
      sender: 'ai',
      text: 'Namaste! I am your Kisan Mitra AI assistant. Ask me anything about crop diseases, spray measurements, fertilizer doses, or mandi rates.'
    }
  ]);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const { data } = await API.get('/tasks');
      setTasks(data);
    } catch (err) {
      console.log('Backend offline mode.');
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!taskTitle || !taskDueDate) return;

    try {
      const { data } = await API.post('/tasks', {
        title: taskTitle,
        dueDate: taskDueDate,
        priority: taskPriority
      });
      setTasks([data, ...tasks]);
      setTaskTitle('');
      setTaskDueDate('');
    } catch (err) {
      alert('Backend server se connect nahi ho paya!');
    }
  };

  const handleToggleTask = async (id) => {
    try {
      const { data } = await API.put(`/tasks/${id}`);
      setTasks(tasks.map(t => t._id === id ? data : t));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await API.delete(`/tasks/${id}`);
      setTasks(tasks.filter(t => t._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleGetCrops = async () => {
    setLoading(true);
    try {
      const { data } = await API.post('/crops/recommend', { season: 'Rabi', soilType: 'Loamy' });
      setCropAdvice(data.recommendations || []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleSendMessage = (textToSend) => {
    const query = textToSend || chatInput;
    if (!query.trim()) return;

    const newMsgs = [...chatMessages, { sender: 'user', text: query }];
    setChatMessages(newMsgs);
    setChatInput('');

    setTimeout(() => {
      const q = query.toLowerCase();
      let reply = "";

      if (q.includes('rust') || q.includes('रतुआ') || q.includes('रोग')) {
        reply = lang === 'hi'
          ? "पीले रतुआ के लिए: तुरंत प्रोपिकोनाज़ोल 25% EC (टिल्ट) 1 ml प्रति लीटर पानी में मिलाकर 200 लीटर पानी प्रति एकड़ स्प्रे करें।"
          : "For Yellow Rust: Spray Propiconazole 25% EC @ 1ml per liter water (200ml per acre in 200L clean water).";
      } else if (q.includes('fertilizer') || q.includes('खाद') || q.includes('npk')) {
        reply = lang === 'hi'
          ? "गेहूँ के लिए संतुलित खाद: बुआई पर 50 किलो DAP + 25 किलो MOP प्रति एकड़। पहली सिंचाई पर 45 किलो यूरिया दें।"
          : "For Wheat: Apply 50 kg DAP + 25 kg MOP at sowing. Top-dress with 45 kg Urea during the first irrigation.";
      } else if (q.includes('irrigate') || q.includes('सिंचाई') || q.includes('पानी')) {
        reply = lang === 'hi'
          ? "गेहूँ की पहली सिंचाई बुआई के 21 दिन बाद (CRI अवस्था) जरूर करें।"
          : "Critical Wheat Irrigation: Always apply 1st irrigation at 21 days after sowing (Crown Root Initiation stage).";
      } else {
        reply = lang === 'hi'
          ? "किसान भाई, आपका प्रश्न नोट कर लिया गया है। खेत की मिट्टी और फसल के अनुसार सही खाद और स्प्रे की जानकारी टूल्स में उपलब्ध है।"
          : "Hello farmer! I have recorded your query. You can check the specific calculators above for precise seed and spray ratios.";
      }

      setChatMessages([...newMsgs, { sender: 'ai', text: reply }]);
    }, 400);
  };

  // Charts Data
  const pieData = {
    labels: lang === 'hi' ? ['गेहूँ (2.1 एकड़)', 'सरसों (0.9 एकड़)', 'आलू (0.5 एकड़)'] : ['Wheat (2.1 Ac)', 'Mustard (0.9 Ac)', 'Potato (0.5 Ac)'],
    datasets: [{
      data: [2.1, 0.9, 0.5],
      backgroundColor: ['#15803d', '#f59e0b', '#3b82f6'],
      borderWidth: 2,
      borderColor: '#ffffff'
    }]
  };

  const barData = {
    labels: ['Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: lang === 'hi' ? 'खर्च (₹)' : 'Input Cost (₹)',
        data: [12000, 15400, 8000, 11000, 6000],
        backgroundColor: '#ef4444',
        borderRadius: 6
      },
      {
        label: lang === 'hi' ? 'आय (₹)' : 'Sales (₹)',
        data: [0, 0, 14000, 32000, 46200],
        backgroundColor: '#15803d',
        borderRadius: 6
      }
    ]
  };

  const lineData = {
    labels: ['15 Oct', '17 Oct', '19 Oct', '21 Oct', '23 Oct', '25 Oct'],
    datasets: [{
      label: lang === 'hi' ? 'मिट्टी की नमी (%)' : 'Soil Root Moisture (%)',
      data: [78, 72, 65, 58, 52, 45],
      borderColor: '#0284c7',
      backgroundColor: 'rgba(2, 132, 199, 0.1)',
      fill: true,
      tension: 0.35
    }]
  };

  return (
    <div>
      {/* Top Header */}
      <header className="top-header">
        <div className="header-inner">
          <div className="brand-wrap" onClick={() => setActiveTab('home')}>
            <div className="brand-icon">🌱</div>
            <div className="brand-text">
              <h1>Kisan Nova</h1>
              <p>{lang === 'hi' ? 'स्मार्ट खेती, खुशहाल किसान' : 'Smart Agriculture, Prosperous Farmer'}</p>
            </div>
          </div>

          <div className="lang-selector">
            <button className={`lang-btn ${lang === 'en' ? 'active' : ''}`} onClick={() => setLang('en')}>EN</button>
            <button className={`lang-btn ${lang === 'hi' ? 'active' : ''}`} onClick={() => setLang('hi')}>हिन्दी</button>
            <button className={`lang-btn ${lang === 'bn' ? 'active' : ''}`} onClick={() => setLang('bn')}>বাংলা</button>
          </div>
        </div>
      </header>

      <main className="container">
        {/* VIEW 1: HOME */}
        {activeTab === 'home' && (
          <div>
            <div className="hero">
              <div className="hero-badge">🌾 AI-Powered Farm OS</div>
              <h2>{lang === 'hi' ? 'सच्ची किसानी ज़रूरतों के लिए आधुनिक डिजिटल साथी।' : 'Built around real farming needs and your prosperous future.'}</h2>
              <p className="hero-sub">{lang === 'hi' ? 'वैज्ञानिक फसल सलाह, मौसम और मंडी भाव सीधे आपके हाथ में।' : 'Scientific crop selection, mandi price trends, and field activity scheduling.'}</p>
              <div className="hero-actions">
                <button className="btn btn-gold" onClick={() => setActiveTab('tools')}>🚜 {lang === 'hi' ? 'कृषि उपकरण' : 'Explore Tools'}</button>
                <button className="btn btn-white" onClick={() => setActiveTab('dashboard')}>📊 {lang === 'hi' ? 'डैशबोर्ड' : 'View Dashboard'}</button>
              </div>
            </div>

            {/* Quick Cards Grid */}
            <div className="grid-3" style={{ marginBottom: '1.5rem' }}>
              <div className="card" onClick={() => setActiveModal('disease')} style={{ cursor: 'pointer' }}>
                <div className="card-top">
                  <div className="tool-icon">🍃</div>
                  <div>
                    <h4 className="card-title">{lang === 'hi' ? 'रोग निदान क्लिनिक' : 'Plant Disease Clinic'}</h4>
                    <p className="card-desc">{lang === 'hi' ? 'पत्तियों के रोग पहचानें और सही दवा जानें।' : 'Diagnose rust and blights with verified chemical spray ratios.'}</p>
                  </div>
                </div>
                <span className="card-footer-btn">{lang === 'hi' ? 'इलाज देखें' : 'Diagnose Disease'} &rarr;</span>
              </div>

              <div className="card" onClick={() => setActiveModal('mandi')} style={{ cursor: 'pointer' }}>
                <div className="card-top">
                  <div className="tool-icon">📊</div>
                  <div>
                    <h4 className="card-title">{lang === 'hi' ? 'मंडी भाव वॉच' : 'Mandi Price Watch'}</h4>
                    <p className="card-desc">{lang === 'hi' ? 'गेहूँ, सरसों, धान के ताजा मंडी भाव देखें।' : 'Check real APMC mandi modal wholesale rates.'}</p>
                  </div>
                </div>
                <span className="card-footer-btn">{lang === 'hi' ? 'दरें देखें' : 'View Today\'s Prices'} &rarr;</span>
              </div>

              <div className="card" onClick={() => setActiveModal('passbook')} style={{ cursor: 'pointer' }}>
                <div className="card-top">
                  <div className="tool-icon">📄</div>
                  <div>
                    <h4 className="card-title">{lang === 'hi' ? 'किसान फार्म पासबुक' : 'Kisan Farm Passbook'}</h4>
                    <p className="card-desc">{lang === 'hi' ? 'KCC लोन के लिए 1-क्लिक प्रिंटेबल पासबुक।' : 'Official 1-page printable ledger for KCC bank loans.'}</p>
                  </div>
                </div>
                <span className="card-footer-btn">{lang === 'hi' ? 'पासबुक खोलें' : 'Generate Passbook'} &rarr;</span>
              </div>
            </div>

            {/* Live Task Manager */}
            <div style={{ background: 'white', padding: '1.5rem', borderRadius: '18px', border: '1px solid #dbebe0' }}>
              <h3 style={{ marginBottom: '1rem', color: '#0f391b' }}>📅 {lang === 'hi' ? 'खेत कार्य योजना (Live Database)' : 'Field Task Calendar (Live Database)'}</h3>
              
              <form onSubmit={handleAddTask} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
                <input
                  type="text"
                  placeholder={lang === 'hi' ? 'कार्य का नाम (उदा. DAP बुआई)' : 'Task name (e.g. Sowing DAP)'}
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  style={{ flex: '1', minWidth: '200px', padding: '0.65rem 0.9rem', borderRadius: '10px', border: '1.5px solid #dbebe0' }}
                  required
                />
                <input
                  type="date"
                  value={taskDueDate}
                  onChange={(e) => setTaskDueDate(e.target.value)}
                  style={{ padding: '0.65rem 0.9rem', borderRadius: '10px', border: '1.5px solid #dbebe0' }}
                  required
                />
                <select
                  value={taskPriority}
                  onChange={(e) => setTaskPriority(e.target.value)}
                  style={{ padding: '0.65rem 0.9rem', borderRadius: '10px', border: '1.5px solid #dbebe0' }}
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
                <button type="submit" className="btn btn-gold">+ {lang === 'hi' ? 'जोड़ें' : 'Add Task'}</button>
              </form>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {tasks.length === 0 ? (
                  <p style={{ color: '#536b56', fontSize: '0.9rem' }}>{lang === 'hi' ? 'अभी कोई कार्य लंबित नहीं है।' : 'No tasks recorded yet in database.'}</p>
                ) : (
                  tasks.map((t) => (
                    <div key={t._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', background: '#fafdfa', border: '1px solid #dbebe0', borderRadius: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <input
                          type="checkbox"
                          checked={t.isCompleted}
                          onChange={() => handleToggleTask(t._id)}
                          style={{ cursor: 'pointer', width: '18px', height: '18px' }}
                        />
                        <span style={{ textDecoration: t.isCompleted ? 'line-through' : 'none', color: t.isCompleted ? '#888' : '#132415', fontWeight: 600 }}>
                          {t.title}
                        </span>
                        <span style={{ fontSize: '0.75rem', background: t.priority === 'High' ? '#fee2e2' : '#fef3c7', padding: '0.2rem 0.5rem', borderRadius: '6px' }}>
                          {t.priority}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span style={{ fontSize: '0.82rem', color: '#536b56' }}>{t.dueDate}</span>
                        <button onClick={() => handleDeleteTask(t._id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', fontWeight: 700 }}>✕</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div>
            <div className="section-head">
              <div>
                <h3>📊 {lang === 'hi' ? 'फार्म एनालिटिक्स डैशबोर्ड' : 'Farm Analytics Dashboard'}</h3>
                <p>{lang === 'hi' ? 'फसल वितरण पाई चार्ट और आय-व्यय ग्राफ' : 'Interactive charts & field analytics'}</p>
              </div>
              <button className="btn btn-outline btn-sm" onClick={() => window.print()}>🖨️ Export PDF</button>
            </div>

            <div className="grid-2" style={{ marginBottom: '1.5rem' }}>
              <div className="chart-box">
                <h4>🥧 {lang === 'hi' ? 'भूमि एवं फसल वितरण' : 'Land & Crop Distribution'}</h4>
                <div className="chart-canvas-wrap">
                  <Doughnut data={pieData} options={{ maintainAspectRatio: false }} />
                </div>
              </div>
              <div className="chart-box">
                <h4>📊 {lang === 'hi' ? 'वित्तीय संतुलन (₹)' : 'Financial Balance (₹)'}</h4>
                <div className="chart-canvas-wrap">
                  <Bar data={barData} options={{ maintainAspectRatio: false }} />
                </div>
              </div>
            </div>

            <div className="chart-box">
              <h4>💧 {lang === 'hi' ? 'मिट्टी की नमी स्तर (%)' : 'Soil Moisture (%)'}</h4>
              <div className="chart-canvas-wrap">
                <Line data={lineData} options={{ maintainAspectRatio: false }} />
              </div>
            </div>
          </div>
        )}

        {/* VIEW 3: ALL TOOLS */}
        {activeTab === 'tools' && (
          <div>
            <div className="section-head">
              <div>
                <h3>🚜 {lang === 'hi' ? 'किसान नोवा कृषि उपकरण' : 'Kisan Nova Agricultural Tools'}</h3>
                <p>{lang === 'hi' ? 'कैलकुलेटर, सलाह और योजना टूल्स' : 'Calculators, advisory, and planning tools'}</p>
              </div>
            </div>

            {/* Smart Crop Backend API Tool */}
            <div style={{ background: 'white', padding: '1.5rem', borderRadius: '18px', border: '1px solid #dbebe0', marginBottom: '1.5rem' }}>
              <h4 style={{ color: '#0f391b', marginBottom: '0.5rem' }}>🌾 {lang === 'hi' ? 'स्मार्ट फसल चयन इंजन' : 'Smart Crop Recommendation Engine'}</h4>
              <p style={{ color: '#536b56', fontSize: '0.88rem', marginBottom: '1rem' }}>
                {lang === 'hi' ? 'बैकएंड सर्वर से रबी सीज़न की सबसे अधिक लाभकारी फसलें निकालें।' : 'Fetch recommended seeds and profit estimations from the backend API.'}
              </p>
              <button className="btn btn-gold" onClick={handleGetCrops} disabled={loading}>
                {loading ? 'Fetching...' : (lang === 'hi' ? 'फसलें जांचें (API Call)' : 'Get Recommendations (API Call)')}
              </button>

              {cropAdvice.length > 0 && (
                <div style={{ marginTop: '1.25rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                  {cropAdvice.map((c, idx) => (
                    <div key={idx} style={{ background: '#f4fbf5', padding: '1rem', borderRadius: '12px', border: '1px solid #c7e6cc' }}>
                      <strong style={{ color: '#15803d', fontSize: '1rem' }}>{lang === 'hi' ? c.cropHi : c.crop}</strong>
                      <p style={{ fontSize: '0.85rem', color: '#333', marginTop: '0.35rem' }}>⏳ Duration: {c.duration}</p>
                      <p style={{ fontSize: '0.85rem', color: '#333' }}>🌾 Yield: {c.expectedYield}</p>
                      <p style={{ fontSize: '0.85rem', color: '#15803d', fontWeight: 700, marginTop: '0.35rem' }}>💰 Profit: ₹{c.profitPerAcre} / Acre</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="grid-3">
              <div className="card" onClick={() => setActiveModal('simulator')} style={{ cursor: 'pointer' }}>
                <div className="card-top">
                  <div className="tool-icon">🌱</div>
                  <div>
                    <h4 className="card-title">{lang === 'hi' ? 'निर्णय सिम्युलेटर (फसल तुलना)' : 'Decision Simulator'}</h4>
                    <p className="card-desc">Compare Crop A vs Crop B side-by-side evaluating water needs and profits.</p>
                  </div>
                </div>
                <span className="card-footer-btn">{lang === 'hi' ? 'तुलना करें' : 'Run Comparison'} &rarr;</span>
              </div>

              <div className="card" onClick={() => setActiveModal('tankmix')} style={{ cursor: 'pointer' }}>
                <div className="card-top">
                  <div className="tool-icon">🧮</div>
                  <div>
                    <h4 className="card-title">{lang === 'hi' ? 'स्प्रे टैंक मिक्स कैलकुलेटर' : 'Tank Mix & Spray Dosage'}</h4>
                    <p className="card-desc">Accurate chemical dosage per 16L/20L knapsack sprayer.</p>
                  </div>
                </div>
                <span className="card-footer-btn">{lang === 'hi' ? 'डोज़ निकालें' : 'Calculate Dosage'} &rarr;</span>
              </div>

              <div className="card" onClick={() => setActiveModal('calculator')} style={{ cursor: 'pointer' }}>
                <div className="card-top">
                  <div className="tool-icon">💰</div>
                  <div>
                    <h4 className="card-title">{lang === 'hi' ? 'लागत एवं मुनाफा कैलकुलेटर' : 'Cost & Profit Calculator'}</h4>
                    <p className="card-desc">Simulate Low, Expected, and High harvest scenarios.</p>
                  </div>
                </div>
                <span className="card-footer-btn">{lang === 'hi' ? 'मुनाफा देखें' : 'Calculate Profit'} &rarr;</span>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* MODAL POPUP FOR ALL TOOLS */}
      {activeModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: 'white', maxWidth: '550px', width: '100%', borderRadius: '18px', padding: '1.75rem', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>
            <button onClick={() => setActiveModal(null)} style={{ position: 'absolute', top: '1rem', right: '1rem', border: 'none', background: '#edf5ee', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', fontWeight: 700 }}>✕</button>

            {activeModal === 'disease' && (
              <div>
                <h3 style={{ color: '#0f391b', marginBottom: '0.75rem' }}>🍃 Plant Disease Clinic</h3>
                <div style={{ background: '#f4fbf5', padding: '1rem', borderRadius: '10px', marginBottom: '0.75rem', border: '1px solid #c7e6cc' }}>
                  <strong>🌾 Wheat Yellow Rust</strong>
                  <p style={{ fontSize: '0.85rem', color: '#15803d', marginTop: '0.3rem' }}>Spray <strong>Propiconazole 25% EC</strong> @ 1ml per liter water (200ml in 200L water per acre).</p>
                </div>
                <div style={{ background: '#f4fbf5', padding: '1rem', borderRadius: '10px', border: '1px solid #c7e6cc' }}>
                  <strong>🍅 Tomato & Potato Early Blight</strong>
                  <p style={{ fontSize: '0.85rem', color: '#15803d', marginTop: '0.3rem' }}>Spray <strong>Mancozeb 75 WP</strong> @ 2.5g per liter water immediately.</p>
                </div>
              </div>
            )}

            {activeModal === 'mandi' && (
              <div>
                <h3 style={{ color: '#0f391b', marginBottom: '0.75rem' }}>📊 Mandi Market Price Watch</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid #eee' }}>
                  <span><strong>Wheat (Sharbati)</strong><br/><small style={{ color: '#666' }}>Khanna Mandi, Punjab</small></span>
                  <strong style={{ color: '#15803d' }}>₹2,420 / Q</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid #eee' }}>
                  <span><strong>Mustard (Pusa Bold)</strong><br/><small style={{ color: '#666' }}>Jaipur Mandi, Rajasthan</small></span>
                  <strong style={{ color: '#15803d' }}>₹5,600 / Q</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0' }}>
                  <span><strong>Paddy (Basmati 1121)</strong><br/><small style={{ color: '#666' }}>Karnal Mandi, Haryana</small></span>
                  <strong style={{ color: '#15803d' }}>₹3,850 / Q</strong>
                </div>
              </div>
            )}

            {activeModal === 'tankmix' && (
              <div>
                <h3 style={{ color: '#0f391b', marginBottom: '0.75rem' }}>🧮 Tank Mix Spray Dosage</h3>
                <p style={{ fontSize: '0.88rem', color: '#555', marginBottom: '1rem' }}>Standard 16-Liter Knapsack Sprayer Pump calculation:</p>
                <div style={{ background: '#f4fbf5', padding: '1rem', borderRadius: '10px', border: '1px solid #c7e6cc' }}>
                  • <strong>Mancozeb 75 WP (Fungicide):</strong> 40 grams per 16L pump<br/><br/>
                  • <strong>Propiconazole (Yellow Rust):</strong> 16 ml per 16L pump<br/><br/>
                  • <strong>Chlorpyrifos (Termite/Insects):</strong> 35 ml per 16L pump
                </div>
              </div>
            )}

            {activeModal === 'simulator' && (
              <div>
                <h3 style={{ color: '#0f391b', marginBottom: '0.75rem' }}>🌱 Crop Decision Simulator (2.5 Acres)</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                  <div style={{ background: '#f4fbf5', padding: '0.85rem', borderRadius: '10px', border: '1px solid #c7e6cc' }}>
                    <strong>Wheat (Sharbati)</strong><br/>
                    <small>Water: 4 Cycles<br/>Cost: ₹27,500<br/>Net Profit: <strong>₹33,000</strong></small>
                  </div>
                  <div style={{ background: '#fef3c7', padding: '0.85rem', borderRadius: '10px', border: '1px solid #fde68a' }}>
                    <strong>Mustard (Sarson)</strong><br/>
                    <small>Water: 2 Cycles<br/>Cost: ₹16,250<br/>Net Profit: <strong>₹39,750</strong></small>
                  </div>
                </div>
                <div style={{ background: '#ecfdf5', padding: '0.75rem', borderRadius: '8px', color: '#15803d', fontSize: '0.85rem', fontWeight: 600 }}>
                  💡 Recommendation: Mustard offers ₹6,750 higher profit with 50% less irrigation water than Wheat.
                </div>
              </div>
            )}

            {activeModal === 'calculator' && (
              <div>
                <h3 style={{ color: '#0f391b', marginBottom: '0.75rem' }}>💰 Cost & Profit Calculator</h3>
                <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '1rem' }}>Total Production: 50 Quintals | Total Season Expenses: ₹35,400</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: '1px solid #eee' }}>
                  <span>Low Price (-15% @ ₹2,050/Q)</span>
                  <strong style={{ color: '#15803d' }}>+₹67,100 Profit</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: '1px solid #eee' }}>
                  <span>Expected Price (@ ₹2,420/Q)</span>
                  <strong style={{ color: '#15803d' }}>+₹85,600 Profit</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0' }}>
                  <span>Harvest Peak (+15% @ ₹2,780/Q)</span>
                  <strong style={{ color: '#15803d' }}>+₹1,03,600 Profit</strong>
                </div>
              </div>
            )}

            {activeModal === 'passbook' && (
              <div>
                <h3 style={{ color: '#0f391b', marginBottom: '0.75rem' }}>📄 Official Kisan Farm Passbook</h3>
                <div style={{ border: '2px solid #15803d', padding: '1rem', borderRadius: '10px', fontSize: '0.85rem', background: '#fafdfa', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #ccc', paddingBottom: '0.5rem', marginBottom: '0.5rem' }}>
                    <strong>Kisan Nova Farm Ledger</strong>
                    <span>ID: KN-2026-9812</span>
                  </div>
                  Farmer: Ramesh Kumar | Land: 3.5 Acres | Season: Rabi 2026<br/>
                  Active Crops: Wheat (2.1 Acres), Mustard (0.9 Acres), Potato (0.5 Acres)<br/>
                  Total Input Cost: ₹35,400 | Projected Sales: ₹1,12,000<br/>
                  Net Margin: ₹76,600 | KCC Credit Eligible: ₹1,50,000
                </div>
                <button className="btn btn-gold" style={{ width: '100%' }} onClick={() => window.print()}>🖨️ Print Passbook (KCC Loan Ready)</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <div className="ai-fab" onClick={() => setIsChatOpen(!isChatOpen)}>
        <span>🤖</span>
        <span>{lang === 'hi' ? 'किसान मित्र AI' : 'Ask Kisan Mitra AI'}</span>
      </div>

      {/* Kisan Mitra Interactive Chat Window */}
      {isChatOpen && (
        <div className="ai-window">
          <div className="ai-header">
            <strong>🌱 {lang === 'hi' ? 'किसान मित्र AI सहायक' : 'Kisan Mitra AI Assistant'}</strong>
            <button onClick={() => setIsChatOpen(false)} style={{ background: 'none', border: 'none', color: 'white', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
          </div>

          <div className="ai-messages">
            {chatMessages.map((msg, i) => (
              <div key={i} className={`chat-bubble ${msg.sender === 'ai' ? 'chat-ai' : 'chat-user'}`}>
                {msg.text}
              </div>
            ))}
          </div>

          <div className="ai-quick-prompts">
            <div className="prompt-chip" onClick={() => handleSendMessage('Wheat Yellow Rust')}>🌾 Yellow Rust</div>
            <div className="prompt-chip" onClick={() => handleSendMessage('Wheat Fertilizer Dose')}>🌱 Wheat Fertilizer</div>
            <div className="prompt-chip" onClick={() => handleSendMessage('When should I irrigate?')}>💧 Irrigation Timing</div>
          </div>

          <div className="ai-input-bar">
            <input
              type="text"
              className="ai-input"
              placeholder={lang === 'hi' ? 'खेती से जुड़ा सवाल पूछें...' : 'Ask your farming question...'}
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <button className="ai-send-btn" onClick={() => handleSendMessage()}>➤</button>
          </div>
        </div>
      )}

      {/* Bottom Nav */}
      <nav className="bottom-nav">
        <div className={`nav-item ${activeTab === 'home' ? 'active' : ''}`} onClick={() => setActiveTab('home')}>
          <span style={{ fontSize: '1.3rem' }}>🏠</span>
          <span>{lang === 'hi' ? 'होम' : 'Home'}</span>
        </div>
        <div className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
          <span style={{ fontSize: '1.3rem' }}>📊</span>
          <span>{lang === 'hi' ? 'डैशबोर्ड' : 'Dashboard'}</span>
        </div>
        <div className={`nav-item ${activeTab === 'tools' ? 'active' : ''}`} onClick={() => setActiveTab('tools')}>
          <span style={{ fontSize: '1.3rem' }}>🚜</span>
          <span>{lang === 'hi' ? 'उपकरण' : 'Tools'}</span>
        </div>
        <div className="nav-item" onClick={() => setIsChatOpen(true)}>
          <span style={{ fontSize: '1.3rem' }}>🤖</span>
          <span>{lang === 'hi' ? 'किसान मित्र' : 'Kisan Mitra'}</span>
        </div>
      </nav>
    </div>
  );
}