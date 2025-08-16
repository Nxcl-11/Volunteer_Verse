import { Search, MapPin, Clock, Calendar, Users, Share2, Settings, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"

const volunteerOpportunities = [
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
    title: "Esports Volunteer",
    description: "Help organize the Counter Strike 2 tournament",
    location: "Phnom Penh",
    duration: "3 Days",
    dateRange: "11/05/2025 - 13/05/2025",
    volunteers: { current: 20, total: 30 },
    tags: ["Teamwork", "Gaming"],
    image: "",
  },
]

export default function VolunteerPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="" className="flex items-center gap-3">
            <div className="w-12 h-12 overflow-hidden flex items-center justify-center">
              <img 
                src="/SL-091823-63290-21.jpg" 
                alt="VolunteerVerse Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <span className="font-semibold text-gray-900">VOLUNTEERVERSE</span>
          </Link>

          <div className="flex items-center gap-4">
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

            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs"></span>
            </Button>

            <div className="flex items-center gap-2">
              <Avatar className="w-8 h-8">
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div className="text-sm">
                <div className="font-medium">Chylong Nou</div>
                <div className="text-gray-500 text-xs">Volunteer</div>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-red-600 hover:text-red-700 hover:bg-red-50 ml-2"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main*/}
      <main className="px-6 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Find your opportunities here</h1>

        {/* Search,Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input placeholder="Search" className="pl-10 bg-white" />
          </div>

          <Select defaultValue="phnom-penh">
            <SelectTrigger className="w-full md:w-48 bg-white">
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="phnom-penh">Location: Phnom Penh</SelectItem>
              <SelectItem value="siem-reap">Location: Siem Reap</SelectItem>
              <SelectItem value="battambang">Location: Battambang</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue="lastest">
            <SelectTrigger className="w-full md:w-48 bg-white">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="lastest">Sort by: Lastest</SelectItem>
              <SelectItem value="oldest">Sort by: Oldest</SelectItem>
              <SelectItem value="popular">Sort by: Popular</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue="all">
            <SelectTrigger className="w-full md:w-48 bg-white">
              <SelectValue placeholder="Skills" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Skill</SelectItem>
              <SelectItem value="teamwork">Teamwork</SelectItem>
              <SelectItem value="gaming">Gaming</SelectItem>
              <SelectItem value="leadership">Leadership</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Volunteer Opportunities */}
        <div className="space-y-6">
          {volunteerOpportunities.map((opportunity) => (
            <Card key={opportunity.id} className="overflow-hidden bg-white">
              <CardContent className="p-0">
                <div className="flex flex-col lg:flex-row">
                  <div className="lg:w-80 h-48 lg:h-auto">
                    <img
                      src={opportunity.image || "/placeholder.svg"}
                      alt={opportunity.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{opportunity.title}</h3>
                        <p className="text-gray-600 mb-4">{opportunity.description}</p>
                      </div>
                      <Button variant="ghost" size="icon">
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-600">
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

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex gap-2">
                        <span className="text-sm font-medium text-gray-700">Type</span>
                        {opportunity.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="bg-gray-100 text-gray-700">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline">View</Button>
                        <Button>Apply</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
