import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router";
import { 
  Brain, 
  Zap, 
  Target, 
  Users, 
  ArrowRight, 
  ChevronDown,
  BarChart3,
  Cpu,
  Trophy
} from "lucide-react";

export default function Landing() {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      navigate("/auth");
    }
  };

  const features = [
    {
      icon: <Brain className="h-8 w-8" />,
      title: "Neural Network Evaluation",
      description: "Advanced AI model trained on millions of chess positions for accurate evaluation"
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Instant Analysis",
      description: "Get position evaluations in milliseconds with our optimized inference engine"
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: "Precise Scoring",
      description: "Detailed numerical scores showing who's ahead and by how much"
    },
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: "Analysis History",
      description: "Track your analyzed positions and see your evaluation patterns over time"
    }
  ];

  const stats = [
    { label: "Positions Analyzed", value: "1M+", icon: <Cpu className="h-5 w-5" /> },
    { label: "Active Users", value: "10K+", icon: <Users className="h-5 w-5" /> },
    { label: "Accuracy Rate", value: "95%", icon: <Target className="h-5 w-5" /> },
    { label: "Response Time", value: "<100ms", icon: <Zap className="h-5 w-5" /> }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-8"
          >
            {/* Logo and Badge */}
            <div className="flex flex-col items-center space-y-4">
              <motion.img
                src="/logo.svg"
                alt="Chess AI"
                className="h-16 w-16"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              />
              <Badge variant="outline" className="px-4 py-1">
                <Trophy className="h-3 w-3 mr-1" />
                Powered by Neural Networks
              </Badge>
            </div>

            {/* Main Heading */}
            <div className="space-y-6">
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
                Chess AI
                <span className="block text-primary">Evaluator</span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Analyze any chess position instantly with our advanced neural network. 
                Get precise evaluations, track your analysis history, and improve your game.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                onClick={handleGetStarted}
                disabled={isLoading}
                className="px-8 py-6 text-lg"
              >
                {isAuthenticated ? "Go to Dashboard" : "Get Started"}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-6 text-lg"
              >
                Learn More
                <ChevronDown className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </motion.div>

          {/* Hero Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mt-20 flex justify-center"
          >
            <Card className="border-2 shadow-2xl">
              <CardContent className="p-8">
                <div className="grid grid-cols-8 gap-1 border-4 border-gray-800 rounded-lg overflow-hidden">
                  {Array.from({ length: 64 }).map((_, i) => {
                    const row = Math.floor(i / 8);
                    const col = i % 8;
                    const isLight = (row + col) % 2 === 0;
                    return (
                      <div
                        key={i}
                        className={`
                          w-8 h-8 flex items-center justify-center text-lg
                          ${isLight ? 'bg-amber-100' : 'bg-amber-800'}
                        `}
                      >
                        {/* Sample chess pieces for visual */}
                        {i === 0 && '♜'}
                        {i === 7 && '♜'}
                        {i === 56 && '♖'}
                        {i === 63 && '♖'}
                        {i === 28 && '♕'}
                        {i === 35 && '♔'}
                      </div>
                    );
                  })}
                </div>
                <div className="mt-4 text-center">
                  <Badge variant="outline" className="text-green-600">
                    +0.8 White is better
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center space-y-2"
              >
                <div className="flex justify-center text-primary">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center space-y-4 mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              Powerful Features
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to analyze chess positions like a grandmaster
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <Card className="h-full border-2 hover:shadow-lg transition-shadow">
                  <CardContent className="p-8 space-y-4">
                    <div className="text-primary">
                      {feature.icon}
                    </div>
                    <h3 className="text-2xl font-bold tracking-tight">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              Ready to Analyze?
            </h2>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Join thousands of chess players using AI to improve their game. 
              Start analyzing positions today.
            </p>
          </motion.div>

          <Button
            size="lg"
            variant="secondary"
            onClick={handleGetStarted}
            disabled={isLoading}
            className="px-8 py-6 text-lg"
          >
            {isAuthenticated ? "Go to Dashboard" : "Start Analyzing"}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-3">
              <img src="/logo.svg" alt="Chess AI" className="h-6 w-6" />
              <span className="font-bold">Chess AI Evaluator</span>
            </div>
            <div className="text-sm text-muted-foreground">
              Powered by{" "}
              <a
                href="https://vly.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-primary transition-colors"
              >
                vly.ai
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}