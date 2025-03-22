import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { getAuthSession } from "@/lib/nextauth";
import { redirect } from "next/navigation";
import HistoryComponent from "../HistoryComponent";
import { prisma } from "@/lib/db";
import { Activity, ChevronRight } from "lucide-react";

type Props = {};

const RecentActivityCard = async (props: Props) => {
  const session = await getAuthSession();
  if (!session?.user) {
    return redirect("/");
  }
  const games_count = await prisma.game.count({
    where: {
      userId: session.user.id,
    },
  });
  return (
    <Card className="col-span-4 lg:col-span-3 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-sky-600/5 to-cyan-600/5" />
      <CardHeader className="relative">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-2xl font-bold">
              <Link href="/history" className="bg-gradient-to-r from-blue-600 to-sky-600 bg-clip-text text-transparent hover:from-blue-700 hover:to-sky-700 transition-all flex items-center group">
                Recent Activity
                <ChevronRight className="w-6 h-6 ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </Link>
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-300">
              You've completed {games_count} {games_count === 1 ? 'quiz' : 'quizzes'} - Keep up the great work! 🎯
            </CardDescription>
          </div>
          <div className="p-2 rounded-xl bg-gradient-to-r from-blue-100 to-sky-100 dark:from-blue-900/20 dark:to-sky-900/20">
            <Activity className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="relative">
        <div className="max-h-[580px] overflow-y-auto scrollbar-thin scrollbar-thumb-blue-200 dark:scrollbar-thumb-blue-800 scrollbar-track-transparent pr-4">
          <div className="space-y-4">
            <HistoryComponent limit={10} userId={session.user.id} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivityCard;
