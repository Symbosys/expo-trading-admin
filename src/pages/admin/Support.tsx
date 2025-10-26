import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Eye } from 'lucide-react';
import { supportTickets } from '@/data/mockData';

const Support = () => {
  const [selectedTicket, setSelectedTicket] = useState<typeof supportTickets[0] | null>(null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Support & Tickets</h1>
        <p className="text-muted-foreground mt-1">View and manage support requests from users</p>
      </div>

      {/* Tickets Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Support Tickets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="pb-3 font-semibold text-sm text-muted-foreground">Ticket ID</th>
                  <th className="pb-3 font-semibold text-sm text-muted-foreground">User Name</th>
                  <th className="pb-3 font-semibold text-sm text-muted-foreground">Subject</th>
                  <th className="pb-3 font-semibold text-sm text-muted-foreground">Date</th>
                  <th className="pb-3 font-semibold text-sm text-muted-foreground">Status</th>
                  <th className="pb-3 font-semibold text-sm text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {supportTickets.map((ticket) => (
                  <tr key={ticket.id} className="border-b border-border last:border-0">
                    <td className="py-4 text-sm">#{ticket.id}</td>
                    <td className="py-4 text-sm font-medium">{ticket.user}</td>
                    <td className="py-4 text-sm">{ticket.subject}</td>
                    <td className="py-4 text-sm text-muted-foreground">{ticket.date}</td>
                    <td className="py-4">
                      <Badge variant={ticket.status === 'Open' ? 'default' : 'outline'}>
                        {ticket.status}
                      </Badge>
                    </td>
                    <td className="py-4">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => setSelectedTicket(ticket)}
                            className="h-8"
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            View
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Support Ticket #{ticket.id}</DialogTitle>
                          </DialogHeader>
                          {selectedTicket && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-sm text-muted-foreground">User</p>
                                  <p className="font-medium">{selectedTicket.user}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Date</p>
                                  <p className="font-medium">{selectedTicket.date}</p>
                                </div>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground mb-1">Subject</p>
                                <p className="font-semibold text-lg">{selectedTicket.subject}</p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground mb-1">Status</p>
                                <Badge variant={selectedTicket.status === 'Open' ? 'default' : 'outline'}>
                                  {selectedTicket.status}
                                </Badge>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground mb-2">Message</p>
                                <div className="bg-muted p-4 rounded-lg">
                                  <p className="text-sm">{selectedTicket.message}</p>
                                </div>
                              </div>
                              <div className="flex gap-2 pt-4">
                                <Button className="flex-1">
                                  Reply
                                </Button>
                                {selectedTicket.status === 'Open' && (
                                  <Button variant="outline" className="flex-1">
                                    Mark as Resolved
                                  </Button>
                                )}
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
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

export default Support;
