"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Sparkles, ArrowLeft, Eye, EyeOff, CheckCircle } from "lucide-react"
import { toast } from "sonner"
import { areas, skills, type Volunteer } from "@/lib/data"

export default function SignupPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    skill: "",
    area: "",
    role: "volunteer" as "volunteer" | "admin",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (step === 1) {
      if (!formData.name || !formData.email || !formData.password) {
        toast.error("Please fill all required fields")
        return
      }
      if (formData.password !== formData.confirmPassword) {
        toast.error("Passwords do not match")
        return
      }
      if (formData.password.length < 6) {
        toast.error("Password must be at least 6 characters")
        return
      }
      setStep(2)
      return
    }

    if (formData.role === "volunteer" && (!formData.skill || !formData.area)) {
      toast.error("Please select your skill and area")
      return
    }

    setIsLoading(true)

    // Simulate signup
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Save user to localStorage for demo purposes
    const user = {
      id: `V${Date.now()}`,
      name: formData.name,
      email: formData.email,
      phone: formData.phone || "+91 00000 00000",
      skill: formData.skill,
      area: formData.area,
      role: formData.role,
      availability: "Available" as const,
      tasksCompleted: 0,
      averageRating: 0,
      reliability: 100,
      lastActive: new Date().toISOString().split("T")[0],
      joinedAt: new Date().toISOString().split("T")[0],
    }

    localStorage.setItem("sevaksync_current_user", JSON.stringify(user))

    // If volunteer, add to volunteers list
    if (formData.role === "volunteer") {
      const existingVolunteers = JSON.parse(localStorage.getItem("sevaksync_volunteers") || "[]")
      existingVolunteers.unshift(user)
      localStorage.setItem("sevaksync_volunteers", JSON.stringify(existingVolunteers))
    }

    toast.success("Account created successfully!", {
      description: "Welcome to SevakSync AI!",
    })

    setIsLoading(false)
    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <Card className="border-primary/10 shadow-xl">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary shadow-lg">
              <Sparkles className="h-7 w-7 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl">Create Account</CardTitle>
            <CardDescription>
              {step === 1 ? "Enter your personal details" : "Complete your profile"}
            </CardDescription>
            
            {/* Step Indicator */}
            <div className="flex justify-center gap-2 mt-4">
              <div className={`h-2 w-16 rounded-full ${step >= 1 ? "bg-primary" : "bg-muted"}`} />
              <div className={`h-2 w-16 rounded-full ${step >= 2 ? "bg-primary" : "bg-muted"}`} />
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {step === 1 ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Min 6 characters"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                        className="h-11 pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-11 w-11 text-muted-foreground hover:text-foreground"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      required
                      className="h-11"
                    />
                  </div>
                  <Button type="submit" className="w-full h-11">
                    Continue
                  </Button>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="role">I want to join as</Label>
                    <Select 
                      value={formData.role} 
                      onValueChange={(value: "volunteer" | "admin") => setFormData({ ...formData, role: value })}
                    >
                      <SelectTrigger id="role" className="h-11">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="volunteer">Volunteer</SelectItem>
                        <SelectItem value="admin">NGO Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {formData.role === "volunteer" && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+91 98765 43210"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="h-11"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="skill">Primary Skill</Label>
                        <Select 
                          value={formData.skill} 
                          onValueChange={(value) => setFormData({ ...formData, skill: value })}
                        >
                          <SelectTrigger id="skill" className="h-11">
                            <SelectValue placeholder="Select your skill" />
                          </SelectTrigger>
                          <SelectContent>
                            {skills.map((skill) => (
                              <SelectItem key={skill} value={skill}>
                                {skill}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="area">Preferred Area</Label>
                        <Select 
                          value={formData.area} 
                          onValueChange={(value) => setFormData({ ...formData, area: value })}
                        >
                          <SelectTrigger id="area" className="h-11">
                            <SelectValue placeholder="Select your area" />
                          </SelectTrigger>
                          <SelectContent>
                            {areas.map((area) => (
                              <SelectItem key={area} value={area}>
                                {area}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  )}

                  <div className="flex gap-3">
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="flex-1 h-11"
                      onClick={() => setStep(1)}
                    >
                      Back
                    </Button>
                    <Button type="submit" className="flex-1 h-11" disabled={isLoading}>
                      {isLoading ? "Creating Account..." : "Create Account"}
                    </Button>
                  </div>
                </>
              )}
            </form>

            {step === 1 && (
              <>
                <div className="mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card px-2 text-muted-foreground">Benefits</span>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Track your volunteer contributions</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Get AI-matched to relevant tasks</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Earn recognition and reviews</span>
                    </div>
                  </div>
                </div>
              </>
            )}

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
