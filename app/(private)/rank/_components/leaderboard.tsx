"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AnimatePresence } from "framer-motion";
import { Medal } from "lucide-react";
import LeaderItem from "./leader-item";
import { User } from "../page";

export default function Leaderboard({ users }: { users: (User & { rank: number })[] }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Medal className="w-5 h-5" />
          <CardTitle>Ranking</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[480px] pr-3">
          <div className="flex flex-col gap-1">
            <AnimatePresence>
              {users.map((u) => (
                <LeaderItem key={u.id} user={u} />
              ))}
            </AnimatePresence>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
