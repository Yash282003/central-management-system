"use client"
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Save, Camera } from "lucide-react";
import { toast } from "sonner";

export default function StudentProfile() {
  const [isEditing, setIsEditing] = useState(false);
  
  // Non-editable fields
  const [name] = useState("Rahul Sharma");
  const [regNo] = useState("21BCE1234");
  const [room] = useState("A-204");
  
  // Editable fields
  const [branch, setBranch] = useState("Computer Science Engineering");
  const [phone, setPhone] = useState("+91 98765 43210");
  const [email, setEmail] = useState("rahul.sharma@university.edu");
  const [parentName, setParentName] = useState("Mr. Vijay Sharma");
  const [parentPhone, setParentPhone] = useState("+91 98765 43200");
  const [address, setAddress] = useState("123, Main Street, Delhi - 110001");
  const [emergencyContact, setEmergencyContact] = useState("+91 98765 43201");
  const [emergencyContactName, setEmergencyContactName] = useState("Mrs. Priya Sharma");

  const handleSave = () => {
    toast.success("Profile updated successfully");
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Profile</h1>
          <p className="text-slate-600 mt-1">Manage your personal information</p>
        </div>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)}>
            Edit Profile
          </Button>
        )}
      </div>

      {/* Profile Photo */}
      <Card className="border-slate-200">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center">
                <User className="w-12 h-12 text-slate-400" />
              </div>
              {isEditing && (
                <button className="absolute bottom-0 right-0 w-8 h-8 bg-slate-900 rounded-full flex items-center justify-center text-white hover:bg-slate-800">
                  <Camera className="w-4 h-4" />
                </button>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">{name}</h3>
              <p className="text-sm text-slate-600">{regNo}</p>
              <p className="text-sm text-slate-600">Room: {room}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Basic Information */}
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input value={name} disabled className="bg-slate-50" />
              <p className="text-xs text-slate-500">This field cannot be edited</p>
            </div>
            <div className="space-y-2">
              <Label>Registration Number</Label>
              <Input value={regNo} disabled className="bg-slate-50" />
              <p className="text-xs text-slate-500">This field cannot be edited</p>
            </div>
            <div className="space-y-2">
              <Label>Room Number</Label>
              <Input value={room} disabled className="bg-slate-50" />
              <p className="text-xs text-slate-500">This field cannot be edited</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="branch">Branch</Label>
              <Input
                id="branch"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                disabled={!isEditing}
                className={!isEditing ? "bg-slate-50" : ""}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={!isEditing}
                className={!isEditing ? "bg-slate-50" : ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={!isEditing}
                className={!isEditing ? "bg-slate-50" : ""}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              disabled={!isEditing}
              className={!isEditing ? "bg-slate-50" : ""}
            />
          </div>
        </CardContent>
      </Card>

      {/* Parent Information */}
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle>Parent/Guardian Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="parentName">Parent/Guardian Name</Label>
              <Input
                id="parentName"
                value={parentName}
                onChange={(e) => setParentName(e.target.value)}
                disabled={!isEditing}
                className={!isEditing ? "bg-slate-50" : ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="parentPhone">Parent/Guardian Phone</Label>
              <Input
                id="parentPhone"
                value={parentPhone}
                onChange={(e) => setParentPhone(e.target.value)}
                disabled={!isEditing}
                className={!isEditing ? "bg-slate-50" : ""}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Emergency Contact */}
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle>Emergency Contact</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="emergencyContactName">Emergency Contact Name</Label>
              <Input
                id="emergencyContactName"
                value={emergencyContactName}
                onChange={(e) => setEmergencyContactName(e.target.value)}
                disabled={!isEditing}
                className={!isEditing ? "bg-slate-50" : ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="emergencyContact">Emergency Contact Number</Label>
              <Input
                id="emergencyContact"
                value={emergencyContact}
                onChange={(e) => setEmergencyContact(e.target.value)}
                disabled={!isEditing}
                className={!isEditing ? "bg-slate-50" : ""}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {isEditing && (
        <div className="flex gap-3">
          <Button onClick={handleSave} className="flex-1 md:flex-none">
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
          <Button onClick={handleCancel} variant="outline" className="flex-1 md:flex-none">
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
}
