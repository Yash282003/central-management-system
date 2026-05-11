"use client"
import { 
  LayoutDashboard, 
  User, 
  Building2, 
  FileText, 
  Bell, 
  Award, 
  Settings,
  ThumbsUp,
  Heart,
  MessageSquare,
  Check
} from 'lucide-react';
import { useState } from 'react';
import DashboardLayout from '../../dashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import TnpNoticesPanel from './TnpNoticesPanel';

const notifications = [
  {
    id: 1,
    title: 'Google Recruitment Drive - Participation Required',
    message: 'Students interested in participating in Google placement drive must confirm their participation by March 15, 2026. Eligibility: CGPA ≥ 8.0, CSE/ECE only. Drive scheduled for March 25, 2026.',
    date: 'March 8, 2026',
    type: 'Participation',
    expiresAt: 'March 15, 2026',
    likes: 45,
    hearts: 23,
    comments: 8,
    hasResponded: false,
    branches: ['CSE', 'ECE']
  },
  {
    id: 2,
    title: 'Profile Completion Reminder',
    message: 'Dear students, please ensure your profile is 100% complete before March 12, 2026. Incomplete profiles will not be considered for upcoming placement drives. Update your academic details, skills, and upload required documents.',
    date: 'March 7, 2026',
    type: 'Announcement',
    likes: 32,
    hearts: 15,
    comments: 5,
    hasResponded: false,
    branches: ['All']
  },
  {
    id: 3,
    title: 'Microsoft Campus Drive - Registration Open',
    message: 'Registration is now open for Microsoft campus recruitment. Role: SDE, Package: 26 LPA. Eligibility: CGPA ≥ 7.5. Last date to register: March 18, 2026. Drive date: March 28, 2026.',
    date: 'March 6, 2026',
    type: 'Opportunity',
    likes: 67,
    hearts: 42,
    comments: 15,
    hasResponded: false,
    branches: ['CSE', 'IT', 'ECE']
  },
  {
    id: 4,
    title: 'TCS Placement Results Announced',
    message: 'Congratulations to all students selected in TCS campus recruitment. Selected candidates will receive offer letters by email within 3 business days. HR onboarding session scheduled for March 20, 2026.',
    date: 'March 5, 2026',
    type: 'Result',
    likes: 89,
    hearts: 156,
    comments: 34,
    hasResponded: false,
    branches: ['All']
  },
];

export default function StudentNotifications() {
  const [activeComments, setActiveComments] = useState<number | null>(null);
  const [commentText, setCommentText] = useState('');
  const [notifReactions, setNotifReactions] = useState(
    notifications.reduce((acc, n) => ({
      ...acc,
      [n.id]: { liked: false, hearted: false, ok: false }
    }), {} as Record<number, { liked: boolean; hearted: boolean; ok: boolean }>)
  );

  const toggleReaction = (notifId: number, type: 'liked' | 'hearted' | 'ok') => {
    setNotifReactions(prev => ({
      ...prev,
      [notifId]: {
        ...prev[notifId],
        [type]: !prev[notifId][type]
      }
    }));
  };

  const handleParticipationResponse = (notifId: number, response: 'yes' | 'no') => {
    console.log(`Response for notification ${notifId}: ${response}`);
    // Handle participation response
  };

  return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Notifications & Announcements</h1>
          <p className="text-gray-600 mt-1">Stay updated with placement drives and announcements</p>
        </div>

        {/* Real notices from TnP officer (badge suppressed on this page) */}
        <TnpNoticesPanel hideBadge />

        {/* Notifications List */}
        <div className="space-y-4">
          {notifications.map((notif) => (
            <Card key={notif.id} className="border-gray-200 hover:border-indigo-200 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900">{notif.title}</h3>
                      <Badge 
                        className={
                          notif.type === 'Participation' 
                            ? 'bg-purple-100 text-purple-700' 
                            : notif.type === 'Opportunity'
                            ? 'bg-blue-100 text-blue-700'
                            : notif.type === 'Result'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }
                      >
                        {notif.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{notif.message}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>{notif.date}</span>
                      {notif.expiresAt && (
                        <span className="text-red-600">Expires: {notif.expiresAt}</span>
                      )}
                      <div className="flex gap-1">
                        {notif.branches.map(branch => (
                          <Badge key={branch} variant="outline" className="text-xs">
                            {branch}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Participation Response Buttons */}
                {notif.type === 'Participation' && !notif.hasResponded && (
                  <div className="mb-4 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                    <p className="text-sm text-indigo-900 mb-3 font-medium">
                      Will you participate in this drive?
                    </p>
                    <div className="flex gap-3">
                      <Button 
                        size="sm"
                        onClick={() => handleParticipationResponse(notif.id, 'yes')}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Yes, I'm Interested
                      </Button>
                      <Button 
                        size="sm"
                        variant="outline"
                        onClick={() => handleParticipationResponse(notif.id, 'no')}
                        className="border-gray-300"
                      >
                        No, Not Interested
                      </Button>
                    </div>
                  </div>
                )}

                {/* Reactions */}
                <div className="flex items-center gap-6 pb-4 border-b border-gray-200">
                  <button 
                    onClick={() => toggleReaction(notif.id, 'liked')}
                    className={`flex items-center gap-2 text-sm transition-colors ${
                      notifReactions[notif.id]?.liked 
                        ? 'text-indigo-600 font-medium' 
                        : 'text-gray-600 hover:text-indigo-600'
                    }`}
                  >
                    <ThumbsUp className={`w-4 h-4 ${notifReactions[notif.id]?.liked ? 'fill-indigo-600' : ''}`} />
                    <span>{notif.likes + (notifReactions[notif.id]?.liked ? 1 : 0)}</span>
                  </button>
                  <button 
                    onClick={() => toggleReaction(notif.id, 'hearted')}
                    className={`flex items-center gap-2 text-sm transition-colors ${
                      notifReactions[notif.id]?.hearted 
                        ? 'text-red-600 font-medium' 
                        : 'text-gray-600 hover:text-red-600'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${notifReactions[notif.id]?.hearted ? 'fill-red-600' : ''}`} />
                    <span>{notif.hearts + (notifReactions[notif.id]?.hearted ? 1 : 0)}</span>
                  </button>
                  <button 
                    onClick={() => toggleReaction(notif.id, 'ok')}
                    className={`flex items-center gap-2 text-sm transition-colors ${
                      notifReactions[notif.id]?.ok 
                        ? 'text-green-600 font-medium' 
                        : 'text-gray-600 hover:text-green-600'
                    }`}
                  >
                    <Check className={`w-4 h-4`} />
                    <span>OK</span>
                  </button>
                  <button 
                    onClick={() => setActiveComments(activeComments === notif.id ? null : notif.id)}
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>{notif.comments}</span>
                  </button>
                </div>

                {/* Comments Section */}
                {activeComments === notif.id && (
                  <div className="mt-4 space-y-3">
                    <div className="space-y-2">
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm font-medium text-gray-900">Rahul Kumar</p>
                        <p className="text-sm text-gray-600">Great opportunity! When will the eligibility list be shared?</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm font-medium text-gray-900">Priya Sharma</p>
                        <p className="text-sm text-gray-600">Looking forward to this! All the best everyone.</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Textarea 
                        placeholder="Write a comment..." 
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        rows={2}
                        className="flex-1"
                      />
                      <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">
                        Post
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
  
  );
}
