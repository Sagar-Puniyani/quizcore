"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { History, ChevronRight } from "lucide-react";

type Props = {};

const HistoryCard = (props: Props) => {
  const router = useRouter();
  return (
    <Card
      className="relative overflow-hidden transition-all duration-300 hover:shadow-xl group"
      onClick={() => {
        router.push("/history");
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/10 to-teal-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <div className="space-y-1">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            History
          </CardTitle>
          <p className="text-sm text-gray-500 dark:text-gray-400">Your quiz journey</p>
        </div>
        <div className="relative">
          <div className="p-2 rounded-xl bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/20 dark:to-teal-900/20">
            <History className="w-8 h-8 text-emerald-600 dark:text-emerald-400" strokeWidth={2} />
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-6">
        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
          Track your progress and review your past quiz attempts. See how far you've come!
        </p>
        <div className="mt-4 flex items-center text-emerald-600 dark:text-emerald-400 font-medium text-sm group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
          View History
          <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
        </div>
      </CardContent>
    </Card>
  );
};

export default HistoryCard;
