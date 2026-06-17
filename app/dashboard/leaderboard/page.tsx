"use client";

import { useEffect, useState } from "react";
import { 
  Trophy, 
  Medal, 
  Users, 
  Target, 
  Award, 
  Search, 
  ArrowUpRight,
  TrendingUp
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbPage, 
  BreadcrumbSeparator 
} from "@/components/ui/breadcrumb";
import { Input } from "@/components/ui/input";

interface LeaderboardUser {
  user_id: string;
  name: string;
  email: string;
  total_score: number;
  total_possible: number;
  quizzes_taken: number;
  score_percentage: number;
  rank: number;
}

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/dashboard/leaderboard");
      if (response.ok) {
        const data = await response.json();
        setLeaderboard(data);
      }
    } catch (error) {
      console.error("Failed to fetch leaderboard:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredLeaderboard = leaderboard.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const topThree = leaderboard.slice(0, 3);
  const remaining = filteredLeaderboard.slice(topThree.length);

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return "text-yellow-500";
      case 2: return "text-gray-400";
      case 3: return "text-orange-600";
      default: return "text-muted-foreground";
    }
  };

  const getRankBg = (rank: number) => {
    switch (rank) {
      case 1: return "bg-yellow-500/10 border-yellow-500/20";
      case 2: return "bg-gray-400/10 border-gray-400/20";
      case 3: return "bg-orange-600/10 border-orange-600/20";
      default: return "bg-muted/30 border-border/40";
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Global Leaderboard</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Leaderboard</h1>
          <p className="text-muted-foreground mt-1">
            Top performers across all public quizzes on Qwizzed
          </p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search users..." 
            className="pl-9 bg-card/50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-48 rounded-2xl border border-border/40 bg-card/50 animate-pulse" />
            ))}
          </div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 rounded-xl border border-border/40 bg-card/50 animate-pulse" />
            ))}
          </div>
        </div>
      ) : leaderboard.length > 0 ? (
        <div className="space-y-12">
          {/* Top 3 Podium */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end pt-4">
            {/* Rank 2 */}
            {topThree[1] && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className={cn(
                  "relative order-2 md:order-1 p-6 rounded-2xl border text-center transition-all hover:scale-[1.02]",
                  getRankBg(2)
                )}
              >
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-background px-3 py-1 rounded-full border border-border text-xs font-bold text-gray-400">
                  RANK #2
                </div>
                <div className="flex flex-col items-center gap-3">
                  <div className="p-3 rounded-full bg-gray-400/10">
                    <Medal className="h-8 w-8 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg truncate w-full max-w-[200px]">{topThree[1].name}</h3>
                    <p className="text-xs text-muted-foreground">{topThree[1].email}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 w-full pt-2">
                    <div className="text-center">
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Points</p>
                      <p className="font-bold">{topThree[1].total_score}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Accuracy</p>
                      <p className="font-bold">{topThree[1].score_percentage}%</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Rank 1 */}
            {topThree[0] && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className={cn(
                  "relative order-1 md:order-2 p-8 rounded-2xl border text-center shadow-lg shadow-yellow-500/5 transition-all hover:scale-[1.02] bg-gradient-to-b from-yellow-500/10 to-transparent",
                  getRankBg(1)
                )}
              >
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-background px-4 py-1.5 rounded-full border border-yellow-500/30 text-sm font-bold text-yellow-500 shadow-sm">
                  CHAMPION
                </div>
                <div className="flex flex-col items-center gap-4">
                  <div className="p-4 rounded-full bg-yellow-500/20 ring-4 ring-yellow-500/10">
                    <Trophy className="h-12 w-12 text-yellow-500" />
                  </div>
                  <div>
                    <h3 className="font-black text-2xl truncate w-full max-w-[240px]">{topThree[0].name}</h3>
                    <p className="text-xs text-muted-foreground">{topThree[0].email}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-8 w-full pt-2">
                    <div className="text-center">
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Total Score</p>
                      <p className="text-2xl font-black text-yellow-500">{topThree[0].total_score}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Accuracy</p>
                      <p className="text-2xl font-black text-yellow-500">{topThree[0].score_percentage}%</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Rank 3 */}
            {topThree[2] && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className={cn(
                  "relative order-3 p-6 rounded-2xl border text-center transition-all hover:scale-[1.02]",
                  getRankBg(3)
                )}
              >
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-background px-3 py-1 rounded-full border border-border text-xs font-bold text-orange-600">
                  RANK #3
                </div>
                <div className="flex flex-col items-center gap-3">
                  <div className="p-3 rounded-full bg-orange-600/10">
                    <Medal className="h-8 w-8 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg truncate w-full max-w-[200px]">{topThree[2].name}</h3>
                    <p className="text-xs text-muted-foreground">{topThree[2].email}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 w-full pt-2">
                    <div className="text-center">
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Points</p>
                      <p className="font-bold">{topThree[2].total_score}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Accuracy</p>
                      <p className="font-bold">{topThree[2].score_percentage}%</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Table List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-6 text-xs font-bold uppercase tracking-widest text-muted-foreground/60">
              <div className="flex items-center gap-4 flex-1">
                <span className="w-10 text-center">Rank</span>
                <span>User</span>
              </div>
              <div className="flex items-center gap-12">
                <span className="w-20 text-center">Quizzes</span>
                <span className="w-24 text-center">Score</span>
                <span className="w-20 text-right">Accuracy</span>
              </div>
            </div>

            <div className="space-y-2">
              <AnimatePresence mode="popLayout">
                {remaining.map((user, index) => (
                  <motion.div
                    key={user.user_id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="group flex items-center justify-between gap-4 p-4 px-6 rounded-xl border border-border/40 bg-card/50 hover:bg-card hover:border-border/80 transition-all cursor-default"
                  >
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="w-10 flex justify-center font-black text-muted-foreground/40 group-hover:text-foreground transition-colors">
                        #{user.rank}
                      </div>
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold flex-shrink-0">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-foreground truncate">{user.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-12 text-sm">
                      <div className="w-20 flex flex-col items-center gap-0.5">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">Quizzes</span>
                        <span className="font-bold">{user.quizzes_taken}</span>
                      </div>
                      <div className="w-24 flex flex-col items-center gap-0.5">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">Total</span>
                        <span className="font-bold text-primary">{user.total_score}</span>
                      </div>
                      <div className="w-20 flex flex-col items-end gap-0.5">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">Accuracy</span>
                        <div className="flex items-center gap-1.5">
                          <span className={cn(
                            "font-bold",
                            user.score_percentage >= 80 ? "text-emerald-500" :
                            user.score_percentage >= 60 ? "text-amber-500" : "text-red-500"
                          )}>
                            {user.score_percentage}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {remaining.length === 0 && searchQuery && (
                <div className="py-20 text-center rounded-2xl border border-dashed border-border/60">
                  <Users className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
                  <p className="text-muted-foreground font-medium">No users found matching "{searchQuery}"</p>
                  <button 
                    onClick={() => setSearchQuery("")}
                    className="mt-2 text-sm text-primary font-bold hover:underline"
                  >
                    Clear search
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="py-32 text-center rounded-2xl border border-dashed border-border/60 bg-card/30">
          <Trophy className="h-16 w-16 text-muted-foreground/20 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-foreground">No data available</h2>
          <p className="text-muted-foreground max-w-xs mx-auto mt-2">
            The leaderboard is currently empty. Complete some quizzes to be the first one here!
          </p>
        </div>
      )}
    </div>
  );
}
