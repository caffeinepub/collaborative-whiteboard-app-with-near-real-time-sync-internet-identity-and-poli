import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useBoardStore } from '@/state/boardStore';
import { getDisplayName } from '@/state/identity';
import { Info } from 'lucide-react';

export function InspectorPanel() {
  const selectedElements = useBoardStore((state) => state.selectedElements);
  const elements = useBoardStore((state) => state.elements);

  const selectedElement = selectedElements.length === 1
    ? elements.find((el) => el.id === selectedElements[0])
    : null;

  if (!selectedElement) {
    return (
      <Card className="w-64 m-4 shrink-0 border-border/40 bg-card/80 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Info className="w-4 h-4" />
            Properties
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-4">
            {selectedElements.length > 1
              ? `${selectedElements.length} elements selected`
              : 'No element selected'}
          </p>
        </CardContent>
      </Card>
    );
  }

  const creatorName = selectedElement.author
    ? getDisplayName(selectedElement.author)
    : 'Unknown';

  return (
    <Card className="w-64 m-4 shrink-0 border-border/40 bg-card/80 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Info className="w-4 h-4" />
          Properties
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label className="text-xs text-muted-foreground">Type</Label>
          <Badge variant="secondary" className="mt-1">
            {selectedElement.type}
          </Badge>
        </div>

        {selectedElement.type === 'text' && selectedElement.text && (
          <div>
            <Label className="text-xs text-muted-foreground">Content</Label>
            <p className="text-sm mt-1 break-words">{selectedElement.text}</p>
          </div>
        )}

        {selectedElement.color && (
          <div>
            <Label className="text-xs text-muted-foreground">Color</Label>
            <div className="flex items-center gap-2 mt-1">
              <div
                className="w-6 h-6 rounded border border-border"
                style={{
                  backgroundColor: `rgba(${selectedElement.color.r}, ${selectedElement.color.g}, ${selectedElement.color.b}, ${selectedElement.color.a})`,
                }}
              />
            </div>
          </div>
        )}

        <div>
          <Label className="text-xs text-muted-foreground">Created by</Label>
          <p className="text-sm mt-1">{creatorName}</p>
        </div>
      </CardContent>
    </Card>
  );
}
