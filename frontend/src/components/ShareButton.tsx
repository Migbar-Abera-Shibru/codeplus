// frontend/src/components/ShareButton.tsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Check, Link2, Twitter, Linkedin, Copy, X } from 'lucide-react';
import { generateShareLink } from '../services/api';

interface ShareButtonProps {
  username: string;
}

export function ShareButton({ username }: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleGenerateLink = async () => {
    setLoading(true);
    try {
      const result = await generateShareLink(username);
      setShareUrl(result.share_url);
    } catch (error) {
      console.error('Failed to generate share link:', error);
    }
    setLoading(false);
  };

  const handleToggle = () => {
    if (!shareUrl && !loading) {
      handleGenerateLink();
    }
    setIsOpen(!isOpen);
  };

  const handleCopy = async () => {
    if (shareUrl) {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = (platform: 'twitter' | 'linkedin') => {
    if (!shareUrl) return;
    const text = encodeURIComponent(`🚀 Check out my CodePulse developer report!`);
    const url = encodeURIComponent(shareUrl);
    
    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
    };
    
    window.open(urls[platform], '_blank');
  };

  return (
    <div className="relative">
      <motion.button
        onClick={handleToggle}
        className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl font-medium text-white text-sm flex items-center gap-2 hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        disabled={loading}
      >
        {loading ? (
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <Share2 className="w-4 h-4" />
        )}
        {loading ? 'Generating...' : 'Share Report'}
      </motion.button>

      <AnimatePresence>
        {isOpen && shareUrl && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-2 w-80 bg-[#1a1a2e] rounded-2xl p-4 border border-white/10 shadow-2xl z-50"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-white">Share Link</span>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            <div className="flex items-center gap-2 p-2 bg-white/5 rounded-xl border border-white/5 mb-3">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="flex-1 bg-transparent text-sm text-gray-300 outline-none truncate"
              />
              <button
                onClick={handleCopy}
                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Copy className="w-4 h-4 text-gray-400" />
                )}
              </button>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleShare('twitter')}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 rounded-xl transition-colors text-sm text-gray-300"
              >
                <Twitter className="w-4 h-4 text-blue-400" />
                Tweet
              </button>
              <button
                onClick={() => handleShare('linkedin')}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 rounded-xl transition-colors text-sm text-gray-300"
              >
                <Linkedin className="w-4 h-4 text-blue-600" />
                Share
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}