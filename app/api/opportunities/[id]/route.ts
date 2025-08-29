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
    image: "/1e2cdee8-b1bc-4d0f-8c7f-d54c38ddcaec.jpg",
  },
  {
    id: 2,
    title: "Hospital Volunteer",
    description: "Help clean the hospital",
    location: "Phnom Penh",
    duration: "3 Days",
    dateRange: "11/05/2025 - 13/05/2025",
    volunteers: { current: 20, total: 30 },
    tags: ["Teamwork", "Labor"],
    image: "/2302_q893_006_s_m009_c10_volunteering_flat_infographic.jpg",
  },
  {
    id: 3,
    title: "Ressidents Elderly Volunteer",
    description: "Help the elderly residents of the community",
    location: "Phnom Penh",
    duration: "3 Days",
    dateRange: "11/05/2025 - 13/05/2025",
    volunteers: { current: 20, total: 30 },
    tags: ["Teamwork", "Gaming"],
    image: "/11076533.jpg",
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