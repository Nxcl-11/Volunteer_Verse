"use client"
import { useState } from "react"
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
  Edit,
  Trash2
} from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Centralized icon constants
const ICONS = {
  search: Search,
  settings: Settings,
  bell: Bell,
  plus: Plus,
  mapPin: MapPin,
  clock: Clock,
  calendar: Calendar,
  users: Users,
  info: Info,
  edit: Edit,
  trash: Trash2,
} as const

// Mock data
const opportunities = [
  {
    id: 1,
    title: "Esports Volunteer",
    description: "Help organize the Counter Strike 2 tournament",
    image: "/placeholder.svg?height=200&width=300",
    location: "Phnom Penh",
    duration: "3 Days",
    date: "11/07/2025",
    totalVolunteers: 20,
    maxVolunteers: 30,
    types: ["Teamwork", "CS2 player"],
  },
  {
    id: 2,
    title: "Hospital Event Volunteer",
    description: "Help organize and raise fund to help hospital",
    image: "/placeholder.svg?height=200&width=300",
    location: "Phnom Penh",
    duration: "3 Days",
    date: "11/9/2025",
    totalVolunteers: 127,
    maxVolunteers: 150,
    types: ["Teamwork", "Community"],
  },
]

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
  },
]

export default function VolunteerDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredOpportunities = opportunities.filter(
      (opp) =>
          (opp.title?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
          (opp.description?.toLowerCase() || '').includes(searchQuery.toLowerCase()),
  )

  return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-12 h-12 overflow-hidden flex items-center justify-center">
                <img 
                  src="/SL-091823-63290-21.jpg" 
                  alt="VolunteerVerse Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="font-bold text-lg">VOLUNTEERVERSE</span>
            </Link>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon">
                <ICONS.settings className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="relative">
                <ICONS.bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                1
              </span>
              </Button>
              <div className="flex items-center space-x-2">
                <Avatar>
                  <AvatarImage src="/placeholder.svg?height=32&width=32" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="text-sm">
                  <div className="font-medium">Chylong Nou</div>
                  <div className="text-gray-500">Organizer</div>
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

        {/* Main Content */}
        <main className="px-6 py-8">
          {/* Title and Stats */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-bold text-gray-900">Manage your event here</h1>
            <div className="flex space-x-4">
              <div className="bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2">
                <ICONS.users className="h-5 w-5" />
                <div>
                  <div className="text-sm opacity-90">Total volunteers</div>
                  <div className="text-xl font-bold">404</div>
                </div>
              </div>
              <div className="bg-pink-500 text-white px-6 py-3 rounded-lg flex items-center space-x-2">
                <ICONS.calendar className="h-5 w-5" />
                <div>
                  <div className="text-sm opacity-90">Total Opportunities</div>
                  <div className="text-xl font-bold">3</div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex space-x-1 mb-6">
            <Button
                variant={activeTab === "overview" ? "default" : "ghost"}
                onClick={() => setActiveTab("overview")}
                className="rounded-lg"
            >
              Overview
            </Button>
            <Button
                variant={activeTab === "created" ? "default" : "ghost"}
                onClick={() => setActiveTab("created")}
                className="rounded-lg"
            >
              Created Opportunity
            </Button>
            <Button
                variant={activeTab === "application" ? "default" : "ghost"}
                onClick={() => setActiveTab("application")}
                className="rounded-lg"
            >
              Application
            </Button>
          </div>

          {/* Search Bar */}
          <div className="relative mb-8 max-w-md">
            <ICONS.search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white"
            />
          </div>

          {activeTab === "overview" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredOpportunities.map((opportunity) => (
                    <div key={opportunity.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                      <img
                          src={opportunity.image || "/placeholder.svg"}
                          alt={opportunity.title}
                          className="w-full h-48 object-cover"
                      />
                      <div className="p-4">
                        <h3 className="font-semibold text-lg mb-2">{opportunity.title}</h3>
                        <p className="text-gray-600 text-sm mb-4">{opportunity.description}</p>

                        <div className="space-y-2 mb-4">
                          <div className="flex items-center text-sm text-gray-500">
                            <ICONS.mapPin className="h-4 w-4 mr-2" />
                            {opportunity.location}
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <ICONS.calendar className="h-4 w-4 mr-2" />
                            {opportunity.date}
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <ICONS.clock className="h-4 w-4 mr-2" />
                            {opportunity.duration}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1 mb-4">
                          <span className="text-sm font-medium">Type</span>
                          {opportunity.types.map((type, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {type}
                              </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                ))}
              </div>
          )}

          {activeTab === "created" && (
              <div className="space-y-6">
                <div className="flex justify-end">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <ICONS.plus className="h-4 w-4 mr-2" />
                    New Opportunities
                  </Button>
                </div>

                <div className="space-y-4">
                  {opportunities.map((opportunity) => (
                      <div key={opportunity.id} className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex gap-6">
                          <img
                              src={opportunity.image || "/placeholder.svg"}
                              alt={opportunity.title}
                              className="w-64 h-32 object-cover rounded-lg flex-shrink-0"
                          />

                          <div className="flex-1">
                            <h3 className="font-semibold text-xl mb-2">{opportunity.title}</h3>
                            <p className="text-gray-600 mb-4">{opportunity.description}</p>

                            <div className="flex items-center space-x-6 mb-4">
                              <div className="flex items-center text-sm text-gray-500">
                                <ICONS.mapPin className="h-4 w-4 mr-1" />
                                {opportunity.location}
                              </div>
                              <div className="flex items-center text-sm text-gray-500">
                                <ICONS.clock className="h-4 w-4 mr-1" />
                                {opportunity.duration}
                              </div>
                              <div className="flex items-center text-sm text-gray-500">
                                <ICONS.calendar className="h-4 w-4 mr-1" />
                                {opportunity.date}
                              </div>
                              <div className="flex items-center text-sm text-gray-500">
                                <ICONS.users className="h-4 w-4 mr-1" />
                                Total Volunteers : {opportunity.totalVolunteers} /{opportunity.maxVolunteers}
                              </div>
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <span className="text-sm font-medium">Type</span>
                                {opportunity.types.map((type, index) => (
                                    <Badge key={index} variant="secondary" className="text-xs">
                                      {type}
                                    </Badge>
                                ))}
                              </div>

                              <div className="flex items-center space-x-2">
                                <Button variant="outline" size="sm">
                                  <ICONS.info className="h-4 w-4 mr-1" />
                                  Info
                                </Button>
                                <Button variant="outline" size="sm">
                                  <ICONS.users className="h-4 w-4 mr-1" />
                                  Volunteers
                                </Button>
                                <Button variant="outline" size="sm">
                                  <ICONS.edit className="h-4 w-4 mr-1" />
                                  Edit
                                </Button>
                                <Button variant="destructive" size="sm">
                                  <ICONS.trash className="h-4 w-4 mr-1" />
                                  Delete
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                  ))}
                </div>
              </div>
          )}

          {activeTab === "application" && (
              <div className="bg-white rounded-lg shadow-sm">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>No</TableHead>
                      <TableHead>First name</TableHead>
                      <TableHead>Last name</TableHead>
                      <TableHead>Sex</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Country</TableHead>
                      <TableHead>Phone number</TableHead>
                      <TableHead>Volunteer Event</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {applications.map((application, index) => (
                        <TableRow key={application.id}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{application.firstName}</TableCell>
                          <TableCell>{application.lastName}</TableCell>
                          <TableCell>{application.sex}</TableCell>
                          <TableCell>{application.email}</TableCell>
                          <TableCell>{application.country}</TableCell>
                          <TableCell>{application.phone}</TableCell>
                          <TableCell>{application.volunteerEvent}</TableCell>
                        </TableRow>
                    ))}
                    {/* Empty rows for visual consistency */}
                    {Array.from({ length: 8 }).map((_, index) => (
                        <TableRow key={`empty-${index}`}>q
                          <TableCell>&nbsp;</TableCell>
                          <TableCell>&nbsp;</TableCell>
                          <TableCell>&nbsp;</TableCell>
                          <TableCell>&nbsp;</TableCell>
                          <TableCell>&nbsp;</TableCell>
                          <TableCell>&nbsp;</TableCell>
                          <TableCell>&nbsp;</TableCell>
                          <TableCell>&nbsp;</TableCell>
                        </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
          )}
        </main>
      </div>
  )
}