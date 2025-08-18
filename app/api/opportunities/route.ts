// app/api/opportunities/route.ts
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

type Opportunity = {
    id: number
    title: string
    description: string
    image: string
    location: string
    duration: string
    date: string
    totalVolunteers: number
    maxVolunteers: number
    types: string[]
    createdAt: string
}

// --- in-memory mock DB ---
const opportunities: Opportunity[] = [
    {
        id: 1,
        title: "Esports Volunteer",
        description: "Help organize the Counter Strike 2 tournament",
        image: "/placeholder.svg?height=200&width=300",
        location: "Phnom Penh",
        duration: "3 Days",
        date: "11/07/2025",
        totalVolunteers: 20,
        maxVolunteers: 30,
        types: ["Teamwork", "CS2 player"],
        createdAt: new Date().toISOString(),
    },
    {
        id: 2,
        title: "Hospital Event Volunteer",
        description: "Help organize and raise fund to help hospital",
        image: "/placeholder.svg?height=200&width=300",
        location: "Phnom Penh",
        duration: "3 Days",
        date: "11/09/2025",
        totalVolunteers: 127,
        maxVolunteers: 150,
        types: ["Teamwork", "Community"],
        createdAt: new Date().toISOString(),
    },
]

// Normalize incoming body from the form (or existing shape)
function normalize(body: any) {
    const title: string = body.title ?? ""
    const description: string = body.description ?? ""
    const location: string = body.location ?? ""
    const maxVolunteers: number = Number(body.maxVolunteers ?? 10)

    const image: string = body.imageUrl || body.image || "/placeholder.svg?height=200&width=300"
    const date: string = body.startDate || body.date || new Date().toISOString().slice(0, 10)
    const duration: string =
        body.durationDays != null ? `${Number(body.durationDays)} Days` : (body.duration || "1 Day")

    let types: string[] = []
    if (typeof body.categories === "string") {
        types = body.categories.split(",").map((t: string) => t.trim()).filter(Boolean)
    } else if (Array.isArray(body.types)) {
        types = body.types.map((t: any) => String(t))
    }

    return { title, description, location, maxVolunteers, image, date, duration, types }
}

export async function GET() {
    const data = [...opportunities].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    return NextResponse.json(data)
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const n = normalize(body)

        if (!n.title || !n.description || !n.location || !n.date) {
            return NextResponse.json(
                { error: "Missing required fields: title, description, location, date" },
                { status: 400 }
            )
        }

        const newOpportunity: Opportunity = {
            id: opportunities.length + 1,
            title: n.title,
            description: n.description,
            image: n.image,
            location: n.location,
            duration: n.duration,
            date: n.date,
            totalVolunteers: 0,
            maxVolunteers: n.maxVolunteers,
            types: n.types,
            createdAt: new Date().toISOString(),
        }

        opportunities.push(newOpportunity)
        return NextResponse.json(newOpportunity, { status: 201 })
    } catch (err: any) {
        return NextResponse.json({ error: err?.message ?? "Invalid request body" }, { status: 400 })
    }
}
