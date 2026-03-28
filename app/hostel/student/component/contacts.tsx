"use client"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, Mail, MessageCircle, User } from "lucide-react";

export default function StudentContacts() {
  const hostelContacts = [
    {
      name: "Dr. Rajesh Kumar",
      role: "Warden",
      phone: "+91 98765 43210",
      email: "warden.ganga@university.edu",
    },
    {
      name: "Mr. Suresh Patel",
      role: "Assistant Warden",
      phone: "+91 98765 43211",
      email: "asst.warden@university.edu",
    },
    {
      name: "Mr. Anil Sharma",
      role: "Hall Assistant",
      phone: "+91 98765 43212",
      email: "hall.assistant@university.edu",
    },
  ];

  const emergencyContacts = [
    {
      name: "Ambulance",
      phone: "102",
      icon: "🚑",
      color: "bg-red-50 border-red-200",
    },
    {
      name: "Police",
      phone: "100",
      icon: "🚓",
      color: "bg-blue-50 border-blue-200",
    },
    {
      name: "Fire Service",
      phone: "101",
      icon: "🚒",
      color: "bg-orange-50 border-orange-200",
    },
  ];

  const handleCall = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  const handleEmail = (email: string) => {
    window.location.href = `mailto:${email}`;
  };

  const handleWhatsApp = (phone: string) => {
    window.open(`https://wa.me/${phone.replace(/[^0-9]/g, '')}`, '_blank');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Emergency Contacts</h1>
        <p className="text-slate-600 mt-1">Quick access to important contacts</p>
      </div>

      {/* Emergency Services */}
      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Emergency Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {emergencyContacts.map((contact) => (
            <Card key={contact.name} className={`border ${contact.color}`}>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-4xl mb-3">{contact.icon}</div>
                  <h3 className="font-semibold text-slate-900 mb-2">{contact.name}</h3>
                  <p className="text-2xl font-bold text-slate-900 mb-4">{contact.phone}</p>
                  <Button 
                    onClick={() => handleCall(contact.phone)} 
                    className="w-full"
                    size="sm"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Call Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Hostel Staff */}
      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Hostel Staff</h2>
        <div className="space-y-4">
          {hostelContacts.map((contact) => (
            <Card key={contact.email} className="border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center text-base">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mr-3">
                    <User className="w-6 h-6 text-slate-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">{contact.name}</div>
                    <div className="text-sm text-slate-600 font-normal">{contact.role}</div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button 
                    onClick={() => handleCall(contact.phone)} 
                    variant="outline"
                    className="flex-1"
                    size="sm"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    {contact.phone}
                  </Button>
                  <Button 
                    onClick={() => handleEmail(contact.email)} 
                    variant="outline"
                    className="flex-1"
                    size="sm"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Email
                  </Button>
                  <Button 
                    onClick={() => handleWhatsApp(contact.phone)} 
                    variant="outline"
                    className="flex-1"
                    size="sm"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    WhatsApp
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Help Information */}
      <Card className="border-slate-200 bg-slate-50">
        <CardHeader>
          <CardTitle className="text-base">Need Help?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-700">
            For any emergency, you can contact the warden directly or call the relevant emergency service. 
            The hostel office is open from 9:00 AM to 6:00 PM on weekdays.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
