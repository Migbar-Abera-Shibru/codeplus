// frontend/src/components/ShareButton.tsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Check, Link2, Twitter, Linkedin } from 'lucide-react';
import { generateShareLink } from '../services/api';
import { Button } from './ui/Button';

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

  const handleCopy = async () => {
    if (shareUrl) {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = (platform: 'twitter' | 'linkedin') => {
    if (!shareUrl) return;
    const text = encodeURIComponent(`Check out my CodePulse developer report! 🚀`);
    const url = encodeURIComponent(shareUrl);
    
    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
    };
    
    window.open(urls[platform], '_blank');
  };

  return (
    <div className="relative">
      <Button
        variant="gradient"
        onClick={() => {
          setIsOpen(!isOpen);
          if (!shareUrl) handleGenerateLink();
        }}
      >
        <Share2 className="w-4 h-4 mr-2" />
        Share Report
      </Button>

      <AnimatePresence>
        {isOpen && shareUrl && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-2 w-80 bg-[#1a1a2e] rounded-xl p-4 border border-white/10 shadow-2xl z-50"
          >
            <div className="space-y-3">
              <div className="flex items-center gap-2 p-2 bg-white/5 rounded-lg border border-white/5">
                <input
                  type="text"
                  value={shareUrl}
                  readOnly
                  className="flex-1 bg-transparent text-sm text-gray-300 outline-none"
                />
                <button
                  onClick={handleCopy}
                  className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Link2 className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleShare('twitter')}
                >
                  <Twitter className="w-4 h-4 mr-2" />
                  Twitter
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleShare('linkedin')}
                >
                  <Linkedin className="w-4 h-4 mr-2" />
                  LinkedIn
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}