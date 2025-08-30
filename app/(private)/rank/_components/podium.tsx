import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy } from "lucide-react";
import PodiumPlace from "./podium-place";
import { User } from "../page";

export default function Podium({ top3 }: { top3: (User & { rank: number })[] }) {
  const first = top3.find((u) => u.rank === 1);
  // If there are ties, ensure we still show three slots (may skip if less than 3 unique ranks)
  const second = top3.find((u) => u !== first);
  const third = top3.find((u) => u !== first && u !== second);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5" />
          <CardTitle>Pódio</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 items-end gap-4 pt-2">
          <PodiumPlace user={second} size="md" height={160} position="left" />
          <PodiumPlace user={first} size="lg" height={200} position="center" />
          <PodiumPlace user={third} size="md" height={140} position="right" />
        </div>
      </CardContent>
    </Card>
  );
}