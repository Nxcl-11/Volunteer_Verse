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

const volunteerOpportunities = [
  {
    id: 1,
    title: "Esports Volunteer",
    description: "Help organize the Counter Strike 2 tournament",
    image: "/placeholder.svg?height=200&width=300",
    location: "Phnom Penh",
    duration: "3 Days",
    date: "11/07/2025",
    currentVolunteers: 20,
    maxVolunteers: 30,
    categories: ["Teamwork", "CS2 player"],
  },
  {
    id: 2,
    title: "Hospital Event Volunteer",
    description: "Help organize and raise fund to help hospital",
    image: "/placeholder.svg?height=200&width=300",
    location: "Phnom Penh",
    duration: "3 Days",
    date: "11/9/2025",
    currentVolunteers: 127,
    maxVolunteers: 150,
    categories: ["Teamwork", "Community"],
  },
]

const volunteerApplications = [
  {
    id: 1,
    firstName: "Chylong",
    lastName: "Nou",
    gender: "M",
    email: "nou.chylong24@kit.edu.kh",
    country: "Cambodia",
    phone: "099788525",
    appliedFor: "Esports Volunteer",
  },
]

export default function VolunteerDashboard() {
  const [currentTab, setCurrentTab] = useState("overview")
  const [searchTerm, setSearchTerm] = useState("")

  // Filter opportunities
  const searchResults = volunteerOpportunities.filter(opportunity =>
    opportunity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    opportunity.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const renderOverviewTab = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {searchResults.map((opportunity) => (
        <div key={opportunity.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
          <img
            src={opportunity.image}
            alt={opportunity.title}
            className="w-full h-48 object-cover"
          />
          <div className="p-4">
            <h3 className="font-semibold text-lg mb-2">{opportunity.title}</h3>
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{opportunity.description}</p>

            <div className="space-y-2 mb-4 text-sm text-gray-500">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                <span>{opportunity.location}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                <span>{opportunity.date}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
                <span>{opportunity.duration}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-1">
              <span className="text-sm font-medium text-gray-700">Categories:</span>
              {opportunity.categories.map((category, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {category}
                </Badge>
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
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Create New Opportunity
        </Button>
      </div>

      <div className="space-y-4">
        {volunteerOpportunities.map((opportunity) => (
          <div key={opportunity.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex gap-6">
              <img
                src={opportunity.image}
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
                    {opportunity.date}
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    Volunteers: {opportunity.currentVolunteers}/{opportunity.maxVolunteers}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">Categories:</span>
                    {opportunity.categories.map((category, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {category}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="hover:bg-gray-50">
                      <Info className="h-4 w-4 mr-1" />
                      Details
                    </Button>
                    <Button variant="outline" size="sm" className="hover:bg-gray-50">
                      <Users className="h-4 w-4 mr-1" />
                      Volunteers
                    </Button>
                    <Button variant="outline" size="sm" className="hover:bg-blue-50 hover:text-blue-600">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button variant="destructive" size="sm" className="hover:bg-red-600">
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
          {volunteerApplications.map((application, index) => (
            <TableRow key={application.id} className="hover:bg-gray-50">
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell>{application.firstName}</TableCell>
              <TableCell>{application.lastName}</TableCell>
              <TableCell>{application.gender}</TableCell>
              <TableCell className="text-blue-600">{application.email}</TableCell>
              <TableCell>{application.country}</TableCell>
              <TableCell>{application.phone}</TableCell>
              <TableCell>
                <Badge variant="outline">{application.appliedFor}</Badge>
              </TableCell>
            </TableRow>
          ))}
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
              <img 
                src="/SL-091823-63290-21.jpg" 
                alt="VolunteerVerse Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <span className="font-bold text-lg text-gray-900">VOLUNTEERVERSE</span>
          </Link>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="hover:bg-gray-100">
              <Settings className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="relative hover:bg-gray-100">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                1
              </span>
            </Button>
            
            <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                <AvatarFallback className="bg-blue-100 text-blue-700">CN</AvatarFallback>
              </Avatar>
              <div className="text-sm">
                <div className="font-medium text-gray-900">Chylong Nou</div>
                <div className="text-gray-500">Event Organizer</div>
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

      <main className="px-6 py-8 max-w-7xl mx-auto">
        {/* Dashboard Header */}
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

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-8 bg-gray-100 p-1 rounded-lg w-fit">
          {[
            { key: "overview", label: "Overview" },
            { key: "created", label: "My Events" },
            { key: "application", label: "Applications" }
          ].map((tab) => (
            <Button
              key={tab.key}
              variant={currentTab === tab.key ? "default" : "ghost"}
              onClick={() => setCurrentTab(tab.key)}
              className="rounded-md transition-all"
            >
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Search bar */}
        <div className="relative mb-8 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
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