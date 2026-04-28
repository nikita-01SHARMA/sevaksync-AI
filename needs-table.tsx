"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
import { communityNeeds as initialNeeds, areas, needTypes, type Need } from "@/lib/data"
import { cn } from "@/lib/utils"
import { Plus, Filter, Download, FileText, Printer, X } from "lucide-react"
import { toast } from "sonner"

const severityColors: Record<Need["severity"], string> = {
  Critical: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
  High: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
  Medium: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20",
  Low: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
}

const statusColors: Record<Need["status"], string> = {
  Open: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  "In Progress": "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
  Resolved: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
}

interface NeedsTableProps {
  limit?: number
  showHeader?: boolean
  showActions?: boolean
  onDataChange?: (needs: Need[]) => void
}

export function NeedsTable({ limit, showHeader = true, showActions = false, onDataChange }: NeedsTableProps) {
  const [needs, setNeeds] = useState<Need[]>(initialNeeds)
  const [filteredNeeds, setFilteredNeeds] = useState<Need[]>(initialNeeds)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isAddOpen, setIsAddOpen] = useState(false)
  
  // Filter states
  const [filterArea, setFilterArea] = useState<string>("all")
  const [filterType, setFilterType] = useState<string>("all")
  const [filterSeverity, setFilterSeverity] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  
  // New need form state
  const [newNeed, setNewNeed] = useState({
    area: "",
    need: "",
    type: "",
    severity: "Medium" as Need["severity"],
    status: "Open" as Need["status"],
    description: "",
  })

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("sevaksync_needs")
    if (stored) {
      const parsedNeeds = JSON.parse(stored)
      setNeeds(parsedNeeds)
      setFilteredNeeds(parsedNeeds)
    }
  }, [])

  // Apply filters
  useEffect(() => {
    let result = [...needs]
    
    if (filterArea !== "all") {
      result = result.filter(n => n.area === filterArea)
    }
    if (filterType !== "all") {
      result = result.filter(n => n.type === filterType)
    }
    if (filterSeverity !== "all") {
      result = result.filter(n => n.severity === filterSeverity)
    }
    if (filterStatus !== "all") {
      result = result.filter(n => n.status === filterStatus)
    }
    
    setFilteredNeeds(result)
  }, [needs, filterArea, filterType, filterSeverity, filterStatus])

  const saveToLocalStorage = (data: Need[]) => {
    localStorage.setItem("sevaksync_needs", JSON.stringify(data))
    onDataChange?.(data)
  }

  const handleAddNeed = () => {
    if (!newNeed.area || !newNeed.need || !newNeed.type) {
      toast.error("Please fill all required fields")
      return
    }

    const need: Need = {
      id: `N${String(needs.length + 1).padStart(3, "0")}`,
      area: newNeed.area,
      need: newNeed.need,
      type: newNeed.type,
      severity: newNeed.severity,
      status: newNeed.status,
      description: newNeed.description,
      createdAt: new Date().toISOString().split("T")[0],
    }

    const updatedNeeds = [need, ...needs]
    setNeeds(updatedNeeds)
    saveToLocalStorage(updatedNeeds)
    
    setNewNeed({
      area: "",
      need: "",
      type: "",
      severity: "Medium",
      status: "Open",
      description: "",
    })
    setIsAddOpen(false)
    toast.success("Need added successfully!")
  }

  const clearFilters = () => {
    setFilterArea("all")
    setFilterType("all")
    setFilterSeverity("all")
    setFilterStatus("all")
    setIsFilterOpen(false)
  }

  const exportToCSV = () => {
    const headers = ["ID", "Area", "Need", "Type", "Severity", "Status", "Created At"]
    const csvContent = [
      headers.join(","),
      ...filteredNeeds.map(n => 
        [n.id, n.area, n.need, n.type, n.severity, n.status, n.createdAt].join(",")
      )
    ].join("\n")
    
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "community_needs.csv"
    a.click()
    URL.revokeObjectURL(url)
    toast.success("Exported to CSV!")
  }

  const exportToPDF = () => {
    // Create a printable HTML content
    const printContent = `
      <html>
        <head>
          <title>Community Needs Report</title>
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
          <h1>SevakSync AI - Community Needs Report</h1>
          <p>Generated on: ${new Date().toLocaleDateString()}</p>
          <table>
            <tr>
              <th>ID</th><th>Area</th><th>Need</th><th>Severity</th><th>Status</th>
            </tr>
            ${filteredNeeds.map(n => `
              <tr>
                <td>${n.id}</td>
                <td>${n.area}</td>
                <td>${n.need}</td>
                <td>${n.severity}</td>
                <td>${n.status}</td>
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

  const handlePrint = () => {
    exportToPDF()
  }

  const displayData = limit ? filteredNeeds.slice(0, limit) : filteredNeeds
  const hasActiveFilters = filterArea !== "all" || filterType !== "all" || filterSeverity !== "all" || filterStatus !== "all"

  return (
    <>
      <Card>
        {showHeader && (
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-lg">Community Needs</CardTitle>
            {showActions && (
              <div className="flex gap-2">
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
                    <DropdownMenuItem onClick={handlePrint}>
                      <Printer className="mr-2 h-4 w-4" />
                      Print
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button size="sm" className="gap-2" onClick={() => setIsAddOpen(true)}>
                  <Plus className="h-4 w-4" />
                  Add Need
                </Button>
              </div>
            )}
          </CardHeader>
        )}
        <CardContent className={cn(!showHeader && "pt-6")}>
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">Area</TableHead>
                  <TableHead className="font-semibold">Need</TableHead>
                  <TableHead className="font-semibold">Severity</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                      No needs found matching your filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  displayData.map((need) => (
                    <TableRow key={need.id} className="hover:bg-muted/30">
                      <TableCell className="font-medium">{need.area}</TableCell>
                      <TableCell>{need.need}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={severityColors[need.severity]}>
                          {need.severity}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={statusColors[need.status]}>
                          {need.status}
                        </Badge>
                      </TableCell>
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
            <DialogTitle>Filter Needs</DialogTitle>
            <DialogDescription>
              Apply filters to narrow down the community needs list.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
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
              <Label htmlFor="filter-type">Type</Label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger id="filter-type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {needTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="filter-severity">Severity</Label>
              <Select value={filterSeverity} onValueChange={setFilterSeverity}>
                <SelectTrigger id="filter-severity">
                  <SelectValue placeholder="Select severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severities</SelectItem>
                  <SelectItem value="Critical">Critical</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="filter-status">Status</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger id="filter-status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Open">Open</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Resolved">Resolved</SelectItem>
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

      {/* Add Need Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add New Community Need</DialogTitle>
            <DialogDescription>
              Create a new community need request. Fill in all required fields.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="need-area">Area *</Label>
                <Select value={newNeed.area} onValueChange={(v) => setNewNeed({ ...newNeed, area: v })}>
                  <SelectTrigger id="need-area">
                    <SelectValue placeholder="Select area" />
                  </SelectTrigger>
                  <SelectContent>
                    {areas.map(area => (
                      <SelectItem key={area} value={area}>{area}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="need-type">Type *</Label>
                <Select value={newNeed.type} onValueChange={(v) => setNewNeed({ ...newNeed, type: v, need: v })}>
                  <SelectTrigger id="need-type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {needTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="need-title">Need Title *</Label>
              <Input
                id="need-title"
                value={newNeed.need}
                onChange={(e) => setNewNeed({ ...newNeed, need: e.target.value })}
                placeholder="Enter need title"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="need-severity">Severity</Label>
                <Select value={newNeed.severity} onValueChange={(v) => setNewNeed({ ...newNeed, severity: v as Need["severity"] })}>
                  <SelectTrigger id="need-severity">
                    <SelectValue placeholder="Select severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Critical">Critical</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="need-status">Status</Label>
                <Select value={newNeed.status} onValueChange={(v) => setNewNeed({ ...newNeed, status: v as Need["status"] })}>
                  <SelectTrigger id="need-status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Open">Open</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="need-description">Description</Label>
              <Textarea
                id="need-description"
                value={newNeed.description}
                onChange={(e) => setNewNeed({ ...newNeed, description: e.target.value })}
                placeholder="Enter detailed description..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
            <Button onClick={handleAddNeed}>Add Need</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
