import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { AuthUser } from '@/types/auth'

export function useAuth() {
    const [user, setUser] = useState<AuthUser | null>(null)
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        // Get initial session
        const getInitialSession = async () => {
            try {
                const { data: { session }, error } = await supabase.auth.getSession()
                if (session?.user) {
                    setUser({
                        id: session.user.id,
                        email: session.user.email!,
                        user_metadata: session.user.user_metadata
                    })
                }
            } catch (error) {
                console.error('Error getting session:', error)
            } finally {
                setLoading(false)
            }
        }

        getInitialSession()

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                if (session?.user) {
                    setUser({
                        id: session.user.id,
                        email: session.user.email!,
                        user_metadata: session.user.user_metadata
                    })
                } else {
                    setUser(null)
                }
                setLoading(false)
            }
        )

        return () => subscription.unsubscribe()
    }, [supabase.auth])

    return { user, loading }
}
