"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { initials, User } from "../page";
import { ArrowUp, Crown, Medal } from "lucide-react";
import { motion } from "framer-motion";

export default function LeaderItem({ user }: { user: User & { rank: number } }) {
  const isTop3 = user.rank <= 3;
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-muted/50"
    >
      <div className="w-8 text-center font-semibold tabular-nums">
        {user.rank}
      </div>
      <Avatar className="w-9 h-9">
        <AvatarImage src={user.image || ""} alt={user.name} />
        <AvatarFallback>{initials(user.name)}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="truncate font-medium leading-tight">{user.name}</p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="tabular-nums">{user.score.toLocaleString()} pts</span>
        </div>
      </div>
      {isTop3 ? (
        <div className="flex items-center gap-1 text-muted-foreground">
          {user.rank === 1 ? <Crown className="w-4 h-4" /> : <Medal className="w-4 h-4" />}
        </div>
      ) : (
        <div className="flex items-center gap-1 text-muted-foreground">
          <ArrowUp className="w-4 h-4" />
        </div>
      )}
    </motion.div>
  );
}