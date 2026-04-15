import { useState } from 'react'
import axios from 'axios'
import { Link2, Copy, Zap, Clock3, Loader2 } from 'lucide-react'

// Define the shape of our Link object based on your backend schema
interface LinkRecord {
  id: number;
  originalUrl: string;
  shortCode: string;
  clicks: number;
}

// const API_BASE_URL = "https://lnk-io-backend.onrender.com";

function App() {
  const [originalUrl, setOriginalUrl] = useState('')
  const [history, setHistory] = useState<LinkRecord[]>([])
  const [currentShortLink, setCurrentShortLink] = useState<LinkRecord | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleShorten = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setCurrentShortLink(null)

    try {
      const response = await axios.post("https://lnk-io-backend.onrender.com", { originalUrl });
      const newLink = response.data;
      setCurrentShortLink(newLink);
      // Add the new link to the top of the history list
      setHistory(prev => [newLink, ...prev]); 
      setOriginalUrl(''); // Clear input
    } catch (err) {
      setError('API error. Ensure the backend is running.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (code: string) => {
    const fullUrl = `http://localhost:5000/${code}`
    navigator.clipboard.writeText(fullUrl)
  }

  return (
    <div className="min-h-screen bg-[#0d1117] text-white flex flex-col font-sans">
      
      {/* 1. Header (LOGO ON LEFT, BIGGER) */}
      <header className="w-full border-b border-gray-800 bg-[#0d1117]/80 backdrop-blur-sm sticky top-0 z-50">
        <nav className="max-w-[1700px] mx-auto flex items-center justify-between p-5 md:px-10">
          <div className="flex items-center gap-3">
            <Zap className="text-sky-400" size={36} strokeWidth={2.5}/>
            {/* Unique Name & Bigger Logo */}
            <span className="text-3xl font-extrabold tracking-tighter">lnk<span className="text-sky-500">.io</span></span>
          </div>
          <div className="flex gap-4 text-sm text-gray-400">
            <button className="bg-sky-600 px-4 py-1.5 rounded-full text-white hover:bg-sky-700 font-medium">Get Started</button>
          </div>
        </nav>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow max-w-[1700px] mx-auto w-full p-6 md:p-10 grid grid-cols-1 xl:grid-cols-12 gap-10">
        
        {/* 2. Left Column (Hero & Input) */}
        <section className="xl:col-span-8 flex flex-col justify-center gap-6">
          <div className="space-y-3">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter leading-tight">
              Shorten links, <span className="text-sky-400">scale trust.</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl">
              Precision-engineered links for high-performance campaigns. Secure, incredibly fast, and analytically superior.
            </p>
          </div>

          <form onSubmit={handleShorten} className="mt-6 flex flex-col md:flex-row gap-3">
            <input
              type="url"
              required
              className="flex-grow bg-[#161b22] border border-gray-800 rounded-xl p-4 text-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all placeholder:text-gray-600"
              placeholder="Paste your long destination URL here..."
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
            />
            <button
              type="submit"
              disabled={loading}
              className="md:w-48 bg-sky-600 hover:bg-sky-700 disabled:bg-sky-800 p-4 rounded-xl text-xl font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              {loading ? <Loader2 className="animate-spin" /> : 'Shorten'}
            </button>
          </form>
          {error && <p className="text-red-400 mt-2 text-sm">{error}</p>}
        </section>

        {/* 3. Right Column (The Semi-Opaque "Empty Space" Utilizer) */}
        <aside className="xl:col-span-4 space-y-8 xl:mt-20">
          
          {/* Newest Link (Active State) */}
          {currentShortLink && (
            <div className="bg-[#161b22]/70 backdrop-blur-xl border border-sky-600/30 p-6 rounded-3xl shadow-2xl animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-semibold text-sky-400">Your new link is ready:</p>
                <div className="flex gap-2">
                  <button onClick={() => copyToClipboard(currentShortLink.shortCode)} className="p-2 hover:bg-[#0d1117] rounded-md text-gray-400 hover:text-white">
                    <Copy size={20} />
                  </button>
                  <a href={`https://lnk-io-backend.onrender.com${currentShortLink.shortCode}`} target="_blank" rel="noreferrer" className="p-2 hover:bg-[#0d1117] rounded-md text-gray-400 hover:text-white">
                    <Link2 size={20} />
                  </a>
                </div>
              </div>
              <p className="text-4xl font-mono text-white truncate border-b border-gray-800 pb-4">lnk.io/{currentShortLink.shortCode}</p>
              <p className="text-xs text-gray-600 mt-3 truncate">{currentShortLink.originalUrl}</p>
            </div>
          )}

          {/* Features Grid (Utility State) */}
          {/* {!currentShortLink && (
            <div className="grid grid-cols-2 gap-4 bg-[#161b22]/50 p-6 rounded-3xl border border-gray-800">
               <div className="border border-gray-800 p-5 rounded-2xl flex flex-col gap-2">
                    <Clock3 size={24} className="text-sky-500" />
                    <p className="font-semibold text-lg">Instant</p>
                    <p className="text-xs text-gray-500">Links resolve in milliseconds.</p>
               </div>
               <div className="border border-gray-800 p-5 rounded-2xl flex flex-col gap-2">
                    <BarChart3 size={24} className="text-sky-500" />
                    <p className="font-semibold text-lg">Analytics</p>
                    <p className="text-xs text-gray-500">Track clicks and sources.</p>
               </div>
               <div className="border border-gray-800 p-5 rounded-2xl flex flex-col gap-2 col-span-2">
                    <Zap size={24} className="text-sky-500" />
                    <p className="font-semibold text-lg">Real World Utility</p>
                    <p className="text-xs text-gray-500">Designed for professional use cases.</p>
               </div>
            </div>
          )} */}
        </aside>
      </main>

      {/* 4. History List (Responsive Infrastructure) */}
      <section className="max-w-[1700px] mx-auto w-full p-6 md:p-10 md:pt-0 mb-10">
        <div className="bg-[#161b22]/60 backdrop-blur border border-gray-800 p-6 md:p-8 rounded-3xl mt-10 xl:mt-0">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2"><Clock3 className="text-gray-500"/>Recent Infrastructure</h2>
            <button className="text-sm text-sky-500 hover:underline">View All History</button>
          </div>
          
          <div className="space-y-3">
            {history.map(link => (
              <div key={link.id} className="grid grid-cols-1 md:grid-cols-12 items-center gap-3 p-4 bg-[#0d1117] border border-gray-800 rounded-xl hover:border-sky-800 transition-colors group">
                <div className="md:col-span-1 flex items-center justify-center p-3 bg-[#161b22] rounded-lg">
                    <Link2 size={24} className="text-sky-600"/>
                </div>
                <div className="md:col-span-7 space-y-1">
                    <p className="text-xl font-mono text-sky-400">lnk.io/{link.shortCode}</p>
                    <p className="text-sm text-gray-600 truncate">{link.originalUrl}</p>
                </div>
                <div className="md:col-span-2 flex flex-col items-end md:items-center text-gray-400">
                    <p className="text-2xl font-bold text-white">{link.clicks.toLocaleString()}</p>
                    <p className="text-xs uppercase tracking-wider text-gray-600">Total Clicks</p>
                </div>
                <div className="md:col-span-2 flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => copyToClipboard(link.shortCode)} className="p-2 hover:bg-[#161b22] rounded-md text-gray-400 hover:text-white">
                        <Copy size={20} />
                    </button>
                </div>
              </div>
            ))}
            {history.length === 0 && <p className="text-center text-gray-600 py-10">No links generated this session.</p>}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t border-gray-800 p-8 bg-[#0d1117]">
        <div className="max-w-[1700px] mx-auto text-sm text-gray-600 flex justify-between">
          <p>© 2026 Lnk.io Technologies. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white">Terms</a>
            <a href="#" className="hover:text-white">Privacy</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App