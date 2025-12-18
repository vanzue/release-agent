import { useParams, Link } from 'react-router-dom';
import { Settings, HelpCircle, User, Package } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { useRelease } from '../../context/ReleaseContext';

export function Header() {
  const { releaseId, sessionId } = useParams<{ releaseId?: string; sessionId?: string }>();
  const { releases } = useRelease();

  const release = releases.find((r) => r.id === releaseId);
  const session = release?.sessions.find((s) => s.id === sessionId);

  const getSessionStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-700 border-gray-300';
      case 'generating': return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'ready': return 'bg-green-100 text-green-700 border-green-300';
      case 'exported': return 'bg-purple-100 text-purple-700 border-purple-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center px-6 gap-6 shrink-0">
      <Link to="/" className="flex items-center gap-2">
        <Package className="h-6 w-6 text-blue-600" />
        <h1 className="text-gray-900 tracking-tight">PowerToys Release Factory</h1>
      </Link>

      {session && release && (
        <>
          <div className="h-6 w-px bg-gray-300" />
          
          <div className="flex items-center gap-3 flex-1">
            <Link to={`/releases/${releaseId}`} className="text-gray-700 hover:text-blue-600">
              {release.name}
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-700">{session.name}</span>
            <Badge variant="outline" className={getSessionStatusColor(session.status)}>
              {session.status}
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <Button
              disabled={session.status !== 'ready'}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Export
            </Button>
          </div>
        </>
      )}

      <div className="flex items-center gap-2 ml-auto">
        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <HelpCircle className="h-5 w-5" />
        </Button>
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-blue-100 text-blue-700">
            <User className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
