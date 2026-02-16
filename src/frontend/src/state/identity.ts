import { Principal } from '@icp-sdk/core/principal';

export function getDisplayName(principal: Principal): string {
  const principalStr = principal.toString();
  
  if (principal.isAnonymous()) {
    return 'Anonymous';
  }

  // Return shortened principal as display name
  return `${principalStr.slice(0, 5)}...${principalStr.slice(-3)}`;
}

export function getInitials(displayName: string): string {
  return displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}
