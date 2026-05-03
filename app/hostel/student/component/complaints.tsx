"use client"
import { useState } from "react";
import { MessageSquare, Plus, Image as ImageIcon, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function StudentComplaints() {
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [time, setTime] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const activeComplaints = [
    {
      id: 1,
      title: "AC not working",
      category: "Room Utilities",
      description: "The air conditioner in my room has stopped working since yesterday.",
      status: "In Progress",
      submittedAt: "March 15, 2026 - 10:30 AM",
      image: null,
      adminReply: "Maintenance team has been notified. They will visit your room tomorrow.",
    },
    {
      id: 2,
      title: "Water leakage in bathroom",
      category: "Room Utilities",
      description: "There is water leakage from the bathroom ceiling.",
      status: "Pending",
      submittedAt: "March 17, 2026 - 08:00 AM",
      image: null,
      adminReply: null,
    },
  ];

  const resolvedComplaints = [
    {
      id: 3,
      title: "Broken window pane",
      category: "Room Utilities",
      description: "Window glass was cracked and needed replacement.",
      status: "Resolved",
      submittedAt: "March 10, 2026 - 02:00 PM",
      resolvedAt: "March 12, 2026 - 04:30 PM",
      image: null,
      adminReply: "Window has been replaced. Please verify.",
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || !description) {
      toast.error("Please fill all required fields");
      return;
    }
    
    toast.success("Complaint submitted successfully");
    setCategory("");
    setDescription("");
    setTime("");
    setImageFile(null);
    setIsDialogOpen(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const ComplaintCard = ({ complaint, isResolved = false }: any) => (
    <Card className="border-slate-200">
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-base">{complaint.title}</CardTitle>
          <span className={`text-xs px-2.5 py-1 rounded-full flex-shrink-0 ${
            complaint.status === "Resolved" 
              ? "bg-green-100 text-green-700" 
              : complaint.status === "In Progress"
              ? "bg-blue-100 text-blue-700"
              : "bg-yellow-100 text-yellow-700"
          }`}>
            {complaint.status}
          </span>
        </div>
        <p className="text-sm text-slate-600 mt-1">{complaint.category}</p>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-slate-700">{complaint.description}</p>
        
        <div className="flex items-center text-xs text-slate-500">
          <Clock className="w-3.5 h-3.5 mr-1.5" />
          Submitted: {complaint.submittedAt}
        </div>
        
        {isResolved && complaint.resolvedAt && (
          <div className="flex items-center text-xs text-green-600">
            <CheckCircle className="w-3.5 h-3.5 mr-1.5" />
            Resolved: {complaint.resolvedAt}
          </div>
        )}
        
        {complaint.adminReply && (
          <div className="mt-3 p-3 bg-blue-50 border border-blue-100 rounded-lg">
            <p className="text-xs font-medium text-blue-900 mb-1">Admin Reply:</p>
            <p className="text-sm text-blue-800">{complaint.adminReply}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Complaints</h1>
          <p className="text-slate-600 mt-1">Manage and track your complaints</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Raise Complaint
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white/95 backdrop-blur-md z-50">
            <DialogHeader>
              <DialogTitle>Raise a Complaint</DialogTitle>
              <DialogDescription>
                Fill in the details to submit your complaint
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="backdrop-blur-md z-50">
                    <SelectItem value="mess">Mess</SelectItem>
                    <SelectItem value="room-utilities">Room Utilities</SelectItem>
                    <SelectItem value="common-issues">Common Issues</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your complaint in detail..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="time">Time (Optional)</Label>
                <Input
                  id="time"
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="image">Upload Image (Optional)</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="cursor-pointer"
                  />
                  {imageFile && (
                    <ImageIcon className="w-5 h-5 text-green-600" />
                  )}
                </div>
                {imageFile && (
                  <p className="text-xs text-slate-600">{imageFile.name}</p>
                )}
              </div>
              
              <div className="flex gap-2 pt-2">
                <Button type="submit" className="flex-1">Submit Complaint</Button>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="active">
            <AlertCircle className="w-4 h-4 mr-2" />
            Active ({activeComplaints.length})
          </TabsTrigger>
          <TabsTrigger value="resolved">
            <CheckCircle className="w-4 h-4 mr-2" />
            Resolved ({resolvedComplaints.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="active" className="mt-6 space-y-4">
          {activeComplaints.length > 0 ? (
            activeComplaints.map((complaint) => (
              <ComplaintCard key={complaint.id} complaint={complaint} />
            ))
          ) : (
            <Card className="border-slate-200">
              <CardContent className="text-center py-12">
                <MessageSquare className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <p className="text-slate-600">No active complaints</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="resolved" className="mt-6 space-y-4">
          {resolvedComplaints.length > 0 ? (
            resolvedComplaints.map((complaint) => (
              <ComplaintCard key={complaint.id} complaint={complaint} isResolved />
            ))
          ) : (
            <Card className="border-slate-200">
              <CardContent className="text-center py-12">
                <CheckCircle className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <p className="text-slate-600">No resolved complaints</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
