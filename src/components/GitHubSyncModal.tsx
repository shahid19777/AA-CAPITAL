import React, { useState } from 'react';
import { 
  X, 
  Github, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Copy, 
  Check, 
  Loader2, 
  Download, 
  Key, 
  ExternalLink,
  ShieldCheck,
  Terminal,
  FolderGit2
} from 'lucide-react';

interface GitHubSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GitHubSyncModal: React.FC<GitHubSyncModalProps> = ({ isOpen, onClose }) => {
  const [token, setToken] = useState('');
  const [branch, setBranch] = useState('main');
  const [repo, setRepo] = useState('shahid19777/AA-CAPITAL');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string; details?: string } | null>(null);
  const [copiedCmd, setCopiedCmd] = useState(false);
  const [activeTab, setActiveTab] = useState<'token' | 'terminal' | 'download'>('token');

  if (!isOpen) return null;

  const handlePush = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/git-push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: token.trim(),
          branch: branch.trim() || 'main',
          repo: repo.trim() || 'shahid19777/AA-CAPITAL'
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setResult({
          success: true,
          message: data.message || 'Successfully pushed all code to GitHub!',
          details: data.details
        });
      } else {
        setResult({
          success: false,
          message: data.error || 'Failed to push. Please check your token permissions.'
        });
      }
    } catch (err: any) {
      setResult({
        success: false,
        message: err.message || 'Network connection failed while pushing to GitHub'
      });
    } finally {
      setLoading(false);
    }
  };

  const terminalCommands = `# 1. Download the complete code archive from the app
# 2. Extract and push to your GitHub repository:
tar -xzf aa-capital-repo.tar.gz
git remote set-url origin https://github.com/${repo}.git
git branch -M ${branch}
git push -u origin ${branch}`;

  const handleCopyCmd = () => {
    navigator.clipboard.writeText(terminalCommands);
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-slate-800 text-white border border-slate-700">
              <Github className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Push Code to GitHub
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Ready to Sync
                </span>
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Target: https://github.com/{repo}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-slate-800 bg-slate-950/50 px-6 gap-2">
          <button
            onClick={() => setActiveTab('token')}
            className={`py-3 px-3 text-xs font-medium border-b-2 transition flex items-center gap-2 ${
              activeTab === 'token'
                ? 'border-emerald-500 text-emerald-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>1-Click Token Push (Instant)</span>
          </button>
          <button
            onClick={() => setActiveTab('terminal')}
            className={`py-3 px-3 text-xs font-medium border-b-2 transition flex items-center gap-2 ${
              activeTab === 'terminal'
                ? 'border-emerald-500 text-emerald-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Local Terminal Commands</span>
          </button>
          <button
            onClick={() => setActiveTab('download')}
            className={`py-3 px-3 text-xs font-medium border-b-2 transition flex items-center gap-2 ${
              activeTab === 'download'
                ? 'border-emerald-500 text-emerald-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Archive</span>
          </button>
        </div>

        {/* Body content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {activeTab === 'token' && (
            <form onSubmit={handlePush} className="space-y-4">
              <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4 text-xs text-slate-300 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>How Direct GitHub Push Works</span>
                </div>
                <p>
                  Because this cloud container does not store your private GitHub credentials, provide your GitHub <strong>Personal Access Token (classic or fine-grained)</strong> with <code className="bg-slate-900 px-1 py-0.5 rounded text-amber-300">repo</code> write permission.
                </p>
                <div className="pt-1">
                  <a
                    href="https://github.com/settings/tokens/new?scopes=repo&description=AA-CAPITAL-AI-Studio"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 underline font-medium"
                  >
                    <span>Click here to create a 30-day token on GitHub with repo permissions</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Target Repository
                </label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <FolderGit2 className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      value={repo}
                      onChange={(e) => setRepo(e.target.value)}
                      placeholder="username/repository"
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>
                  <div className="w-32">
                    <input
                      type="text"
                      value={branch}
                      onChange={(e) => setBranch(e.target.value)}
                      placeholder="main"
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  GitHub Personal Access Token (PAT)
                </label>
                <div className="relative">
                  <Key className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                  <input
                    type="password"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="ghp_xxxxxxxxxxxxxxxxxxxx or github_pat_..."
                    required
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Security note: The token is used in-memory for the git push command and immediately cleared. It is never logged or saved to disk.
                </p>
              </div>

              {result && (
                <div
                  className={`p-4 rounded-xl border text-xs space-y-1.5 ${
                    result.success
                      ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                      : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
                  }`}
                >
                  <div className="flex items-center gap-2 font-semibold">
                    {result.success ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-rose-400" />
                    )}
                    <span>{result.message}</span>
                  </div>
                  {result.details && (
                    <pre className="mt-2 p-2 bg-slate-950/80 rounded border border-slate-800 text-[11px] text-slate-300 font-mono overflow-x-auto whitespace-pre-wrap">
                      {result.details}
                    </pre>
                  )}
                  {result.success && (
                    <div className="pt-2">
                      <a
                        href={`https://github.com/${repo}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-semibold shadow"
                      >
                        <span>View Repository on GitHub</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !token.trim()}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/30 transition"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Pushing commits to {repo}...</span>
                  </>
                ) : (
                  <>
                    <Github className="w-4 h-4" />
                    <span>Push All Codes to GitHub Repo</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {activeTab === 'terminal' && (
            <div className="space-y-4">
              <div className="text-xs text-slate-300">
                You can also push directly from your local terminal using standard git commands:
              </div>

              <div className="relative">
                <pre className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-emerald-400 overflow-x-auto whitespace-pre-wrap">
                  {terminalCommands}
                </pre>
                <button
                  onClick={handleCopyCmd}
                  className="absolute top-3 right-3 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition flex items-center gap-1 text-xs"
                >
                  {copiedCmd ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400 text-[11px]">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span className="text-[11px]">Copy</span>
                    </>
                  )}
                </button>
              </div>

              <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/50 text-xs text-slate-400">
                <span className="text-white font-medium">Included in codebase:</span>
                <ul className="list-disc list-inside mt-1 space-y-0.5 text-slate-300">
                  <li>Full 105+ I.I. Chundrigar Road Commercial Leads Database</li>
                  <li>AA Central 34-Floor High-Definition Procedural Cinematic Experience</li>
                  <li>Web Audio real-time atmospheric background music synthesizer</li>
                  <li>Live Google Gemini Search Grounding scout for Pakistan commercial real estate</li>
                  <li>Corporate Yield & Financial ROI deal calculator</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'download' && (
            <div className="space-y-4 text-center py-4">
              <div className="p-4 rounded-full bg-emerald-500/10 text-emerald-400 w-16 h-16 mx-auto flex items-center justify-center border border-emerald-500/20">
                <Download className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">Download Complete Source Archive</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                  Download <code className="text-emerald-400 font-mono">aa-capital-repo.tar.gz</code> containing all React components, full-stack Express backend, TypeScript types, and git commit history.
                </p>
              </div>

              <div>
                <a
                  href="/api/download-source"
                  download="aa-capital-repo.tar.gz"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-900/30 transition"
                >
                  <Download className="w-4 h-4" />
                  <span>Download aa-capital-repo.tar.gz (450 KB)</span>
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-950/70 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <span>Target: github.com/shahid19777/AA-CAPITAL</span>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
