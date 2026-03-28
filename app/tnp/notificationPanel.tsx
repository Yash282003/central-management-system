import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X, Building2, Users, Bell as BellIcon } from 'lucide-react';


interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const notifications = [
  {
    id: 1,
    category: 'Company Messages',
    title: 'Amazon HR requested shortlisted candidates list',
    description: 'Please submit the list of shortlisted candidates for the SDE-1 position.',
    timestamp: '2 hours ago',
    unread: true,
    icon: Building2,
  },
  {
    id: 2,
    category: 'College Management',
    title: 'Submit placement report before April 10',
    description: 'Annual placement report submission deadline approaching.',
    timestamp: '5 hours ago',
    unread: true,
    icon: Users,
  },
  {
    id: 3,
    category: 'System Alerts',
    title: 'Placement drive deadline approaching',
    description: 'Google campus drive registration closes in 2 days.',
    timestamp: '1 day ago',
    unread: false,
    icon: BellIcon,
  },
  {
    id: 4,
    category: 'Company Messages',
    title: 'Microsoft interview schedule confirmed',
    description: 'Technical interviews scheduled for March 15, 2026.',
    timestamp: '1 day ago',
    unread: false,
    icon: Building2,
  },
  {
    id: 5,
    category: 'System Alerts',
    title: 'New company added to placement portal',
    description: 'TCS has been added to the placement portal.',
    timestamp: '2 days ago',
    unread: false,
    icon: BellIcon,
  },
];

export default function NotificationPanel({ isOpen, onClose }: NotificationPanelProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      
      {/* Panel */}
      <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-2xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
            <p className="text-sm text-gray-500">You have {notifications.filter(n => n.unread).length} unread notifications</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto">
          {notifications.map((notification) => (
            <div 
              key={notification.id} 
              className={`p-4 border-b border-gray-200 hover:bg-gray-50 transition-colors ${
                notification.unread ? 'bg-indigo-50/30' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${
                  notification.category === 'Company Messages' 
                    ? 'bg-blue-100' 
                    : notification.category === 'College Management' 
                    ? 'bg-purple-100' 
                    : 'bg-orange-100'
                }`}>
                  <notification.icon className={`w-4 h-4 ${
                    notification.category === 'Company Messages' 
                      ? 'text-blue-600' 
                      : notification.category === 'College Management' 
                      ? 'text-purple-600' 
                      : 'text-orange-600'
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="text-xs">
                      {notification.category}
                    </Badge>
                    {notification.unread && (
                      <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                    )}
                  </div>
                  <h3 className="text-sm font-medium text-gray-900 mb-1">
                    {notification.title}
                  </h3>
                  <p className="text-xs text-gray-600 mb-2">
                    {notification.description}
                  </p>
                  <p className="text-xs text-gray-500">
                    {notification.timestamp}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <Button variant="outline" className="w-full">
            Mark all as read
          </Button>
        </div>
      </div>
    </>
  );
}
