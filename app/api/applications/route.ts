import { NextResponse } from "next/server"
//Header
// Mock data
const applications = [
  {
    id: 1,
    firstName: "Chylong",
    lastName: "Nou",
    sex: "M",
    email: "nou.chylong24@kit.edu.kh",
    country: "Cambodia",
    phone: "099788525",
    volunteerEvent: "Esports Volunteer",
    opportunityId: 1,
    status: "pending",
    appliedAt: new Date().toISOString(),
  },
]

export async function GET() {
  return NextResponse.json(applications)
}

export async function POST(request: Request) {
  const body = await request.json()

  const newApplication = {
    id: applications.length + 1,
    ...body,
    status: "pending",
    appliedAt: new Date().toISOString(),
  }

  applications.push(newApplication)

  return NextResponse.json(newApplication, { status: 201 })
}
