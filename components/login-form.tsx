'use client';

import React from "react"

import { useState } from 'react';
import { Eye, EyeOff, KeyRound, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppStore } from '@/lib/store';

interface LoginFormProps {
  onSuccess: () => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAppStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate network delay for demo
    await new Promise(resolve => setTimeout(resolve, 500));

    const success = login(username, password);
    
    if (success) {
      onSuccess();
    } else {
      setError('Invalid username or password. Please try again.');
    }
    
    setIsLoading(false);
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg">
      <CardHeader className="text-center space-y-1">
        <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-primary-foreground font-bold text-xl">ASM</span>
        </div>
        <CardTitle className="text-2xl font-semibold">Welcome Back</CardTitle>
        <CardDescription>
          Sign in to access the Student Posts platform
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-md">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        {/* Demo credentials info */}
        <div className="mt-6 p-4 bg-muted rounded-lg">
          <p className="text-sm font-medium text-foreground mb-2">Demo Credentials</p>
          <div className="space-y-2 text-xs text-muted-foreground">
            <div className="flex justify-between">
              <span className="font-medium">Student:</span>
              <span>student1 / ASMstudent2024!</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Admin:</span>
              <span>admin / ASMadmin2024!</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
