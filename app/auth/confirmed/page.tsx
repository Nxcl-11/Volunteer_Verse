"use client";

import Link from "next/link";
import { CheckCircle, ArrowRight, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Confirmed() {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
                <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-6" />
                
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    Email Confirmed! 🎉
                </h1>
                
                <p className="text-gray-600 mb-8 text-lg">
                    Your account has been successfully activated. You can now sign in and access your dashboard.
                </p>
                
                <div className="space-y-4">
                    <Link href="/login">
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                            <ArrowRight className="w-4 h-4 mr-2" />
                            Sign In Now
                        </Button>
                    </Link>
                    
                    <Link href="/">
                        <Button variant="outline" className="w-full">
                            <Home className="w-4 h-4 mr-2" />
                            Back to Home
                        </Button>
                    </Link>
                </div>
                
                <div className="mt-8 pt-6 border-t border-gray-200">
                    <p className="text-sm text-gray-500">
                        Having trouble?{" "}
                        <Link href="/contact" className="text-blue-600 hover:text-blue-800 underline">
                            Contact Support
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
