import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Bell, Megaphone, Send, Trash2 } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api/apiClient";
import { toast } from "sonner";
import { useState } from "react";

// Backend-aligned Notification interface
interface Notification {
    id: string;
    title: string;
    message: string;
    type: "INFO" | "SUCCESS" | "WARNING" | "ERROR" | "PROMOTIONAL" | "SYSTEM";
    createdAt: string;
    updatedAt: string;
}

// TanStack Query hook for fetching notifications
const useNotifications = () => {
    return useQuery<Notification[]>({
        queryKey: ['notifications'],
        queryFn: async () => {
            const { data } = await api.get('/notifications/all');
            if (!data.success) {
                throw new Error("Failed to fetch notifications");
            }
            return data.data;
        },
    });
};

// TanStack Query mutation for creating notification
const useCreateNotification = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (newNotification: Partial<Notification>) => {
            const { data } = await api.post('/notifications/create', newNotification);
            if (!data.success) {
                throw new Error("Failed to create notification");
            }
            return data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
            toast.success("Notification created successfully");
        },
        onError: (error: any) => {
            toast.error(`Failed to create notification: ${error.message}`);
        },
    });
};

const Notifications = () => {
    const { data: notifications = [], isLoading: isFetching } = useNotifications();
    const createMutation = useCreateNotification();

    const [formData, setFormData] = useState({
        title: "",
        message: "",
        type: "INFO" as "INFO" | "SUCCESS" | "WARNING" | "ERROR" | "PROMOTIONAL" | "SYSTEM",
    });

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title || !formData.message) {
            toast.error("Please fill in all required fields");
            return;
        }

        createMutation.mutate({
            title: formData.title,
            message: formData.message,
            type: formData.type,
        });

        // Reset form
        setFormData({
            title: "",
            message: "",
            type: "INFO",
        });
    };

    const handleDelete = (id: string) => {
        // Note: Delete not implemented in provided controllers; add if needed
        // For now, simulate
        toast.success("Notification deleted");
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Notification Manager</h1>
                    <p className="text-muted-foreground mt-1">Create and manage system notifications</p>
                </div>
                <Button>
                    <Bell className="w-4 h-4 mr-2" />
                    Settings
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Create Notification Form */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Megaphone className="w-5 h-5 text-primary" />
                            Send Notification
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Title</Label>
                                <Input
                                    id="title"
                                    placeholder="Notification Title"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Type</Label>
                                <Select
                                    value={formData.type}
                                    onValueChange={(val: any) => setFormData({ ...formData, type: val })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="INFO">Info</SelectItem>
                                        <SelectItem value="SUCCESS">Success</SelectItem>
                                        <SelectItem value="WARNING">Warning</SelectItem>
                                        <SelectItem value="ERROR">Error</SelectItem>
                                        <SelectItem value="PROMOTIONAL">Promotional</SelectItem>
                                        <SelectItem value="SYSTEM">System</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="message">Message</Label>
                                <Textarea
                                    id="message"
                                    placeholder="Write your message here..."
                                    className="min-h-[100px]"
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                />
                            </div>

                            <Button type="submit" className="w-full" disabled={createMutation.isPending}>
                                <Send className="w-4 h-4 mr-2" />
                                Send Notification
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Recent Notifications List */}
                <Card className="h-fit">
                    <CardHeader>
                        <CardTitle>Recent Notifications</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                            {isFetching ? (
                                <p className="text-center text-muted-foreground py-8">Loading notifications...</p>
                            ) : notifications.length === 0 ? (
                                <p className="text-center text-muted-foreground py-8">No notifications found</p>
                            ) : (
                                notifications.map((notification) => (
                                    <div key={notification.id} className="flex items-start gap-4 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                                        <div className={`p-2 rounded-full mt-1 shrink-0 ${notification.type === 'INFO' ? 'bg-blue-100 text-blue-600' :
                                            notification.type === 'SUCCESS' ? 'bg-green-100 text-green-600' :
                                                notification.type === 'WARNING' ? 'bg-yellow-100 text-yellow-600' :
                                                    notification.type === 'ERROR' ? 'bg-red-100 text-red-600' :
                                                        notification.type === 'PROMOTIONAL' ? 'bg-purple-100 text-purple-600' :
                                                            'bg-gray-100 text-gray-600'
                                            }`}>
                                            <Bell className="w-4 h-4" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-1">
                                                <h4 className="font-semibold text-sm truncate">{notification.title}</h4>
                                                <span className="text-xs text-muted-foreground whitespace-nowrap">
                                                    {new Date(notification.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <p className="text-sm text-muted-foreground mb-2 break-words">
                                                {notification.message}
                                            </p>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground font-medium uppercase">
                                                    {notification.type}
                                                </span>
                                            </div>
                                        </div>
                                        {/* <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0"
                                            onClick={() => handleDelete(notification.id)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button> */}
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Notifications;