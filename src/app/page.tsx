import SignInButton from "@/components/SignInButton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { ArrowRight, Brain, Sparkles, Target } from "lucide-react";

export default async function Home() {
  const session = await getServerSession();
  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center space-y-12 px-4 py-16 text-center bg-gradient-to-b from-background to-muted">
        <div className="max-w-3xl space-y-6">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-primary to-pink-500 bg-clip-text text-transparent animate-gradient">
            Master Your Knowledge with AI-Powered Quizzes
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Transform your learning experience with personalized quizzes generated by AI. 
            Perfect for students, educators, and lifelong learners.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <SignInButton text="Get Started for Free" />
            <a href="#features" className="group flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
              Learn More <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-muted/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose QuizCore?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Brain className="w-10 h-10 text-primary" />}
              title="AI-Powered Generation"
              description="Our advanced AI creates tailored quizzes based on your specific needs and learning objectives."
            />
            <FeatureCard 
              icon={<Target className="w-10 h-10 text-primary" />}
              title="Personalized Learning"
              description="Adapt to your learning pace with customized difficulty levels and topics."
            />
            <FeatureCard 
              icon={<Sparkles className="w-10 h-10 text-primary" />}
              title="Instant Feedback"
              description="Get immediate insights on your performance and areas for improvement."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-primary/5">
        <Card className="max-w-xl mx-auto border-2 border-primary/20">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Ready to Boost Your Learning?</CardTitle>
            <CardDescription>
              Join thousands of learners who are already using QuizCore to enhance their knowledge.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <SignInButton text="Start Learning Now" />
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { 
  icon: React.ReactNode; 
  title: string; 
  description: string 
}) {
  return (
    <Card className="group hover:border-primary/50 transition-colors">
      <CardHeader>
        <div className="mb-2">{icon}</div>
        <CardTitle className="text-xl group-hover:text-primary transition-colors">
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
    </Card>
  );
}
