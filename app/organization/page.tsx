"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import {
    Search,
    Settings,
    Bell,
    Plus,
    MapPin,
    Clock,
    Calendar,
    Users,
    Info,
    Edit as EditIcon,
    Trash2,
    Upload
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { useLogout } from "@/components/ui/logout"
import { useAuth } from "@/hooks/use-auth"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
// ---------- Details (Info) Modal ----------
function DetailsModal({
                          open,
                          onOpenChange,
                          data,
                      }: {
    open: boolean
    onOpenChange: (v: boolean) => void
    data: UIOpportunity | null
}) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl">
                <DialogHeader>
                    <DialogTitle className="text-xl">{data?.title}</DialogTitle>
                    <p className="text-sm text-muted-foreground">{data?.description}</p>
                </DialogHeader>

                {data?.image && (
                    <img
                        src={data.image}
                        alt={data.title}
                        className="w-full max-h-72 object-cover rounded-md border"
                    />
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-700">
                    <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" /> {data?.location}
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" /> {data?.duration}
                    </div>
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {/^\d{4}-\d{2}-\d{2}/.test(data?.date ?? "")
                            ? new Date(String(data?.date)).toLocaleDateString()
                            : data?.date}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">Type:</span>
                    {data?.categories.map((c, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                            {c}
                        </Badge>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    )
}

// ---------- Volunteers Modal ----------
type Applicant = {
    id: number
    firstName: string
    lastName: string
    sex: string
    email: string
    country: string
    phone?: string
    recordedAt: string
}

function VolunteersModal({
                             open,
                             onOpenChange,
                             opportunity,
                         }: {
    open: boolean
    onOpenChange: (v: boolean) => void
    opportunity: UIOpportunity | null
}) {
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState<Applicant[]>([])
    const [settingsOpen, setSettingsOpen] = useState(false)


    useEffect(() => {
        if (!open || !opportunity?.id) return
            ;(async () => {
            setLoading(true)
            try {
                const res = await fetch(`/api/opportunities/${opportunity.id}/applications`, {
                    cache: "no-store",
                })
                setData(await res.json())
            } finally {
                setLoading(false)
            }
        })()
    }, [open, opportunity?.id])

    const total =
        opportunity?.currentVolunteers ?? (Array.isArray(data) ? data.length : 0)

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-lg">
                        Volunteers — {opportunity?.title}
                    </DialogTitle>
                    <div className="text-sm text-muted-foreground">
                        Total : {total}/{opportunity?.maxVolunteers}
                    </div>
                </DialogHeader>

                <div className="border rounded-md overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-gray-50">
                                <TableHead className="w-16">No</TableHead>
                                <TableHead>First name</TableHead>
                                <TableHead>Last name</TableHead>
                                <TableHead className="w-20">Sex</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Country</TableHead>
                                <TableHead>Phone</TableHead>
                                <TableHead className="w-44">Recorder</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center py-6 text-gray-500">
                                        Loading…
                                    </TableCell>
                                </TableRow>
                            ) : data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center py-6 text-gray-500">
                                        No applicants yet.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                data.map((a, idx) => (
                                    <TableRow key={a.id} className="hover:bg-gray-50">
                                        <TableCell className="font-medium">{idx + 1}</TableCell>
                                        <TableCell>{a.firstName}</TableCell>
                                        <TableCell>{a.lastName}</TableCell>
                                        <TableCell>{a.sex}</TableCell>
                                        <TableCell className="text-blue-600">{a.email}</TableCell>
                                        <TableCell>{a.country}</TableCell>
                                        <TableCell>{a.phone ?? "-"}</TableCell>
                                        <TableCell>
                                            {new Date(a.recordedAt).toLocaleDateString(undefined, {
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </DialogContent>
        </Dialog>
    )
}

// ---------- Confirm Delete ----------
function ConfirmDeleteDialog({
                                 open,
                                 onOpenChange,
                                 onConfirm,
                                 title,
                             }: {
    open: boolean
    onOpenChange: (v: boolean) => void
    onConfirm: () => Promise<void> | void
    title?: string
}) {
    const [busy, setBusy] = useState(false)
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Delete opportunity?</DialogTitle>
                </DialogHeader>
                <p className="text-sm text-muted-foreground">
                    {title ? `"${title}"` : "This opportunity"} will be permanently removed. This action
                    cannot be undone.
                </p>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        disabled={busy}
                        onClick={async () => {
                            setBusy(true)
                            await onConfirm()
                            setBusy(false)
                            onOpenChange(false)
                        }}
                    >
                        {busy ? "Deleting…" : "Delete"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}




// ---------- Types ----------
type UIOpportunity = {
    id?: number
    title: string
    description: string
    image?: string
    location: string
    duration: string
    date: string
    currentVolunteers?: number
    maxVolunteers: number
    categories: string[]
}

// server/API shape -> UI shape helper
const toUI = (o: any): UIOpportunity => ({
    id: o.id,
    title: o.title,
    description: o.description,
    image: o.image,
    location: o.location,
    duration: o.duration,
    date: o.date,
    currentVolunteers: o.totalVolunteers ?? o.currentVolunteers ?? 0,
    maxVolunteers: o.maxVolunteers,
    categories: o.types ?? o.categories ?? [],
})

// ---------- Modal (shared fields) ----------
type FormState = {
    title: string
    location: string
    description: string
    startDate: string
    durationDays: number
    maxVolunteers: number
    categories: string
    imageUrl: string
    imageFile?: File | null
    previewUrl?: string
}

const emptyForm: FormState = {
    title: "",
    location: "",
    description: "",
    startDate: "",
    durationDays: 1,
    maxVolunteers: 10,
    categories: "",
    imageUrl: "",
    imageFile: null,
    previewUrl: "",
}

function useImagePreview() {
    const [previewUrl, setPreviewUrl] = useState<string>("")
    function setFile(file: File | null) {
        if (!file) {
            setPreviewUrl("")
            return
        }
        const url = URL.createObjectURL(file)
        setPreviewUrl(url)
    }
    return { previewUrl, setFile, setPreviewUrl }
}

// ---------- Create Modal ----------
function CreateOpportunityModal({
                                    open,
                                    onOpenChange,
                                    onCreated,
                                }: {
    open: boolean
    onOpenChange: (v: boolean) => void
    onCreated: (created: UIOpportunity) => void
}) {
    const { toast } = useToast()
    const [loading, setLoading] = useState(false)
    const [form, setForm] = useState<FormState>(emptyForm)
    const { previewUrl, setFile, setPreviewUrl } = useImagePreview()

    useEffect(() => {
        if (!open) {
            setForm(emptyForm)
            setPreviewUrl("")
        }
    }, [open, setPreviewUrl])

    const onChange =
        (k: keyof FormState) =>
            (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                const v = e.target.type === "number" ? Number(e.target.value) : e.target.value
                setForm((p) => ({ ...p, [k]: v as any }))
            }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!form.title || !form.location || !form.description || !form.startDate) {
            toast({ title: "Missing fields", description: "Please fill all required fields." })
            return
        }

        try {
            setLoading(true)

            // If you later support real image upload, upload file first and set imageUrl
            const payload = {
                title: form.title,
                description: form.description,
                location: form.location,
                startDate: form.startDate,          // normalized by API
                durationDays: form.durationDays,    // normalized by API
                maxVolunteers: form.maxVolunteers,
                categories: form.categories,        // "a, b" -> API splits
                imageUrl: form.imageUrl || previewUrl || "", // fallback to preview URL (local) for demo
            }

            const res = await fetch("/api/opportunities", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            })
            if (!res.ok) throw new Error(await res.text())
            const created = toUI(await res.json())
            toast({ title: "Created", description: `${created.title} is now live.` })
            onCreated(created)
            onOpenChange(false)
        } catch (err: any) {
            toast({ title: "Failed to create", description: err?.message ?? "Unknown error" })
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Create New Volunteer Opportunity</DialogTitle>
                    <p className="text-sm text-muted-foreground">Fill out the details for a new volunteer opportunity</p>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="c-title">Title *</Label>
                            <Input id="c-title" value={form.title} onChange={onChange("title")} placeholder="Enter title" />
                        </div>

                        <div>
                            <Label htmlFor="c-location">Location *</Label>
                            <Input id="c-location" value={form.location} onChange={onChange("location")} placeholder="Enter city" />
                        </div>

                        <div className="md:col-span-2">
                            <Label htmlFor="c-desc">Description *</Label>
                            <Textarea
                                id="c-desc"
                                rows={5}
                                value={form.description}
                                onChange={onChange("description")}
                                placeholder="Describe your volunteer activity"
                            />
                        </div>

                        <div>
                            <Label htmlFor="c-date">Date start to end *</Label>
                            <Input id="c-date" type="date" value={form.startDate} onChange={onChange("startDate")} />
                        </div>

                        <div>
                            <Label htmlFor="c-duration">Duration in hours or days</Label>
                            <Input id="c-duration" type="number" min={1} value={form.durationDays} onChange={onChange("durationDays")} />
                        </div>

                        <div>
                            <Label htmlFor="c-type">Type/Skill</Label>
                            <Input
                                id="c-type"
                                placeholder="Skill required"
                                value={form.categories}
                                onChange={onChange("categories")}
                            />
                        </div>

                        <div>
                            <Label htmlFor="c-limit">Volunteers limit</Label>
                            <Input
                                id="c-limit"
                                type="number"
                                min={1}
                                value={form.maxVolunteers}
                                onChange={onChange("maxVolunteers")}
                            />
                        </div>
                    </div>

                    {/* Image upload & preview */}
                    <div className="space-y-2">
                        <p className="text-xs text-muted-foreground">
                            Note: Upload the image for Event Cover in landscape (recommended).
                        </p>
                        {previewUrl && (
                            <img src={previewUrl} alt="preview" className="w-full max-h-56 object-cover rounded-md border" />
                        )}
                        <div className="flex items-center gap-2">
                            <Label className="sr-only" htmlFor="file">Upload File</Label>
                            <div>
                                <Input
                                    id="file"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const f = e.target.files?.[0] ?? null
                                        setForm((p) => ({ ...p, imageFile: f }))
                                        setFile(f)
                                    }}
                                />
                            </div>
                            <div className="flex-1" />
                            <div className="flex items-center gap-2">
                                <Upload className="h-4 w-4 opacity-70" />
                                <Input
                                    placeholder="or paste Image URL"
                                    value={form.imageUrl}
                                    onChange={onChange("imageUrl")}
                                />
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Creating…" : "Create"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

// ---------- Edit Modal ----------
function EditOpportunityModal({
                                  open,
                                  onOpenChange,
                                  data,
                                  onUpdated,
                              }: {
    open: boolean
    onOpenChange: (v: boolean) => void
    data: UIOpportunity | null
    onUpdated: (updated: UIOpportunity) => void
}) {
    const { toast } = useToast()
    const [loading, setLoading] = useState(false)
    const { previewUrl, setFile, setPreviewUrl } = useImagePreview()

    const init: FormState = useMemo(() => {
        if (!data) return emptyForm
        return {
            title: data.title,
            location: data.location,
            description: data.description,
            startDate: /^\d{4}-\d{2}-\d{2}/.test(data.date) ? data.date : "", // if API date is formatted, leave blank
            durationDays: Number(String(data.duration).split(" ")[0]) || 1,
            maxVolunteers: data.maxVolunteers,
            categories: data.categories.join(", "),
            imageUrl: data.image ?? "",
            imageFile: null,
            previewUrl: data.image ?? "",
        }
    }, [data])

    const [form, setForm] = useState<FormState>(init)

    useEffect(() => {
        setForm(init)
        setPreviewUrl(init.previewUrl || "")
    }, [init, setPreviewUrl])

    const onChange =
        (k: keyof FormState) =>
            (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                const v = e.target.type === "number" ? Number(e.target.value) : e.target.value
                setForm((p) => ({ ...p, [k]: v as any }))
            }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!data?.id) return
        if (!form.title || !form.location || !form.description) {
            toast({ title: "Missing fields", description: "Please fill all required fields." })
            return
        }

        try {
            setLoading(true)

            // (Optional) Call your PATCH endpoint here when you add it:
            // await fetch(`/api/opportunities/${data.id}`, { method: "PATCH", body: JSON.stringify({...}) })

            const updated: UIOpportunity = {
                id: data.id,
                title: form.title,
                description: form.description,
                image: form.imageUrl || previewUrl || data.image,
                location: form.location,
                duration: `${form.durationDays} Days`,
                date: form.startDate || data.date,
                currentVolunteers: data.currentVolunteers,
                maxVolunteers: form.maxVolunteers,
                categories: form.categories.split(",").map((s) => s.trim()).filter(Boolean),
            }

            onUpdated(updated) // optimistic update
            toast({ title: "Saved", description: `${updated.title} has been updated.` })
            onOpenChange(false)
        } catch (err: any) {
            toast({ title: "Failed to save", description: err?.message ?? "Unknown error" })
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Volunteer Opportunity</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="e-title">Title *</Label>
                            <Input id="e-title" value={form.title} onChange={onChange("title")} />
                        </div>

                        <div>
                            <Label htmlFor="e-location">Location *</Label>
                            <Input id="e-location" value={form.location} onChange={onChange("location")} />
                        </div>

                        <div className="md:col-span-2">
                            <Label htmlFor="e-desc">Description *</Label>
                            <Textarea id="e-desc" rows={5} value={form.description} onChange={onChange("description")} />
                        </div>

                        <div>
                            <Label htmlFor="e-date">Date</Label>
                            <Input id="e-date" type="date" value={form.startDate} onChange={onChange("startDate")} />
                        </div>

                        <div>
                            <Label htmlFor="e-duration">Duration in hours or days</Label>
                            <Input id="e-duration" type="number" min={1} value={form.durationDays} onChange={onChange("durationDays")} />
                        </div>

                        <div>
                            <Label htmlFor="e-type">Type/Skill</Label>
                            <Input id="e-type" value={form.categories} onChange={onChange("categories")} />
                        </div>

                        <div>
                            <Label htmlFor="e-limit">Volunteers limit</Label>
                            <Input id="e-limit" type="number" min={1} value={form.maxVolunteers} onChange={onChange("maxVolunteers")} />
                        </div>
                    </div>

                    {/* Image upload & preview */}
                    <div className="space-y-2">
                        {(previewUrl || form.imageUrl) && (
                            <img
                                src={previewUrl || form.imageUrl}
                                alt="preview"
                                className="w-full max-h-56 object-cover rounded-md border"
                            />
                        )}
                        <div className="flex items-center gap-2">
                            <Input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const f = e.target.files?.[0] ?? null
                                    setForm((p) => ({ ...p, imageFile: f }))
                                    setFile(f)
                                }}
                            />
                            <div className="flex-1" />
                            <Input
                                placeholder="or paste Image URL"
                                value={form.imageUrl}
                                onChange={onChange("imageUrl")}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Saving…" : "Done"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

// ---------- Main Page ----------
export default function VolunteerDashboard() {
    const [currentTab, setCurrentTab] = useState<"overview" | "created" | "application">("overview")
    const [searchTerm, setSearchTerm] = useState("")
    const [opps, setOpps] = useState<UIOpportunity[]>([])
    const [createOpen, setCreateOpen] = useState(false)
    const [editOpen, setEditOpen] = useState(false)
    const [editing, setEditing] = useState<UIOpportunity | null>(null)
    const handleLogout = useLogout()
    const { user } = useAuth()
    // Info modal
    const [infoOpen, setInfoOpen] = useState(false)
    const [infoItem, setInfoItem] = useState<UIOpportunity | null>(null)

// Volunteers modal
    const [volOpen, setVolOpen] = useState(false)
    const [volItem, setVolItem] = useState<UIOpportunity | null>(null)

// Delete confirm
    const [delOpen, setDelOpen] = useState(false)
    const [delItem, setDelItem] = useState<UIOpportunity | null>(null)


    // load from API
    useEffect(() => {
        ;(async () => {
            try {
                const res = await fetch("/api/opportunities", { cache: "no-store" })
                const data = await res.json()
                setOpps(data.map(toUI))
            } catch {
                // fallback to empty on error
                setOpps([])
            }
        })()
    }, [])

    const searchResults = useMemo(() => {
        const list = opps
        if (!searchTerm) return list
        const q = searchTerm.toLowerCase()
        return list.filter(
            (o) => o.title.toLowerCase().includes(q) || o.description.toLowerCase().includes(q)
        )
    }, [opps, searchTerm])

    const renderOverviewTab = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {searchResults.map((opportunity) => (
                <div key={opportunity.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                    <img src={opportunity.image || "/placeholder.svg?height=200&width=300"} alt={opportunity.title} className="w-full h-48 object-cover" />
                    <div className="p-4">
                        <h3 className="font-semibold text-lg mb-2">{opportunity.title}</h3>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{opportunity.description}</p>
                        <div className="space-y-2 mb-4 text-sm text-gray-500">
                            <div className="flex items-center"><MapPin className="h-4 w-4 mr-2" />{opportunity.location}</div>
                            <div className="flex items-center"><Calendar className="h-4 w-4 mr-2" />{/^\d{4}-\d{2}-\d{2}/.test(opportunity.date) ? new Date(opportunity.date).toLocaleDateString() : opportunity.date}</div>
                            <div className="flex items-center"><Clock className="h-4 w-4 mr-2" />{opportunity.duration}</div>
                        </div>
                        <div className="flex flex-wrap gap-1">
                            <span className="text-sm font-medium text-gray-700">Categories:</span>
                            {opportunity.categories.map((c, i) => (
                                <Badge key={i} variant="secondary" className="text-xs">{c}</Badge>
                            ))}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )

    const renderCreatedOpportunitiesTab = () => (
        <div className="space-y-6">
            <div className="flex justify-end">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setCreateOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Opportunity
                </Button>
            </div>

            <div className="space-y-4">
                {opps.map((opportunity) => (
                    <div
                        key={opportunity.id}
                        className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
                    >
                        <div className="flex gap-6">
                            <img
                                src={opportunity.image || "/placeholder.svg?height=200&width=300"}
                                alt={opportunity.title}
                                className="w-64 h-32 object-cover rounded-lg flex-shrink-0"
                            />
                            <div className="flex-1">
                                <h3 className="font-semibold text-xl mb-2">{opportunity.title}</h3>
                                <p className="text-gray-600 mb-4">{opportunity.description}</p>

                                <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-500">
                                    <div className="flex items-center">
                                        <MapPin className="h-4 w-4 mr-1" />
                                        {opportunity.location}
                                    </div>
                                    <div className="flex items-center">
                                        <Clock className="h-4 w-4 mr-1" />
                                        {opportunity.duration}
                                    </div>
                                    <div className="flex items-center">
                                        <Calendar className="h-4 w-4 mr-1" />
                                        {/^\d{4}-\d{2}-\d{2}/.test(opportunity.date)
                                            ? new Date(opportunity.date).toLocaleDateString()
                                            : opportunity.date}
                                    </div>
                                    <div className="flex items-center">
                                        <Users className="h-4 w-4 mr-1" />
                                        Total Volunteers : {opportunity.currentVolunteers}/{opportunity.maxVolunteers}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium text-gray-700">Type:</span>
                                        {opportunity.categories.map((category, index) => (
                                            <Badge key={index} variant="secondary" className="text-xs">
                                                {category}
                                            </Badge>
                                        ))}
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {/* INFO */}
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="hover:bg-gray-50"
                                            onClick={() => {
                                                setInfoItem(opportunity)
                                                setInfoOpen(true)
                                            }}
                                        >
                                            <Info className="h-4 w-4 mr-1" />
                                            Info
                                        </Button>

                                        {/* VOLUNTEERS */}
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="hover:bg-gray-50"
                                            onClick={() => {
                                                setVolItem(opportunity)
                                                setVolOpen(true)
                                            }}
                                        >
                                            <Users className="h-4 w-4 mr-1" />
                                            Volunteers
                                        </Button>

                                        {/* EDIT */}
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="hover:bg-blue-50 hover:text-blue-600"
                                            onClick={() => {
                                                setEditing(opportunity)
                                                setEditOpen(true)
                                            }}
                                        >
                                            <EditIcon className="h-4 w-4 mr-1" />
                                            Edit
                                        </Button>

                                        {/* DELETE */}
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            className="hover:bg-red-600"
                                            onClick={() => {
                                                setDelItem(opportunity)
                                                setDelOpen(true)
                                            }}
                                        >
                                            <Trash2 className="h-4 w-4 mr-1" />
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modals */}
            <CreateOpportunityModal
                open={createOpen}
                onOpenChange={setCreateOpen}
                onCreated={(created) => setOpps((prev) => [created, ...prev])}
            />

            <EditOpportunityModal
                open={editOpen}
                onOpenChange={setEditOpen}
                data={editing}
                onUpdated={(updated) => setOpps((prev) => prev.map((o) => (o.id === updated.id ? updated : o)))}
            />

            {/* NEW: Info/Volunteers/Delete overlays */}
            <DetailsModal open={infoOpen} onOpenChange={setInfoOpen} data={infoItem} />

            <VolunteersModal open={volOpen} onOpenChange={setVolOpen} opportunity={volItem} />

            <ConfirmDeleteDialog
                open={delOpen}
                onOpenChange={setDelOpen}
                title={delItem?.title}
                onConfirm={async () => {
                    if (!delItem?.id) return
                    const res = await fetch(`/api/opportunities/${delItem.id}`, { method: "DELETE" })
                    if (res.ok) setOpps((prev) => prev.filter((o) => o.id !== delItem.id))
                }}
            />
        </div>
    )


    const renderApplicationsTab = () => (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-4 border-b">
                <h2 className="text-lg font-semibold">Volunteer Applications</h2>
                <p className="text-sm text-gray-600">Review and manage volunteer applications</p>
            </div>
            <Table>
                <TableHeader>
                    <TableRow className="bg-gray-50">
                        <TableHead className="w-16">#</TableHead>
                        <TableHead>First Name</TableHead>
                        <TableHead>Last Name</TableHead>
                        <TableHead className="w-20">Gender</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Country</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Applied For</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {/* Your application rows here */}
                </TableBody>
            </Table>
        </div>
    )

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
                <div className="flex items-center justify-between">
                    <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
                        <div className="w-12 h-12 overflow-hidden flex items-center justify-center">
                            <img src="/SL-091823-63290-21.jpg" alt="VolunteerVerse Logo" className="w-full h-full object-contain" />
                        </div>
                        <span className="font-bold text-lg text-gray-900">VOLUNTEERVERSE</span>
                    </Link>

                    <div className="flex items-center space-x-4">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="flex items-center gap-2">
                                    <Settings className="w-4 h-4" />
                                    Setting
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuItem>Languages</DropdownMenuItem>
                                <DropdownMenuItem>Preference</DropdownMenuItem>
                                <DropdownMenuItem>Contact Support</DropdownMenuItem>
                                <DropdownMenuItem>FAQ</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <Button variant="ghost" size="icon" className="relative hover:bg-gray-100">
                            <Bell className="h-5 w-5" />
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">1</span>
                        </Button>

                        <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                                <AvatarFallback className="bg-blue-100 text-blue-700">
                                    {user?.user_metadata?.first_name && user?.user_metadata?.last_name
                                        ? `${user.user_metadata.first_name[0]}${user.user_metadata.last_name[0]}`
                                        : user?.email?.[0]?.toUpperCase() || 'U'
                                    }
                                </AvatarFallback>
                            </Avatar>
                                                    <div className="text-sm">
                            <div className="font-medium text-gray-900">
                                {user?.user_metadata?.first_name && user?.user_metadata?.last_name 
                                    ? `${user.user_metadata.first_name} ${user.user_metadata.last_name}`
                                    : user?.email || 'User'
                                }
                            </div>
                            <div className="text-gray-500">Event Organizer</div>
                        </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 ml-2"
                                onClick={handleLogout}
                            >
                                Logout
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main */}
            <main className="px-6 py-8 max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">Event Management</h1>
                        <p className="text-gray-600">Manage your volunteer opportunities and applications</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="bg-blue-600 text-white px-6 py-4 rounded-lg flex items-center space-x-3 min-w-[160px]">
                            <Users className="h-6 w-6" />
                            <div>
                                <div className="text-sm opacity-90">Total Volunteers</div>
                                <div className="text-2xl font-bold">404</div>
                            </div>
                        </div>
                        <div className="bg-pink-500 text-white px-6 py-4 rounded-lg flex items-center space-x-3 min-w-[160px]">
                            <Calendar className="h-6 w-6" />
                            <div>
                                <div className="text-sm opacity-90">Active Events</div>
                                <div className="text-2xl font-bold">3</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex space-x-1 mb-8 bg-gray-100 p-1 rounded-lg w-fit">
                    {[
                        { key: "overview", label: "Overview" },
                        { key: "created", label: "My Events" },
                        { key: "application", label: "Applications" }
                    ].map((tab) => (
                        <Button
                            key={tab.key}
                            variant={currentTab === tab.key ? "default" : "ghost"}
                            onClick={() => setCurrentTab(tab.key as any)}
                            className="rounded-md transition-all"
                        >
                            {tab.label}
                        </Button>
                    ))}
                </div>

                {/* Search */}
                <div className="relative mb-8 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                        placeholder="Search opportunities..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>

                {/* Tab content */}
                {currentTab === "overview" && renderOverviewTab()}
                {currentTab === "created" && renderCreatedOpportunitiesTab()}
                {currentTab === "application" && renderApplicationsTab()}
            </main>
        </div>
    )
}
