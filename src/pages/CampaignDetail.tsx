
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface Contact {
  row_id: string;
  name: string;
  business_name: string;
  phone: string;
  status: 'NEW' | 'CALLING' | 'DONE' | 'FAILED';
  transcript: any;
  last_called_at: string;
  processing_order: number;
}

const CampaignDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTranscript, setSelectedTranscript] = useState<any>(null);

  // Mock data for now - in real implementation, this would come from Supabase
  useEffect(() => {
    const mockContacts: Contact[] = [
      {
        row_id: `${id}-1`,
        name: 'John Doe',
        business_name: 'Acme Corp',
        phone: '+1234567890',
        status: 'DONE',
        transcript: { summary: 'Interested in our services, scheduled follow-up', duration: 180 },
        last_called_at: '2024-11-30T14:30:00Z',
        processing_order: 1
      },
      {
        row_id: `${id}-2`,
        name: 'Jane Smith',
        business_name: 'Tech Solutions LLC',
        phone: '+1987654321',
        status: 'CALLING',
        transcript: null,
        last_called_at: '2024-11-30T14:35:00Z',
        processing_order: 2
      },
      {
        row_id: `${id}-3`,
        name: 'Bob Johnson',
        business_name: 'Marketing Plus',
        phone: '+1555123456',
        status: 'DONE',
        transcript: { summary: 'Not interested at this time', duration: 45 },
        last_called_at: '2024-11-30T14:20:00Z',
        processing_order: 3
      },
      {
        row_id: `${id}-4`,
        name: 'Alice Brown',
        business_name: 'Consulting Group',
        phone: '+1444987654',
        status: 'FAILED',
        transcript: { summary: 'Call failed - number disconnected', duration: 0 },
        last_called_at: '2024-11-30T14:25:00Z',
        processing_order: 4
      },
      {
        row_id: `${id}-5`,
        name: 'Charlie Wilson',
        business_name: 'Design Studio',
        phone: '+1333456789',
        status: 'NEW',
        transcript: null,
        last_called_at: null,
        processing_order: 5
      }
    ];

    setTimeout(() => {
      setContacts(mockContacts);
      setLoading(false);
    }, 500);
  }, [id]);

  const getStatusBadge = (status: Contact['status']) => {
    const styles = {
      NEW: 'bg-status-new text-white',
      CALLING: 'bg-status-calling text-white animate-pulse-slow',
      DONE: 'bg-status-done text-white',
      FAILED: 'bg-status-failed text-white'
    };

    return (
      <Badge className={styles[status]}>
        {status}
      </Badge>
    );
  };

  const getStats = () => {
    const total = contacts.length;
    const completed = contacts.filter(c => c.status === 'DONE').length;
    const failed = contacts.filter(c => c.status === 'FAILED').length;
    const inProgress = contacts.filter(c => c.status === 'CALLING').length;
    const successRate = total > 0 ? Math.round((completed / (completed + failed || 1)) * 100) : 0;

    return { total, completed, failed, inProgress, successRate };
  };

  const stats = getStats();
  const progressPercentage = stats.total > 0 ? ((stats.completed + stats.failed) / stats.total) * 100 : 0;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-32 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" asChild>
              <Link to="/campaigns">← Back to Campaigns</Link>
            </Button>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mt-4">{id}</h1>
          <p className="mt-2 text-gray-600">
            Campaign details and contact progress
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <Card className="rounded-xl shadow-sm">
        <CardHeader>
          <CardTitle>Campaign Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Progress Bar */}
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Overall Progress</span>
                <span>{Math.round(progressPercentage)}% complete</span>
              </div>
              <Progress value={progressPercentage} className="h-3" />
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                <div className="text-sm text-gray-600">Total Contacts</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
              <div className="text-center p-4 bg-amber-50 rounded-lg">
                <div className="text-2xl font-bold text-amber-600">{stats.inProgress}</div>
                <div className="text-sm text-gray-600">In Progress</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
                <div className="text-sm text-gray-600">Failed</div>
              </div>
              <div className="text-center p-4 bg-brand-primary/10 rounded-lg">
                <div className="text-2xl font-bold text-brand-primary">{stats.successRate}%</div>
                <div className="text-sm text-gray-600">Success Rate</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contacts Table */}
      <Card className="rounded-xl shadow-sm">
        <CardHeader>
          <CardTitle>Contact List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">#</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Name</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Company</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Phone</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Last Called</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Action</th>
                </tr>
              </thead>
              <tbody>
                {contacts.map((contact) => (
                  <tr key={contact.row_id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {contact.processing_order}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-gray-900">{contact.name}</div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {contact.business_name || '-'}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600 font-mono">
                      {contact.phone}
                    </td>
                    <td className="py-3 px-4">
                      {getStatusBadge(contact.status)}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {contact.last_called_at ? new Date(contact.last_called_at).toLocaleString() : '-'}
                    </td>
                    <td className="py-3 px-4">
                      {contact.transcript && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              View Transcript
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Call Transcript - {contact.name}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <span className="font-medium">Duration:</span> {contact.transcript.duration}s
                                </div>
                                <div>
                                  <span className="font-medium">Status:</span> {contact.status}
                                </div>
                              </div>
                              <div>
                                <span className="font-medium text-sm">Summary:</span>
                                <p className="mt-2 text-gray-700">{contact.transcript.summary}</p>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CampaignDetail;
