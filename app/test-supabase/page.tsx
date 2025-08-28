"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

export default function TestSupabasePage() {
    const [status, setStatus] = useState<string>("Testing...");
    const [details, setDetails] = useState<string>("");
    const [envVars, setEnvVars] = useState<any>({});

    useEffect(() => {
        const testSupabase = async () => {
            try {
                // Check environment variables
                const env = {
                    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
                    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
                    NODE_ENV: process.env.NODE_ENV,
                };
                setEnvVars(env);

                if (!env.NEXT_PUBLIC_SUPABASE_URL || !env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
                    setStatus("❌ Missing Environment Variables");
                    setDetails("Please check your .env.local file for NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY");
                    return;
                }

                // Test Supabase client creation
                const supabase = createClient();
                setStatus("✅ Supabase client created successfully");

                // Test basic connection
                const { data, error } = await supabase.auth.getSession();
                
                if (error) {
                    setStatus("❌ Connection Error");
                    setDetails(`Error: ${error.message}`);
                    return;
                }

                setStatus("✅ Supabase connection successful");
                setDetails(`Session: ${data.session ? 'Active' : 'None'}`);

                // Test database access (try to query a simple table)
                try {
                    const { data: tableData, error: tableError } = await supabase
                        .from('volunteers')
                        .select('count')
                        .limit(1);
                    
                    if (tableError) {
                        setDetails(prev => prev + `\nDatabase access: ${tableError.message}`);
                    } else {
                        setDetails(prev => prev + `\nDatabase access: ✅ Success`);
                    }
                } catch (dbError) {
                    setDetails(prev => prev + `\nDatabase access: ❌ ${dbError}`);
                }

            } catch (error) {
                setStatus("❌ Test Failed");
                setDetails(`Error: ${error instanceof Error ? error.message : String(error)}`);
            }
        };

        testSupabase();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Supabase Connection Test</h1>
                
                <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">Connection Status</h2>
                    <div className="text-lg font-medium mb-2">{status}</div>
                    <div className="text-sm text-gray-600 whitespace-pre-line">{details}</div>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">Environment Variables</h2>
                    <div className="space-y-2">
                        <div>
                            <span className="font-medium">NEXT_PUBLIC_SUPABASE_URL:</span>
                            <span className={`ml-2 ${envVars.NEXT_PUBLIC_SUPABASE_URL ? 'text-green-600' : 'text-red-600'}`}>
                                {envVars.NEXT_PUBLIC_SUPABASE_URL || 'Not set'}
                            </span>
                        </div>
                        <div>
                            <span className="font-medium">NEXT_PUBLIC_SUPABASE_ANON_KEY:</span>
                            <span className={`ml-2 ${envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'text-green-600' : 'text-red-600'}`}>
                                {envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 
                                    `${envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 20)}...` : 
                                    'Not set'
                                }
                            </span>
                        </div>
                        <div>
                            <span className="font-medium">NODE_ENV:</span>
                            <span className="ml-2 text-blue-600">{envVars.NODE_ENV}</span>
                        </div>
                    </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h2 className="text-xl font-semibold text-blue-900 mb-4">Troubleshooting Steps</h2>
                    <ol className="list-decimal list-inside space-y-2 text-blue-800">
                        <li>Ensure you have a `.env.local` file in your project root</li>
                        <li>Verify your Supabase project URL and anon key are correct</li>
                        <li>Check that your Supabase project is active and not paused</li>
                        <li>Ensure your database tables are created (run the schema from database-schema.sql)</li>
                        <li>Verify your redirect URLs are configured in Supabase Auth settings</li>
                    </ol>
                </div>
            </div>
        </div>
    );
}
