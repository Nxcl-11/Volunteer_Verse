// API utility functions
export async function fetchOpportunities() {
  const response = await fetch("/api/opportunities")
  if (!response.ok) {
    throw new Error("Failed to fetch opportunities")
  }
  return response.json()
}

export async function createOpportunity(data: any) {
  const response = await fetch("/api/opportunities", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    throw new Error("Failed to create opportunity")
  }
  return response.json()
}

export async function updateOpportunity(id: number, data: any) {
  const response = await fetch(`/api/opportunities/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    throw new Error("Failed to update opportunity")
  }
  return response.json()
}

export async function deleteOpportunity(id: number) {
  const response = await fetch(`/api/opportunities/${id}`, {
    method: "DELETE",
  })
  if (!response.ok) {
    throw new Error("Failed to delete opportunity")
  }
  return response.json()
}

export async function fetchApplications() {
  const response = await fetch("/api/applications")
  if (!response.ok) {
    throw new Error("Failed to fetch applications")
  }
  return response.json()
}

export async function createApplication(data: any) {
  const response = await fetch("/api/applications", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    throw new Error("Failed to create application")
  }
  return response.json()
}

export async function fetchStats() {
  const response = await fetch("/api/stats")
  if (!response.ok) {
    throw new Error("Failed to fetch stats")
  }
  return response.json()
}
