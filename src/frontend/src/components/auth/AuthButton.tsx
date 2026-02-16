import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { LogIn, LogOut, User } from 'lucide-react';
import { getDisplayName } from '@/state/identity';

export function AuthButton() {
  const { identity, login, clear, isLoggingIn, loginStatus } = useInternetIdentity();

  if (isLoggingIn || loginStatus === 'initializing') {
    return (
      <Button disabled variant="outline" size="sm">
        <User className="w-4 h-4 mr-2" />
        Loading...
      </Button>
    );
  }

  if (!identity || identity.getPrincipal().isAnonymous()) {
    return (
      <Button onClick={login} variant="default" size="sm">
        <LogIn className="w-4 h-4 mr-2" />
        Sign In
      </Button>
    );
  }

  const displayName = getDisplayName(identity.getPrincipal());

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <User className="w-4 h-4 mr-2" />
          {displayName}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={clear}>
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
