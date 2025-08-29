import { NextResponse } from 'next/server'

const opportunities = [
  {
    id: 1,
    title: "Esports Volunteer",
    description: "Help organize the Counter Strike 2 tournament",
    location: "Phnom Penh",
    duration: "3 Days",
    dateRange: "11/05/2025 - 13/05/2025",
    volunteers: { current: 20, total: 30 },
    tags: ["Teamwork", "Gaming"],
    image: "",
  },
  {
    id: 2,
    title: "Esports Volunteer",
    description: "Help organize the Counter Strike 2 tournament",
    location: "Phnom Penh",
    duration: "3 Days",
    dateRange: "11/05/2025 - 13/05/2025",
    volunteers: { current: 20, total: 30 },
    tags: ["Teamwork", "Gaming"],
    image: "",
  },
  {
    id: 3,
    title: "Esports Volunteerzzzzzzzzzzzz",
    description: "Help organize the Counter Strike 2 tournament",
    location: "Phnom Penh",
    duration: "3 Days",
    dateRange: "11/05/2025 - 13/05/2025",
    volunteers: { current: 20, total: 30 },
    tags: ["Teamwork", "Gaming"],
    image: "",
  },
]

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = parseInt(params.id)
  const opportunity = opportunities.find((o) => o.id === id)

  if (opportunity) {
    return NextResponse.json(opportunity)
  } else {
    return NextResponse.json({ error: "Opportunity not found" }, { status: 404 })
  }
}