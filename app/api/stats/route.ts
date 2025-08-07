import { NextResponse } from "next/server"

export async function GET() {
  // Mock statistics
  const stats = {
    totalVolunteers: 404,
    totalOpportunities: 3,
    activeEvents: 2,
    completedEvents: 1,
  }

  return NextResponse.json(stats)
}
