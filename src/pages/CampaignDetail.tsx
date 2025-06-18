import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ExternalLink, FileText } from 'lucide-react';
import { useContacts } from '@/hooks/useContacts';

const CampaignDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { contacts, loading, error } = useContacts(id);

  const getStatusBadge = (status: string) => {
    const styles = {
      NEW: 'bg-status-new text-white',
      CALLING: 'bg-status-calling text-white animate-pulse-slow',
      DONE: 'bg-status-done text-white',
      FAILED: 'bg-status-failed text-white'
    };

    return (
      <Badge className={styles[status as keyof typeof styles] || 'bg-gray-500 text-white'}>
        {status}
      </Badge>
    );
  };

  const formatTranscript = (transcript: any) => {
    if (!transcript) return 'No transcript available';
    
    // Handle different transcript formats
    if (typeof transcript === 'string') {
      return transcript;
    }
    
    if (typeof transcript === 'object') {
      // If it has a summary field, show that
      if (transcript.summary) {
        return transcript.summary;
      }
      
      // If it has transcript text directly
      if (transcript.transcript) {
        return transcript.transcript;
      }
      
      // If it's a complex object, try to extract meaningful text
      if (transcript.conversation || transcript.text || transcript.content) {
        return transcript.conversation || transcript.text || transcript.content;
      }
      
      // Fallback: stringify the object
      return JSON.stringify(transcript, null, 2);
    }
    
    return 'No transcript available';
  };

  const getTranscriptDuration = (transcript: any) => {
    if (!transcript || typeof transcript !== 'object') return null;
    return transcript.duration || transcript.call_duration || null;
  };

  const getStats = () => {
    const total = contacts.length;
    const completed = contacts.filter(c => c.status === 'DONE').length;
    const failed = contacts.filter(c => c.status === 'FAILED').length;
    const inProgress = contacts.filter(c => c.status === 'CALLING').length;
    const successRate = total > 0 ? Math.round((completed / (completed + failed || 1)) * 100) : 0;

    // Calculate cost metrics
    const totalCost = contacts.reduce((sum, c) => sum + (c.cost || 0), 0);
    const averageCostPerCall = total > 0 ? totalCost / total : 0;

    // Calculate AI success metrics
    const contactsWithAIEval = contacts.filter(c => c.success_evaluation !== null);
    const aiSuccessful = contacts.filter(c => c.success_evaluation === true).length;
    const aiSuccessRate = contactsWithAIEval.length > 0 ? 
      Math.round((aiSuccessful / contactsWithAIEval.length) * 100) : 0;

    return { 
      total, 
      completed, 
      failed, 
      inProgress, 
      successRate, 
      totalCost,
      averageCostPerCall,
      aiSuccessRate,
      aiEvaluated: contactsWithAIEval.length
    };
  };

  if (error) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{id}</h1>
          <p className="mt-2 text-gray-600">Campaign details and contact progress</p>
        </div>
        <Card className="rounded-xl shadow-sm">
          <CardContent className="p-8 text-center">
            <div className="text-red-500 text-lg mb-2">⚠️ Error Loading Campaign</div>
            <p className="text-gray-600">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-32 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
      </div>
    );
  }

  const stats = getStats();
  const progressPercentage = stats.total > 0 ? ((stats.completed + stats.failed) / stats.total) * 100 : 0;

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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
            </div>

            {/* Enhanced Metrics Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-brand-primary/10 rounded-lg">
                <div className="text-2xl font-bold text-brand-primary">{stats.successRate}%</div>
                <div className="text-sm text-gray-600">Success Rate</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{stats.aiSuccessRate}%</div>
                <div className="text-sm text-gray-600">AI Success Rate</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">${stats.totalCost.toFixed(2)}</div>
                <div className="text-sm text-gray-600">Total Cost</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">${stats.averageCostPerCall.toFixed(2)}</div>
                <div className="text-sm text-gray-600">Avg Cost/Call</div>
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
          {contacts.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-500">No contacts found for this campaign.</div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">#</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Name</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Company</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Phone</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Cost</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">End Reason</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">AI Success</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Last Called</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.map((contact) => (
                    <tr key={contact.row_id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {contact.processing_order || '-'}
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
                        {contact.cost ? `$${contact.cost.toFixed(2)}` : '-'}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {contact.ended_reason || '-'}
                      </td>
                      <td className="py-3 px-4">
                        {contact.success_evaluation !== null ? 
                          (contact.success_evaluation ? 
                            <Badge className="bg-green-100 text-green-800">Success</Badge> : 
                            <Badge className="bg-red-100 text-red-800">Failed</Badge>
                          ) : '-'
                        }
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {contact.last_called_at ? new Date(contact.last_called_at).toLocaleString() : '-'}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          {contact.transcript && (
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <FileText className="w-4 h-4 mr-1" />
                                  Transcript
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle>Call Transcript - {contact.name}</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                      <span className="font-medium">Contact:</span> {contact.name}
                                    </div>
                                    <div>
                                      <span className="font-medium">Phone:</span> {contact.phone}
                                    </div>
                                    <div>
                                      <span className="font-medium">Status:</span> {contact.status}
                                    </div>
                                    {getTranscriptDuration(contact.transcript) && (
                                      <div>
                                        <span className="font-medium">Duration:</span> {getTranscriptDuration(contact.transcript)}s
                                      </div>
                                    )}
                                  </div>
                                  <div>
                                    <span className="font-medium text-sm">Transcript:</span>
                                    <div className="mt-2 p-4 bg-gray-50 rounded-lg text-gray-700 whitespace-pre-wrap text-sm">
                                      {formatTranscript(contact.transcript)}
                                    </div>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          )}
                          {(contact as any).recording_url && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              asChild
                            >
                              <a 
                                href={(contact as any).recording_url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-flex items-center"
                              >
                                <ExternalLink className="w-4 h-4 mr-1" />
                                Recording
                              </a>
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CampaignDetail;
