"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Github, HelpCircle, Youtube } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

type Props = {};

const DetailsDialog = (props: Props) => {
  return (
    <Dialog>
      <DialogTrigger>
        <span className="flex items-center px-3 py-2 text-white transition-all rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 shadow-lg hover:shadow-xl">
          <span className="mr-2 font-medium">About Quizcore</span>
          <HelpCircle className="w-4 h-4" />
        </span>
      </DialogTrigger>
      <DialogContent className="w-[90vw] max-w-[800px] bg-white/95 backdrop-blur-sm">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
            Welcome to Quizcore!
          </DialogTitle>
          <DialogDescription>
            <div className="mt-6 space-y-6">
              <p className="text-lg leading-relaxed text-gray-700">
                Are you tired of mundane and repetitive quizzes? Say goodbye to
                the ordinary and embrace the extraordinary with Quizcore! Our
                platform is revolutionizing the quiz and trivia experience by
                harnessing the immense potential of artificial intelligence.
              </p>
              
              <div className="p-6 rounded-xl bg-gradient-to-r from-slate-50 to-gray-50 border border-gray-100 shadow-sm">
                <h4 className="text-xl font-semibold text-gray-900 mb-4">Built with Modern Tech Stack</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { name: "Planet Scale", img: "/planetscale.png", size: 35 },
                    { name: "Next.js", img: "/nextjs.png", size: 35 },
                    { name: "Tailwind", img: "/tailwind.png", size: 35 },
                    { name: "NextAuth", img: "/nextauth.png", size: 30 },
                    { name: "OpenAI", img: "/openai.png", size: 30 },
                    { name: "React Query", img: "/react-query.png", size: 30 },
                    { name: "Prisma", img: "/prisma.png", size: 30 },
                    { name: "TypeScript", img: "/typescript.png", size: 30 },
                  ].map((tech) => (
                    <div key={tech.name} 
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-white transition-colors duration-200 group">
                      <div className="relative">
                        <Image
                          alt={tech.name.toLowerCase()}
                          src={tech.img}
                          width={tech.size}
                          height={tech.size}
                          className="group-hover:scale-110 transition-transform duration-200"
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                        {tech.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default DetailsDialog;
