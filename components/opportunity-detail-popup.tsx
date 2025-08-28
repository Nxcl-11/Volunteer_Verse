"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, Calendar, Users } from "lucide-react"

interface Opportunity {
    id: string
    title: string
    description: string
    location: string
    duration: string
    dateRange: string
    volunteers: {
        current: number
        total: number
    }
    tags: string[]
}

interface OpportunityDetailPopupProps {
    opportunity: Opportunity | null
    onClose: () => void
    isLoading: boolean
}

export function OpportunityDetailPopup({ opportunity, onClose, isLoading }: OpportunityDetailPopupProps) {
    return (
        <Dialog open={!!opportunity || isLoading} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px]">
                {isLoading ? (
                    <div className="flex items-center justify-center h-48">
                        <p>Loading...</p>
                    </div>
                ) : (
                    opportunity && (
                        <>
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-bold">{opportunity.title}</DialogTitle>
                                <DialogDescription>{opportunity.description}</DialogDescription>
                            </DialogHeader>
                            <div className="py-4 space-y-4">
                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                    <div className="flex items-center gap-1">
                                        <MapPin className="w-4 h-4" />
                                        {opportunity.location}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-4 h-4" />
                                        {opportunity.duration}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Calendar className="w-4 h-4" />
                                        {opportunity.dateRange}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Users className="w-4 h-4" />
                                        Total Volunteers: {opportunity.volunteers.current}/{opportunity.volunteers.total}
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <span className="text-sm font-medium text-gray-700">Skills:</span>
                                    {opportunity.tags.map((tag: string) => (
                                        <Badge key={tag} variant="secondary">
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                            <DialogFooter>
                                <Button onClick={onClose}>Close</Button>
                            </DialogFooter>
                        </>
                    )
                )}
            </DialogContent>
        </Dialog>
    )
}