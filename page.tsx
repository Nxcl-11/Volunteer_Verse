
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from "react"

export default async function Page() {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    const {data: todos} = await supabase.from('todos').select()

    return (
        <ul>
            {todos?.map((todo: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>>
                | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string
                | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined) => (
                <li>{todo}</li>
            ))}
        </ul>
    )
}
