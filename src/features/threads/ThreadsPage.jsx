import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageSquare, ChevronRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useLanguage } from '../../contexts/LanguageContext.jsx';
import { apiGetThreads } from '../../lib/dispatch.js';
import { Card, Skeleton, EmptyState, Button } from '../../components/ui/index.jsx';
import { formatDistanceToNow } from '../../lib/utils.js';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } };

export default function ThreadsPage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [threads, setThreads] = useState(null);

  useEffect(() => {
    if (!user?.id) return;
    apiGetThreads(user.id)
      .then((d) => setThreads(d?.threads ?? []))
      .catch(() => setThreads([]));
  }, [user?.id]);

  return (
    <div className="px-5 py-6 max-w-2xl mx-auto w-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-on-bg">{t('threads')}</h1>
        <Button size="sm" onClick={() => navigate('/app/chat')}>{t('new_chat')}</Button>
      </div>

      {threads === null ? (
        <div className="flex flex-col gap-2">
          {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-16" />)}
        </div>
      ) : threads.length === 0 ? (
        <Card className="p-8">
          <EmptyState
            icon={MessageSquare}
            title={t('no_recent_chats')}
            action={<Button onClick={() => navigate('/app/chat')}>{t('start_chat_cta')}</Button>}
          />
        </Card>
      ) : (
        <motion.div variants={container} initial="hidden" animate="show" className="flex flex-col gap-2">
          {threads.map((thread) => (
            <motion.div key={thread.id} variants={item}>
              <Card
                className="flex items-center gap-3 p-4 hover:border-primary/30 cursor-pointer transition-colors"
                onClick={() => navigate(`/app/chat/${thread.id}`)}
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <MessageSquare size={18} className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-on-bg text-sm truncate">{thread.title}</p>
                  <p className="text-xs text-muted mt-0.5">{formatDistanceToNow(thread.created_at)}</p>
                </div>
                <ChevronRight size={15} className="text-muted flex-shrink-0" />
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
