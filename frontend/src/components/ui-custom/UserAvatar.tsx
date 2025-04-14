
import React from 'react';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  name: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
  highlight?: boolean;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ 
  name, 
  size = "md",
  className,
  highlight = false
}) => {
  const initials = name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
  
  const sizeClasses = {
    "xs": "h-6 w-6 text-xs",
    "sm": "h-8 w-8 text-sm",
    "md": "h-10 w-10 text-base",
    "lg": "h-16 w-16 text-xl",
    "xl": "h-24 w-24 text-2xl"
  };
  
  return (
    <Avatar className={cn(
      sizeClasses[size], 
      highlight && "ring-2 ring-primary ring-offset-2",
      className
    )}>
      <AvatarFallback className={cn(
        "bg-primary/10 text-primary font-medium",
        highlight && "bg-primary/20"
      )}>
        {initials}
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
