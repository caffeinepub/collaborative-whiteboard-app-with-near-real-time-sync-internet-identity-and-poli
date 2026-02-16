import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Users } from 'lucide-react';
import { useBoardSnapshot } from '@/api/useBoardSnapshot';
import { getDisplayName } from '@/state/identity';
import { Principal } from '@icp-sdk/core/principal';

interface ParticipantsPanelProps {
  boardId: string;
}

export function ParticipantsPanel({ boardId }: ParticipantsPanelProps) {
  const { data: snapshot } = useBoardSnapshot(boardId);

  // Extract unique participants from operations
  const participants = snapshot?.operations
    ? Array.from(
        new Set(snapshot.operations.map((op) => op.author.toString()))
      ).map((principalStr) => {
        const principal = Principal.fromText(principalStr);
        const displayName = getDisplayName(principal);
        const initials = displayName
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2);
        return { principal: principalStr, displayName, initials };
      })
    : [];

  return (
    <Card className="w-64 m-4 shrink-0 border-border/40 bg-card/80 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Users className="w-4 h-4" />
          Participants
          <Badge variant="secondary" className="ml-auto">
            {participants.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[calc(100vh-12rem)]">
          <div className="space-y-2">
            {participants.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No participants yet
              </p>
            ) : (
              participants.map((participant) => (
                <div
                  key={participant.principal}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/10 transition-colors"
                >
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="text-xs bg-primary/20 text-primary">
                      {participant.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {participant.displayName}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
