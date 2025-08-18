// app/organizer/opportunities/new/page.tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

type OpportunityForm = {
    title: string
    description: string
    location: string
    startDate: string
    durationDays: number
    maxVolunteers: number
    categories: string
    imageUrl?: string
}

export default function NewOpportunityPage() {
    const router = useRouter()
    const { toast } = useToast()
    const [loading, setLoading] = useState(false)
    const [form, setForm] = useState<OpportunityForm>({
        title: "",
        description: "",
        location: "",
        startDate: "",
        durationDays: 1,
        maxVolunteers: 10,
        categories: "",
        imageUrl: "",
    })

    const onChange =
        (k: keyof OpportunityForm) =>
            (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                const v = e.target.type === "number" ? Number(e.target.value) : e.target.value
                setForm((p) => ({ ...p, [k]: v as any }))
            }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!form.title || !form.description || !form.location || !form.startDate) {
            toast({ title: "Missing fields", description: "Please fill all required fields." })
            return
        }
        try {
            setLoading(true)
            const res = await fetch("/api/opportunities", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...form,
                    categories: form.categories.split(",").map((s) => s.trim()).join(","), // tidy up
                }),
            })
            if (!res.ok) throw new Error(await res.text())
            const created = await res.json()
            toast({ title: "Created", description: `${created.title} is now live.` })
            router.push("/organizer/opportunities") // go back to list page
            router.refresh()
        } catch (err: any) {
            toast({ title: "Failed to create", description: err?.message ?? "Unknown error" })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-3xl mx-auto p-6">
            <Card>
                <CardHeader>
                    <CardTitle>Create New Opportunity</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="title">Title *</Label>
                                <Input id="title" value={form.title} onChange={onChange("title")} placeholder="Esports Volunteer" />
                            </div>
                            <div>
                                <Label htmlFor="location">Location *</Label>
                                <Input id="location" value={form.location} onChange={onChange("location")} placeholder="Phnom Penh" />
                            </div>
                            <div>
                                <Label htmlFor="startDate">Start Date *</Label>
                                <Input id="startDate" type="date" value={form.startDate} onChange={onChange("startDate")} />
                            </div>
                            <div>
                                <Label htmlFor="durationDays">Duration (days)</Label>
                                <Input id="durationDays" type="number" min={1} value={form.durationDays} onChange={onChange("durationDays")} />
                            </div>
                            <div>
                                <Label htmlFor="maxVolunteers">Max Volunteers</Label>
                                <Input id="maxVolunteers" type="number" min={1} value={form.maxVolunteers} onChange={onChange("maxVolunteers")} />
                            </div>
                            <div>
                                <Label htmlFor="imageUrl">Image URL (optional)</Label>
                                <Input id="imageUrl" value={form.imageUrl} onChange={onChange("imageUrl")} placeholder="https://…" />
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="categories">Categories (comma-separated)</Label>
                            <Input id="categories" value={form.categories} onChange={onChange("categories")} placeholder="Teamwork, CS2 player" />
                        </div>

                        <div>
                            <Label htmlFor="description">Description *</Label>
                            <Textarea
                                id="description"
                                value={form.description}
                                onChange={onChange("description")}
                                rows={6}
                                placeholder="Describe the opportunity, tasks, schedule, and requirements."
                            />
                        </div>

                        <div className="flex justify-end gap-2">
                            <Button type="button" variant="outline" onClick={() => router.back()}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={loading}>
                                {loading ? "Creating…" : "Create"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
