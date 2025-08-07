import { NextResponse } from "next/server"

// Mock database
const opportunities = [
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
    date: "11/9/2025",
    totalVolunteers: 127,
    maxVolunteers: 150,
    types: ["Teamwork", "Community"],
    createdAt: new Date().toISOString(),
  },
]

export async function GET() {
  return NextResponse.json(opportunities)
}

export async function POST(request: Request) {
  const body = await request.json()

  const newOpportunity = {
    id: opportunities.length + 1,
    ...body,
    totalVolunteers: 0,
    createdAt: new Date().toISOString(),
  }

  opportunities.push(newOpportunity)

  return NextResponse.json(newOpportunity, { status: 201 })
}
