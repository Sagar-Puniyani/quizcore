import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import WordCloud from "../WordCloud";
import { prisma } from "@/lib/db";
import { Flame } from "lucide-react";

type Props = {};

const HotTopicsCard = async (props: Props) => {
  const topics = await prisma.topic_count.findMany({});
  const formattedTopics = topics.map((topic) => {
    return {
      text: topic.topic,
      value: topic.count,
    };
  });
  return (
    <Card className="col-span-4 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-orange-600/5 via-amber-600/5 to-yellow-600/5" />
      <CardHeader className="relative">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
              Hot Topics
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-300">
              Discover trending quiz topics and challenge yourself
            </CardDescription>
          </div>
          <div className="p-2 rounded-xl bg-gradient-to-r from-orange-100 to-amber-100 dark:from-orange-900/20 dark:to-amber-900/20">
            <Flame className="w-6 h-6 text-orange-600 dark:text-orange-400" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="pl-2 relative">
        <div className="bg-gradient-to-br from-white/40 via-white/60 to-white/40 dark:from-gray-900/40 dark:via-gray-900/60 dark:to-gray-900/40 rounded-xl p-4">
          <WordCloud formattedTopics={formattedTopics} />
        </div>
      </CardContent>
    </Card>
  );
};

export default HotTopicsCard;
