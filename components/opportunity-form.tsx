"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface OpportunityFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => void
  initialData?: any
}

export function OpportunityForm({ isOpen, onClose, onSubmit, initialData }: OpportunityFormProps) {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    location: initialData?.location || "",
    duration: initialData?.duration || "",
    date: initialData?.date || "",
    maxVolunteers: initialData?.maxVolunteers || "",
    types: initialData?.types?.join(", ") || "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      maxVolunteers: Number.parseInt(formData.maxVolunteers),
      types: formData.types.split(",").map((type: string) => type.trim()),
    })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Opportunity" : "Create New Opportunity"}</DialogTitle>
          <DialogDescription>Fill in the details for the volunteer opportunity.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="duration">Duration</Label>
              <Input
                id="duration"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                placeholder="e.g., 3 Days"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                placeholder="e.g., 11/07/2025"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="maxVolunteers">Max Volunteers</Label>
              <Input
                id="maxVolunteers"
                type="number"
                value={formData.maxVolunteers}
                onChange={(e) => setFormData({ ...formData, maxVolunteers: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="types">Types (comma separated)</Label>
              <Input
                id="types"
                value={formData.types}
                onChange={(e) => setFormData({ ...formData, types: e.target.value })}
                placeholder="e.g., Teamwork, CS2 player"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{initialData ? "Update" : "Create"} Opportunity</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
