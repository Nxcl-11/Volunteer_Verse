"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'

interface VolunteerFormData {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
  phone: string
  skills: string
  interests: string
  availability: string
}

interface OrganizerFormData {
  organizationName: string
  contactPerson: string
  email: string
  password: string
  confirmPassword: string
  phone: string
  organizationType: string
  website: string
  description: string
}

export default function RegisterPage() {
  const [activeTab, setActiveTab] = useState('volunteer')
  const [volunteerData, setVolunteerData] = useState<VolunteerFormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    skills: '',
    interests: '',
    availability: ''
  })
  
  const [organizerData, setOrganizerData] = useState<OrganizerFormData>({
    organizationName: '',
    contactPerson: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    organizationType: '',
    website: '',
    description: ''
  })

  const { toast } = useToast()

  const handleVolunteerChange = (field: keyof VolunteerFormData, value: string) => {
    setVolunteerData(prev => ({ ...prev, [field]: value }))
  }

  const handleOrganizerChange = (field: keyof OrganizerFormData, value: string) => {
    setOrganizerData(prev => ({ ...prev, [field]: value }))
  }

  const validateVolunteerForm = (): boolean => {
    if (!volunteerData.firstName || !volunteerData.lastName || !volunteerData.email || 
        !volunteerData.password || !volunteerData.confirmPassword || !volunteerData.phone) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      })
      return false
    }

    if (volunteerData.password !== volunteerData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match.",
        variant: "destructive"
      })
      return false
    }

    if (volunteerData.password.length < 8) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 8 characters long.",
        variant: "destructive"
      })
      return false
    }

    return true
  }

  const validateOrganizerForm = (): boolean => {
    if (!organizerData.organizationName || !organizerData.contactPerson || !organizerData.email || 
        !organizerData.password || !organizerData.confirmPassword || !organizerData.phone) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      })
      return false
    }

    if (organizerData.password !== organizerData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match.",
        variant: "destructive"
      })
      return false
    }

    if (organizerData.password.length < 8) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 8 characters long.",
        variant: "destructive"
      })
      return false
    }

    return true
  }

  const handleVolunteerSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateVolunteerForm()) return

    try {
      // Here you would typically make an API call to register the volunteer
      console.log('Volunteer registration data:', volunteerData)
      
      toast({
        title: "Registration Successful!",
        description: "Welcome to Volunteer Verse! Please check your email to verify your account.",
      })

      // Reset form
      setVolunteerData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        skills: '',
        interests: '',
        availability: ''
      })
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      })
    }
  }

  const handleOrganizerSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateOrganizerForm()) return

    try {
      // Here you would typically make an API call to register the organizer
      console.log('Organizer registration data:', organizerData)
      
      toast({
        title: "Registration Successful!",
        description: "Welcome to Volunteer Verse! Please check your email to verify your account.",
      })

      // Reset form
      setOrganizerData({
        organizationName: '',
        contactPerson: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        organizationType: '',
        website: '',
        description: ''
      })
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Join Volunteer Verse
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Choose your role and start making a difference in your community
          </p>
        </div>

        <Card className="w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Create Your Account</CardTitle>
            <CardDescription>
              Select whether you want to volunteer or organize opportunities
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger 
                  value="volunteer" 
                  className="flex items-center gap-2 transition-all duration-200 hover:scale-105 active:scale-95 hover:shadow-md"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Volunteer
                </TabsTrigger>
                <TabsTrigger 
                  value="organizer" 
                  className="flex items-center gap-2 transition-all duration-200 hover:scale-105 active:scale-95 hover:shadow-md"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  Organizer
                </TabsTrigger>
              </TabsList>

              <TabsContent value="volunteer" className="space-y-6">
                <form onSubmit={handleVolunteerSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        type="text"
                        placeholder="Enter your first name"
                        value={volunteerData.firstName}
                        onChange={(e) => handleVolunteerChange('firstName', e.target.value)}
                        required
                        className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        type="text"
                        placeholder="Enter your last name"
                        value={volunteerData.lastName}
                        onChange={(e) => handleVolunteerChange('lastName', e.target.value)}
                        required
                        className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="volunteerEmail">Email *</Label>
                    <Input
                      id="volunteerEmail"
                      type="email"
                      placeholder="Enter your email address"
                      value={volunteerData.email}
                      onChange={(e) => handleVolunteerChange('email', e.target.value)}
                      required
                      className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="volunteerPassword">Password *</Label>
                      <Input
                        id="volunteerPassword"
                        type="password"
                        placeholder="Create a password"
                        value={volunteerData.password}
                        onChange={(e) => handleVolunteerChange('password', e.target.value)}
                        required
                        className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password *</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm your password"
                        value={volunteerData.confirmPassword}
                        onChange={(e) => handleVolunteerChange('confirmPassword', e.target.value)}
                        required
                        className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Enter your phone number"
                      value={volunteerData.phone}
                      onChange={(e) => handleVolunteerChange('phone', e.target.value)}
                      required
                      className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="skills">Skills & Experience</Label>
                    <Input
                      id="skills"
                      type="text"
                      placeholder="e.g., Teaching, Construction, Medical, etc."
                      value={volunteerData.skills}
                      onChange={(e) => handleVolunteerChange('skills', e.target.value)}
                      className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="interests">Areas of Interest</Label>
                    <Input
                      id="interests"
                      type="text"
                      placeholder="e.g., Education, Environment, Healthcare, etc."
                      value={volunteerData.interests}
                      onChange={(e) => handleVolunteerChange('interests', e.target.value)}
                      className="transition-all duration-200 focus:ring-500 focus:border-blue-500 hover:border-gray-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="availability">Availability</Label>
                    <Input
                      id="availability"
                      type="text"
                      placeholder="e.g., Weekends, Evenings, Flexible"
                      value={volunteerData.availability}
                      onChange={(e) => handleVolunteerChange('availability', e.target.value)}
                      className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 border-0 text-lg"
                    size="lg"
                  >
                    Register as Volunteer
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="organizer" className="space-y-6">
                <form onSubmit={handleOrganizerSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="organizationName">Organization Name *</Label>
                    <Input
                      id="organizationName"
                      type="text"
                      placeholder="Enter your organization name"
                      value={organizerData.organizationName}
                      onChange={(e) => handleOrganizerChange('organizationName', e.target.value)}
                      required
                      className="transition-all duration-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 hover:border-gray-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactPerson">Contact Person *</Label>
                    <Input
                      id="contactPerson"
                      type="text"
                      placeholder="Enter contact person name"
                      value={organizerData.contactPerson}
                      onChange={(e) => handleOrganizerChange('contactPerson', e.target.value)}
                      required
                      className="transition-all duration-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 hover:border-gray-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="organizerEmail">Email *</Label>
                    <Input
                      id="organizerEmail"
                      type="email"
                      placeholder="Enter organization email"
                      value={organizerData.email}
                      onChange={(e) => handleOrganizerChange('email', e.target.value)}
                      required
                      className="transition-all duration-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 hover:border-gray-400"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="organizerPassword">Password *</Label>
                      <Input
                        id="organizerPassword"
                        type="password"
                        placeholder="Create a password"
                        value={organizerData.password}
                        onChange={(e) => handleOrganizerChange('password', e.target.value)}
                        required
                        className="transition-all duration-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:border-green-500 hover:border-gray-400"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="organizerConfirmPassword">Confirm Password *</Label>
                      <Input
                        id="organizerConfirmPassword"
                        type="password"
                        placeholder="Confirm your password"
                        value={organizerData.confirmPassword}
                        onChange={(e) => handleOrganizerChange('confirmPassword', e.target.value)}
                        required
                        className="transition-all duration-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 hover:border-gray-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="Enter organization phone"
                        value={organizerData.phone}
                        onChange={(e) => handleOrganizerChange('phone', e.target.value)}
                        required
                        className="transition-all duration-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 hover:border-gray-400"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="organizationType">Organization Type</Label>
                      <Input
                        id="organizationType"
                        type="text"
                        placeholder="e.g., Non-profit, School, Hospital, etc."
                        value={organizerData.organizationType}
                        onChange={(e) => handleOrganizerChange('organizationType', e.target.value)}
                        className="transition-all duration-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 hover:border-gray-400"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      type="url"
                      placeholder="https://your-organization.com"
                      value={organizerData.website}
                      onChange={(e) => handleOrganizerChange('website', e.target.value)}
                      className="transition-all duration-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 hover:border-gray-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Organization Description</Label>
                    <textarea
                      id="description"
                      placeholder="Tell us about your organization and its mission..."
                      value={organizerData.description}
                      onChange={(e) => handleOrganizerChange('description', e.target.value)}
                      className="min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-all duration-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 hover:border-gray-400 placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 border-0 text-lg"
                    size="lg"
                  >
                    Register as Organizer
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Already have an account?{' '}
                <a 
                  href="/login" 
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-all duration-200 hover:underline hover:scale-105 inline-block transform"
                >
                  Sign in here
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
