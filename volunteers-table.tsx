"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  volunteers as initialVolunteers, 
  communityNeeds, 
  skillNeedMapping, 
  areas, 
  skills,
  taskHistory as initialTaskHistory,
  reviews as initialReviews,
  type Volunteer,
  type TaskHistory,
  type Review,
} from "@/lib/data"
import { cn } from "@/lib/utils"
import { 
  Sparkles, 
  CheckCircle, 
  Filter, 
  Download, 
  UserPlus, 
  FileText, 
  Printer, 
  X, 
  Star, 
  Clock,
  User,
  Eye,
  MapPin,
} from "lucide-react"
import { DistanceCalculator } from "./distance-calculator"
import { toast } from "sonner"

const availabilityColors: Record<Volunteer["availability"], string> = {
  Available: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
  Busy: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20",
  "On Leave": "bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20",
}

interface VolunteersTableProps {
  limit?: number
  showHeader?: boolean
  showAutoAssign?: boolean
  showActions?: boolean
  onDataChange?: (volunteers: Volunteer[]) => void
}

export function VolunteersTable({ 
  limit, 
  showHeader = true, 
  showAutoAssign = false,
  showActions = false,
  onDataChange,
}: VolunteersTableProps) {
  const [volunteers, setVolunteers] = useState<Volunteer[]>(initialVolunteers)
  const [filteredVolunteers, setFilteredVolunteers] = useState<Volunteer[]>(initialVolunteers)
  const [taskHistory, setTaskHistory] = useState<TaskHistory[]>(initialTaskHistory)
  const [reviews, setReviews] = useState<Review[]>(initialReviews)
  const [assignments, setAssignments] = useState<Record<string, string>>({})
  const [isAssigning, setIsAssigning] = useState(false)
  
  // Modal states
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [isReviewOpen, setIsReviewOpen] = useState(false)
  const [isDistanceOpen, setIsDistanceOpen] = useState(false)
  const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(null)
  
  // Filter states
  const [filterSkill, setFilterSkill] = useState<string>("all")
  const [filterArea, setFilterArea] = useState<string>("all")
  const [filterAvailability, setFilterAvailability] = useState<string>("all")
  const [filterRating, setFilterRating] = useState<string>("all")
  
  // New volunteer form state
  const [newVolunteer, setNewVolunteer] = useState({
    name: "",
    email: "",
    phone: "",
    skill: "",
    area: "",
    availability: "Available" as Volunteer["availability"],
  })
  
  // New review form state
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: "",
    reviewerName: "",
  })

  // Load from localStorage on mount
  useEffect(() => {
    const storedVolunteers = localStorage.getItem("sevaksync_volunteers")
    const storedHistory = localStorage.getItem("sevaksync_task_history")
    const storedReviews = localStorage.getItem("sevaksync_reviews")
    
    if (storedVolunteers) {
      const parsed = JSON.parse(storedVolunteers)
      setVolunteers(parsed)
      setFilteredVolunteers(parsed)
    }
    if (storedHistory) {
      setTaskHistory(JSON.parse(storedHistory))
    }
    if (storedReviews) {
      setReviews(JSON.parse(storedReviews))
    }
  }, [])

  // Apply filters
  useEffect(() => {
    let result = [...volunteers]
    
    if (filterSkill !== "all") {
      result = result.filter(v => v.skill === filterSkill)
    }
    if (filterArea !== "all") {
      result = result.filter(v => v.area === filterArea)
    }
    if (filterAvailability !== "all") {
      result = result.filter(v => v.availability === filterAvailability)
    }
    if (filterRating !== "all") {
      const minRating = parseFloat(filterRating)
      result = result.filter(v => v.averageRating >= minRating)
    }
    
    setFilteredVolunteers(result)
  }, [volunteers, filterSkill, filterArea, filterAvailability, filterRating])

  const saveVolunteersToLocalStorage = (data: Volunteer[]) => {
    localStorage.setItem("sevaksync_volunteers", JSON.stringify(data))
    onDataChange?.(data)
  }

  const saveReviewsToLocalStorage = (data: Review[]) => {
    localStorage.setItem("sevaksync_reviews", JSON.stringify(data))
  }

  const handleAutoAssign = () => {
    setIsAssigning(true)
    
    setTimeout(() => {
      const newAssignments: Record<string, string> = {}
      const openNeeds = communityNeeds.filter(n => n.status === "Open")
      const availableVolunteers = volunteers.filter(v => v.availability === "Available")
      
      availableVolunteers.forEach(volunteer => {
        const matchingNeeds = skillNeedMapping[volunteer.skill] || []
        const matchedNeed = openNeeds.find(
          need => matchingNeeds.includes(need.need) && 
                 (need.area === volunteer.area || !newAssignments[need.id])
        )
        
        if (matchedNeed && !Object.values(newAssignments).includes(matchedNeed.id)) {
          newAssignments[volunteer.id] = matchedNeed.need
        }
      })
      
      setAssignments(newAssignments)
      setIsAssigning(false)
      toast.success("Smart assignment complete!", {
        description: `${Object.keys(newAssignments).length} volunteers matched to needs.`
      })
    }, 1500)
  }

  const handleAddVolunteer = () => {
    if (!newVolunteer.name || !newVolunteer.email || !newVolunteer.skill || !newVolunteer.area) {
      toast.error("Please fill all required fields")
      return
    }

    const volunteer: Volunteer = {
      id: `V${String(volunteers.length + 1).padStart(3, "0")}`,
      name: newVolunteer.name,
      email: newVolunteer.email,
      phone: newVolunteer.phone || "+91 00000 00000",
      skill: newVolunteer.skill,
      area: newVolunteer.area,
      availability: newVolunteer.availability,
      tasksCompleted: 0,
      averageRating: 0,
      reliability: 100,
      lastActive: new Date().toISOString().split("T")[0],
      joinedAt: new Date().toISOString().split("T")[0],
    }

    const updatedVolunteers = [volunteer, ...volunteers]
    setVolunteers(updatedVolunteers)
    saveVolunteersToLocalStorage(updatedVolunteers)
    
    setNewVolunteer({
      name: "",
      email: "",
      phone: "",
      skill: "",
      area: "",
      availability: "Available",
    })
    setIsAddOpen(false)
    toast.success("Volunteer added successfully!")
  }

  const handleAddReview = () => {
    if (!selectedVolunteer || !newReview.comment || !newReview.reviewerName) {
      toast.error("Please fill all required fields")
      return
    }

    const review: Review = {
      id: `R${String(reviews.length + 1).padStart(3, "0")}`,
      volunteerId: selectedVolunteer.id,
      rating: newReview.rating,
      comment: newReview.comment,
      reviewerName: newReview.reviewerName,
      createdAt: new Date().toISOString().split("T")[0],
    }

    const updatedReviews = [review, ...reviews]
    setReviews(updatedReviews)
    saveReviewsToLocalStorage(updatedReviews)
    
    // Update volunteer's average rating
    const volunteerReviews = updatedReviews.filter(r => r.volunteerId === selectedVolunteer.id)
    const avgRating = volunteerReviews.reduce((sum, r) => sum + r.rating, 0) / volunteerReviews.length
    
    const updatedVolunteers = volunteers.map(v => 
      v.id === selectedVolunteer.id ? { ...v, averageRating: Math.round(avgRating * 10) / 10 } : v
    )
    setVolunteers(updatedVolunteers)
    saveVolunteersToLocalStorage(updatedVolunteers)
    
    setNewReview({ rating: 5, comment: "", reviewerName: "" })
    setIsReviewOpen(false)
    toast.success("Review added successfully!")
  }

  const clearFilters = () => {
    setFilterSkill("all")
    setFilterArea("all")
    setFilterAvailability("all")
    setFilterRating("all")
    setIsFilterOpen(false)
  }

  const exportToCSV = () => {
    const headers = ["ID", "Name", "Email", "Skill", "Area", "Availability", "Tasks Completed", "Rating", "Reliability"]
    const csvContent = [
      headers.join(","),
      ...filteredVolunteers.map(v => 
        [v.id, v.name, v.email, v.skill, v.area, v.availability, v.tasksCompleted, v.averageRating, v.reliability].join(",")
      )
    ].join("\n")
    
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "volunteers.csv"
    a.click()
    URL.revokeObjectURL(url)
    toast.success("Exported to CSV!")
  }

  const exportToPDF = () => {
    const printContent = `
      <html>
        <head>
          <title>Volunteers Report</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { color: #1e40af; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #1e40af; color: white; }
            tr:nth-child(even) { background-color: #f9f9f9; }
          </style>
        </head>
        <body>
          <h1>SevakSync AI - Volunteers Report</h1>
          <p>Generated on: ${new Date().toLocaleDateString()}</p>
          <table>
            <tr>
              <th>Name</th><th>Skill</th><th>Area</th><th>Availability</th><th>Rating</th>
            </tr>
            ${filteredVolunteers.map(v => `
              <tr>
                <td>${v.name}</td>
                <td>${v.skill}</td>
                <td>${v.area}</td>
                <td>${v.availability}</td>
                <td>${v.averageRating}/5</td>
              </tr>
            `).join("")}
          </table>
        </body>
      </html>
    `
    
    const printWindow = window.open("", "_blank")
    if (printWindow) {
      printWindow.document.write(printContent)
      printWindow.document.close()
      printWindow.print()
    }
    toast.success("PDF generated!")
  }

  const openVolunteerDetails = (volunteer: Volunteer) => {
    setSelectedVolunteer(volunteer)
    setIsViewOpen(true)
  }

  const openReviewModal = (volunteer: Volunteer) => {
    setSelectedVolunteer(volunteer)
    setNewReview({ rating: 5, comment: "", reviewerName: "" })
    setIsReviewOpen(true)
  }

  const getVolunteerHistory = (volunteerId: string) => {
    return taskHistory.filter(t => t.volunteerId === volunteerId)
  }

  const getVolunteerReviews = (volunteerId: string) => {
    return reviews.filter(r => r.volunteerId === volunteerId)
  }

  const renderStars = (rating: number, interactive = false, onChange?: (r: number) => void) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              "h-5 w-5",
              star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300",
              interactive && "cursor-pointer hover:scale-110 transition-transform"
            )}
            onClick={() => interactive && onChange?.(star)}
          />
        ))}
      </div>
    )
  }

  const displayData = limit ? filteredVolunteers.slice(0, limit) : filteredVolunteers
  const hasActiveFilters = filterSkill !== "all" || filterArea !== "all" || filterAvailability !== "all" || filterRating !== "all"

  return (
    <>
      <Card>
        {showHeader && (
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-lg">Volunteers</CardTitle>
            <div className="flex gap-2">
              {showActions && (
                <>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="gap-2"
                    onClick={() => setIsFilterOpen(true)}
                  >
                    <Filter className="h-4 w-4" />
                    Filter
                    {hasActiveFilters && (
                      <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 text-xs">
                        !
                      </Badge>
                    )}
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Download className="h-4 w-4" />
                        Export
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={exportToCSV}>
                        <FileText className="mr-2 h-4 w-4" />
                        Export as CSV
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={exportToPDF}>
                        <FileText className="mr-2 h-4 w-4" />
                        Export as PDF
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={exportToPDF}>
                        <Printer className="mr-2 h-4 w-4" />
                        Print
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button size="sm" className="gap-2" onClick={() => setIsAddOpen(true)}>
                    <UserPlus className="h-4 w-4" />
                    Add Volunteer
                  </Button>
                </>
              )}
              {showAutoAssign && (
                <Button
                  onClick={handleAutoAssign}
                  disabled={isAssigning}
                  className="gap-2"
                >
                  <Sparkles className="h-4 w-4" />
                  {isAssigning ? "Matching..." : "Smart Auto Assign"}
                </Button>
              )}
            </div>
          </CardHeader>
        )}
        <CardContent className={cn(!showHeader && "pt-6")}>
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">Name</TableHead>
                  <TableHead className="font-semibold">Skill</TableHead>
                  <TableHead className="font-semibold">Area</TableHead>
                  <TableHead className="font-semibold">Availability</TableHead>
                  <TableHead className="font-semibold">Rating</TableHead>
                  {showAutoAssign && (
                    <TableHead className="font-semibold">Assignment</TableHead>
                  )}
                  {showActions && (
                    <TableHead className="font-semibold text-right">Actions</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={showAutoAssign ? 6 : showActions ? 6 : 5} className="text-center text-muted-foreground py-8">
                      No volunteers found matching your filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  displayData.map((volunteer) => (
                    <TableRow key={volunteer.id} className="hover:bg-muted/30">
                      <TableCell className="font-medium">{volunteer.name}</TableCell>
                      <TableCell>{volunteer.skill}</TableCell>
                      <TableCell>{volunteer.area}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={availabilityColors[volunteer.availability]}>
                          {volunteer.availability}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span>{volunteer.averageRating.toFixed(1)}</span>
                        </div>
                      </TableCell>
                      {showAutoAssign && (
                        <TableCell>
                          {assignments[volunteer.id] ? (
                            <div className="flex items-center gap-1.5 text-sm text-green-600 dark:text-green-400">
                              <CheckCircle className="h-4 w-4" />
                              {assignments[volunteer.id]}
                            </div>
                          ) : (
                            <span className="text-sm text-muted-foreground">-</span>
                          )}
                        </TableCell>
                      )}
                      {showActions && (
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => openVolunteerDetails(volunteer)}
                              title="View Details"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => {
                                setSelectedVolunteer(volunteer)
                                setIsDistanceOpen(true)
                              }}
                              title="Calculate Distance"
                            >
                              <MapPin className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => openReviewModal(volunteer)}
                              title="Add Review"
                            >
                              <Star className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Filter Dialog */}
      <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Filter Volunteers</DialogTitle>
            <DialogDescription>
              Apply filters to narrow down the volunteers list.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="filter-skill">Skill</Label>
              <Select value={filterSkill} onValueChange={setFilterSkill}>
                <SelectTrigger id="filter-skill">
                  <SelectValue placeholder="Select skill" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Skills</SelectItem>
                  {skills.map(skill => (
                    <SelectItem key={skill} value={skill}>{skill}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="filter-area">Area</Label>
              <Select value={filterArea} onValueChange={setFilterArea}>
                <SelectTrigger id="filter-area">
                  <SelectValue placeholder="Select area" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Areas</SelectItem>
                  {areas.map(area => (
                    <SelectItem key={area} value={area}>{area}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="filter-availability">Availability</Label>
              <Select value={filterAvailability} onValueChange={setFilterAvailability}>
                <SelectTrigger id="filter-availability">
                  <SelectValue placeholder="Select availability" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="Available">Available</SelectItem>
                  <SelectItem value="Busy">Busy</SelectItem>
                  <SelectItem value="On Leave">On Leave</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="filter-rating">Minimum Rating</Label>
              <Select value={filterRating} onValueChange={setFilterRating}>
                <SelectTrigger id="filter-rating">
                  <SelectValue placeholder="Select minimum rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any Rating</SelectItem>
                  <SelectItem value="4.5">4.5+ Stars</SelectItem>
                  <SelectItem value="4">4+ Stars</SelectItem>
                  <SelectItem value="3.5">3.5+ Stars</SelectItem>
                  <SelectItem value="3">3+ Stars</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={clearFilters}>
              <X className="mr-2 h-4 w-4" />
              Clear Filters
            </Button>
            <Button onClick={() => setIsFilterOpen(false)}>Apply Filters</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Volunteer Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add New Volunteer</DialogTitle>
            <DialogDescription>
              Register a new volunteer. Fill in all required fields.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="vol-name">Full Name *</Label>
                <Input
                  id="vol-name"
                  value={newVolunteer.name}
                  onChange={(e) => setNewVolunteer({ ...newVolunteer, name: e.target.value })}
                  placeholder="Enter full name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="vol-email">Email *</Label>
                <Input
                  id="vol-email"
                  type="email"
                  value={newVolunteer.email}
                  onChange={(e) => setNewVolunteer({ ...newVolunteer, email: e.target.value })}
                  placeholder="email@example.com"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="vol-phone">Phone</Label>
                <Input
                  id="vol-phone"
                  value={newVolunteer.phone}
                  onChange={(e) => setNewVolunteer({ ...newVolunteer, phone: e.target.value })}
                  placeholder="+91 00000 00000"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="vol-availability">Availability</Label>
                <Select 
                  value={newVolunteer.availability} 
                  onValueChange={(v) => setNewVolunteer({ ...newVolunteer, availability: v as Volunteer["availability"] })}
                >
                  <SelectTrigger id="vol-availability">
                    <SelectValue placeholder="Select availability" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Available">Available</SelectItem>
                    <SelectItem value="Busy">Busy</SelectItem>
                    <SelectItem value="On Leave">On Leave</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="vol-skill">Skill *</Label>
                <Select value={newVolunteer.skill} onValueChange={(v) => setNewVolunteer({ ...newVolunteer, skill: v })}>
                  <SelectTrigger id="vol-skill">
                    <SelectValue placeholder="Select skill" />
                  </SelectTrigger>
                  <SelectContent>
                    {skills.map(skill => (
                      <SelectItem key={skill} value={skill}>{skill}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="vol-area">Area *</Label>
                <Select value={newVolunteer.area} onValueChange={(v) => setNewVolunteer({ ...newVolunteer, area: v })}>
                  <SelectTrigger id="vol-area">
                    <SelectValue placeholder="Select area" />
                  </SelectTrigger>
                  <SelectContent>
                    {areas.map(area => (
                      <SelectItem key={area} value={area}>{area}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
            <Button onClick={handleAddVolunteer}>Add Volunteer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Volunteer Details Dialog with Tabs */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              {selectedVolunteer?.name}
            </DialogTitle>
            <DialogDescription>
              View volunteer profile, history, and reviews.
            </DialogDescription>
          </DialogHeader>
          
          {selectedVolunteer && (
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>
              
              <TabsContent value="profile" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{selectedVolunteer.email}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{selectedVolunteer.phone}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Skill</p>
                    <p className="font-medium">{selectedVolunteer.skill}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Area</p>
                    <p className="font-medium">{selectedVolunteer.area}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Availability</p>
                    <Badge variant="outline" className={availabilityColors[selectedVolunteer.availability]}>
                      {selectedVolunteer.availability}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Joined</p>
                    <p className="font-medium">{selectedVolunteer.joinedAt}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-4 gap-4 pt-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-2xl font-bold text-primary">{selectedVolunteer.tasksCompleted}</p>
                      <p className="text-sm text-muted-foreground">Tasks Done</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                        <span className="text-2xl font-bold">{selectedVolunteer.averageRating.toFixed(1)}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Avg Rating</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-2xl font-bold text-green-600">{selectedVolunteer.reliability}%</p>
                      <p className="text-sm text-muted-foreground">Reliability</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-sm font-bold">{selectedVolunteer.lastActive}</p>
                      <p className="text-sm text-muted-foreground">Last Active</p>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="space-y-2 pt-2">
                  <p className="text-sm text-muted-foreground">Reliability Score</p>
                  <Progress value={selectedVolunteer.reliability} className="h-2" />
                </div>
              </TabsContent>
              
              <TabsContent value="history" className="mt-4">
                <div className="space-y-3">
                  {getVolunteerHistory(selectedVolunteer.id).length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">No task history yet.</p>
                  ) : (
                    getVolunteerHistory(selectedVolunteer.id).map((task) => (
                      <Card key={task.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">{task.needTitle}</p>
                              <p className="text-sm text-muted-foreground">{task.area}</p>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center gap-1">
                                {task.rating && (
                                  <>
                                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                    <span>{task.rating}/5</span>
                                  </>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {task.completedAt}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="reviews" className="mt-4">
                <div className="space-y-3">
                  {getVolunteerReviews(selectedVolunteer.id).length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">No reviews yet.</p>
                  ) : (
                    getVolunteerReviews(selectedVolunteer.id).map((review) => (
                      <Card key={review.id}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="space-y-1">
                              {renderStars(review.rating)}
                              <p className="text-sm mt-2">{review.comment}</p>
                              <p className="text-xs text-muted-foreground">
                                - {review.reviewerName}
                              </p>
                            </div>
                            <p className="text-xs text-muted-foreground">{review.createdAt}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Review Dialog */}
      <Dialog open={isReviewOpen} onOpenChange={setIsReviewOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Review for {selectedVolunteer?.name}</DialogTitle>
            <DialogDescription>
              Rate and review this volunteer&apos;s performance.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Rating *</Label>
              {renderStars(newReview.rating, true, (r) => setNewReview({ ...newReview, rating: r }))}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="review-name">Your Name *</Label>
              <Input
                id="review-name"
                value={newReview.reviewerName}
                onChange={(e) => setNewReview({ ...newReview, reviewerName: e.target.value })}
                placeholder="Enter your name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="review-comment">Comment *</Label>
              <Textarea
                id="review-comment"
                value={newReview.comment}
                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                placeholder="Write your review..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReviewOpen(false)}>Cancel</Button>
            <Button onClick={handleAddReview}>Submit Review</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Distance Calculator Dialog */}
      <DistanceCalculator
        isOpen={isDistanceOpen}
        onClose={() => setIsDistanceOpen(false)}
        selectedVolunteer={selectedVolunteer}
      />
    </>
  )
}
