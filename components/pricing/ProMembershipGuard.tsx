"use client";

import { useEffect, useState } from "react";
import { checkProMembership } from "@/lib/actions/stripe.action";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Crown, Lock, ArrowRight } from "lucide-react";
import Link from "next/link";

interface ProMembershipGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const ProMembershipGuard = ({ children, fallback }: ProMembershipGuardProps) => {
  const [isPro, setIsPro] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkMembership = async () => {
      try {
        const result = await checkProMembership();
        if (result.success) {
          setIsPro(result.data?.isPro || false);
        } else {
          setIsPro(false);
        }
      } catch (error) {
        console.error("Error checking membership:", error);
        setIsPro(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkMembership();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isPro) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Crown className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
              Pro Membership Required
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-300">
              Access to our premium job board requires a Pro membership. Unlock advanced features and find your dream job faster.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Lock className="w-5 h-5 text-blue-600" />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Advanced job filters and search
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Lock className="w-5 h-5 text-blue-600" />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Priority support and job alerts
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Lock className="w-5 h-5 text-blue-600" />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Unlimited job applications
                </span>
              </div>
            </div>
            
            <div className="pt-4 space-y-3">
              <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                <Link href="/pricing">
                  <Crown className="w-4 h-4 mr-2" />
                  Upgrade to Pro
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              
              <Button asChild variant="outline" className="w-full">
                <Link href="/">
                  Back to Home
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProMembershipGuard;
