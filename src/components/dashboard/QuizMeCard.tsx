"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { BrainCircuit, ArrowRight } from "lucide-react";

type Props = {};

const QuizMeCard = (props: Props) => {
  const router = useRouter();
  return (
    <Card
      className="relative overflow-hidden transition-all duration-300 hover:shadow-xl group"
      onClick={() => {
        router.push("/quiz");
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-violet-600/10 to-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <div className="space-y-1">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
            Quiz me!
          </CardTitle>
          <p className="text-sm text-gray-500 dark:text-gray-400">Start a new challenge</p>
        </div>
        <div className="relative">
          <div className="p-2 rounded-xl bg-gradient-to-r from-violet-100 to-indigo-100 dark:from-violet-900/20 dark:to-indigo-900/20">
            <BrainCircuit className="w-8 h-8 text-violet-600 dark:text-violet-400" strokeWidth={2} />
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-6">
        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
          Challenge yourself with an AI-powered quiz on any topic of your choice. Test your knowledge and learn something new!
        </p>
        <div className="mt-4 flex items-center text-violet-600 dark:text-violet-400 font-medium text-sm group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          Start Quiz
          <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
        </div>
      </CardContent>
    </Card>
  );
};

export default QuizMeCard;
