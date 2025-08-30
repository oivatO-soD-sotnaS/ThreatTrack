import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { initials, User } from "../page";
import { Crown, Medal } from "lucide-react";
import { motion } from "framer-motion";

export default function PodiumPlace({ user, size, height, position }: { user: (User & { rank: number }) | undefined; size: "sm" | "md" | "lg"; height: number; position: "left" | "center" | "right"; }) {
  if (!user) return null;
  const isFirst = user.rank === 1;
  const isSecond = user.rank === 2;

  const sizeClasses = {
    sm: "w-14 h-14 text-sm",
    md: "w-16 h-16 text-base",
    lg: "w-20 h-20 text-lg",
  }[size];

  return (
    <motion.div
      layout
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className={`flex flex-col items-center justify-end ${position === "center" ? "order-2" : position === "left" ? "order-1" : "order-3"}`}
      style={{ height }}
    >
      <div className="flex flex-col items-center gap-2">
        <div className="relative">
          <Avatar className={`${sizeClasses} ring-4 ${isFirst ? "ring-yellow-400" : isSecond ? "ring-gray-300" : "ring-amber-700"} shadow-xl`}>
            <AvatarImage src={user.image || ""} alt={user.name} />
            <AvatarFallback>{initials(user.name)}</AvatarFallback>
          </Avatar>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
            {isFirst ? (
              <Crown className="w-6 h-6" />
            ) : (
              <Medal className="w-6 h-6" />
            )}
          </div>
        </div>
        <div className="text-center">
          <p className="font-semibold leading-tight">{user.name}</p>
          <p className="text-sm text-muted-foreground">{user.score.toLocaleString()} pts</p>
        </div>
      </div>
      <div
        className={`mt-4 w-24 rounded-t-2xl ${
          isFirst
            ? "bg-gradient-to-t from-yellow-400/80 to-yellow-300"
            : isSecond
            ? "bg-gradient-to-t from-zinc-300 to-zinc-200"
            : "bg-gradient-to-t from-amber-800/80 to-amber-600"
        } shadow-inner`}
        style={{ height: Math.max(24, height / 3) }}
      />
    </motion.div>
  );
}
