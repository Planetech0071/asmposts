'use client';

import { Users, Shield, FileText, Monitor, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppStore } from '@/lib/store';
import { LoginForm } from './login-form';

interface HomeViewProps {
  onNavigate: (view: 'home' | 'create' | 'admin' | 'posts') => void;
}

export function HomeView({ onNavigate }: HomeViewProps) {
  const { isAuthenticated, currentUser } = useAppStore();

  const features = [
    {
      icon: FileText,
      title: 'Create Posts',
      description: 'Students can create engaging posts about clubs, events, sports, and more with easy-to-use forms.'
    },
    {
      icon: Shield,
      title: 'Admin Review',
      description: 'All posts are reviewed by administrators before publishing to ensure quality and appropriateness.'
    },
    {
      icon: Monitor,
      title: 'TV Display PDFs',
      description: 'Generate beautiful PDF versions in landscape and portrait formats for school TV screens.'
    },
    {
      icon: Users,
      title: 'Community Connection',
      description: 'Connect students on campus with parents and community members off campus.'
    }
  ];

  const workflow = [
    { step: 1, title: 'Student Creates Post', description: 'Add title, description, tags, and images' },
    { step: 2, title: 'Admin Reviews', description: 'Post is sent for approval with preview' },
    { step: 3, title: 'Post Published', description: 'Approved posts appear on the website' },
    { step: 4, title: 'TV Display Ready', description: 'Download PDF for school screens' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-balance">
            ASM Student Posts
          </h1>
          <p className="text-lg sm:text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto text-pretty">
            Connecting the American School of Milan community through student-created content. 
            Share news, events, and achievements with families on and off campus.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              size="lg" 
              variant="secondary"
              onClick={() => onNavigate('posts')}
            >
              Browse Posts
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            {!isAuthenticated && (
              <Button 
                size="lg" 
                variant="outline" 
                className="bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
              >
                <a href="#login">Sign In</a>
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Core Values Banner */}
      <section className="bg-secondary py-8 px-4 border-y border-border">
        <div className="max-w-6xl mx-auto flex flex-wrap justify-center gap-8 text-center">
          {['Respect', 'Curiosity', 'Courage', 'Integrity', 'Kindness'].map((value) => (
            <div key={value} className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <CheckCircle className="h-4 w-4 text-primary" />
              {value}
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Platform Features</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A complete solution for managing student-generated content with approval workflows and display options.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <Card key={feature.title} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="py-16 px-4 bg-secondary/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">How It Works</h2>
            <p className="text-muted-foreground">
              From creation to publication - a simple and secure workflow
            </p>
          </div>
          
          <div className="relative">
            {/* Connection line */}
            <div className="hidden md:block absolute top-8 left-1/2 -translate-x-1/2 w-3/4 h-0.5 bg-border" />
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {workflow.map((item) => (
                <div key={item.step} className="text-center relative">
                  <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold relative z-10">
                    {item.step}
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Login Section */}
      <section id="login" className="py-16 px-4 bg-background">
        <div className="max-w-6xl mx-auto">
          {isAuthenticated && currentUser ? (
            <Card className="max-w-md mx-auto text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-success" />
                </div>
                <CardTitle>Welcome, {currentUser.fullName}!</CardTitle>
                <CardDescription>
                  You are logged in as {currentUser.role === 'admin' ? 'an administrator' : 'a student'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {currentUser.role === 'student' ? (
                  <Button className="w-full" onClick={() => onNavigate('create')}>
                    Create New Post
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button className="w-full" onClick={() => onNavigate('admin')}>
                    Open Admin Panel
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
                <Button variant="outline" className="w-full bg-transparent" onClick={() => onNavigate('posts')}>
                  Browse All Posts
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-4">Get Started</h2>
                <p className="text-muted-foreground mb-6">
                  Sign in to create posts, review submissions, or manage the platform. 
                  Each user has a unique password for secure access.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                      <Users className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">Students</h4>
                      <p className="text-sm text-muted-foreground">Create and submit posts for review</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                      <Shield className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">Administrators</h4>
                      <p className="text-sm text-muted-foreground">Review, approve, and manage all posts</p>
                    </div>
                  </div>
                </div>
              </div>
              <LoginForm onSuccess={() => {}} />
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-8 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-10 h-10 bg-primary-foreground rounded-full flex items-center justify-center">
              <span className="text-primary font-bold text-sm">ASM</span>
            </div>
            <div className="text-left">
              <p className="font-semibold">American School of Milan</p>
              <p className="text-xs text-primary-foreground/80">Student Posts Platform</p>
            </div>
          </div>
          <p className="text-sm text-primary-foreground/70 mb-2">
            Curious Learners - Critical Thinkers - Global Citizens
          </p>
          <p className="text-xs text-primary-foreground/50">
            CAS Project Demo - IB Programme
          </p>
        </div>
      </footer>
    </div>
  );
}
