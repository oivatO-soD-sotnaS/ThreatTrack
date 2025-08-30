"use client"

import { Separator } from "@radix-ui/react-separator"
import React from "react"
import Toolbar from "./toolbar";
import { User } from "../page";
import Podium from "./podium";
import Leaderboard from "./leaderboard";

function rankUsers(users: User[]) {
  // Sort by score desc, then name asc for stability
  const sorted = [...users].sort((a, b) => (b.score - a.score) || a.name.localeCompare(b.name));
  // Assign ranks with ties: 1,2,2,4
  let lastScore: number | null = null;
  let lastRank = 0;
  let index = 0;
  const withRank = sorted.map((u) => {
    index += 1;
    if (lastScore === null || u.score < lastScore) {
      lastRank = index;
      lastScore = u.score;
    }
    return { ...u, rank: lastRank } as User & { rank: number };
  });
  return withRank;
}



export default function UserRankingPage({ users }: { users: User[] }) {
  const [query, setQuery] = React.useState("")
  const [timeframe, setTimeframe] = React.useState("all")

  const ranked = React.useMemo(() => rankUsers(users), [users])

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    return ranked.filter((u) => (q ? u.name.toLowerCase().includes(q) : true))
  }, [ranked, query])

  const top3 = filtered.filter((u) => u.rank <= 3).slice(0, 3)
  const others = filtered.filter((u) => !top3.includes(u))

  return (
    <div className="min-h-[60vh] w-full px-4 py-6 md:px-8">
      <div className="mx-auto max-w-6xl">
        {/* header */}
        <Toolbar
          query={query}
          setQuery={setQuery}
          timeframe={timeframe}
          setTimeframe={setTimeframe}
          onRefresh={() => window.location.reload()}
        />
        <Separator className="my-4" />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="md:col-span-1">
            <Podium top3={top3} />
          </div>
          <div className="md:col-span-2">
            <Leaderboard users={[...top3, ...others]} />
          </div>
        </div>
      </div>
    </div>
  )
}