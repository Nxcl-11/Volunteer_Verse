import { NextResponse } from "next/server"
//Header
// Mock data
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

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = Number.parseInt(params.id)
  const opportunity = opportunities.find((opp) => opp.id === id)

  if (!opportunity) {
    return NextResponse.json({ error: "Opportunity not found" }, { status: 404 })
  }

  return NextResponse.json(opportunity)
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const id = Number.parseInt(params.id)
  const body = await request.json()

  const index = opportunities.findIndex((opp) => opp.id === id)

  if (index === -1) {
    return NextResponse.json({ error: "Opportunity not found" }, { status: 404 })
  }

  opportunities[index] = { ...opportunities[index], ...body }

  return NextResponse.json(opportunities[index])
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const id = Number.parseInt(params.id)

  const index = opportunities.findIndex((opp) => opp.id === id)

  if (index === -1) {
    return NextResponse.json({ error: "Opportunity not found" }, { status: 404 })
  }

  opportunities.splice(index, 1)

  return NextResponse.json({ message: "Opportunity deleted successfully" })
}
