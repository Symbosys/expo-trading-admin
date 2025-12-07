
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Bell, Megaphone, Send, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner"; // Assuming sonner is used as in App.tsx

// Dummy data for notifications - In a real app, this would come from an API
interface Notification {
    id: string;
    title: string;
    message: string;
    type: "INFO" | "SUCCESS" | "WARNING" | "ERROR";
    createdAt: string;
    isGlobal: boolean;
    userId?: string;
}

const dummyNotifications: Notification[] = [
    {
        id: "1",
        title: "System Maintenance",
        message: "Scheduled maintenance on Sunday at 2 AM",
        type: "INFO",
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        isGlobal: true,
    },
    {
        id: "2",
        title: "Welcome Bonus",
        message: "Welcome bonus has been credited to all new users",
        type: "SUCCESS",
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        isGlobal: true,
    },
];

const Notifications = () => {
    const [notifications, setNotifications] = useState<Notification[]>(dummyNotifications);
    const [formData, setFormData] = useState({
        title: "",
        message: "",
        type: "INFO" as "INFO" | "SUCCESS" | "WARNING" | "ERROR",
        target: "global", // 'global' or 'user'
        userId: "",
    });

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title || !formData.message) {
            toast.error("Please fill in all required fields");
            return;
        }

        // In a real app, you would make an API call here
        const newNotification: Notification = {
            id: Math.random().toString(36).substr(2, 9),
            title: formData.title,
            message: formData.message,
            type: formData.type,
            createdAt: new Date().toISOString(),
            isGlobal: formData.target === "global",
            userId: formData.target === "user" ? formData.userId : undefined,
        };

        // Simulate API delay
        toast.promise(new Promise(resolve => setTimeout(resolve, 1000)), {
            loading: 'Sending notification...',
            success: () => {
                setNotifications([newNotification, ...notifications]);
                setFormData({
                    title: "",
                    message: "",
                    type: "INFO",
                    target: "global",
                    userId: "",
                });
                return 'Notification created successfully';
            },
            error: 'Failed to create notification',
        });
    };

    const handleDelete = (id: string) => {
        // Logic to delete notification
        setNotifications(prev => prev.filter(n => n.id !== id));
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

                            <div className="grid grid-cols-2 gap-4">
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
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Target Audience</Label>
                                    <Select
                                        value={formData.target}
                                        onValueChange={(val) => setFormData({ ...formData, target: val })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Target" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="global">All Users (Global)</SelectItem>
                                            <SelectItem value="user">Specific User</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {formData.target === "user" && (
                                <div className="space-y-2">
                                    <Label htmlFor="userId">User ID</Label>
                                    <Input
                                        id="userId"
                                        placeholder="Enter User ID"
                                        value={formData.userId}
                                        onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                                    />
                                </div>
                            )}

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

                            <Button type="submit" className="w-full">
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
                            {notifications.length === 0 ? (
                                <p className="text-center text-muted-foreground py-8">No notifications found</p>
                            ) : (
                                notifications.map((notification) => (
                                    <div key={notification.id} className="flex items-start gap-4 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                                        <div className={`p-2 rounded-full mt-1 shrink-0 ${notification.type === 'INFO' ? 'bg-blue-100 text-blue-600' :
                                                notification.type === 'SUCCESS' ? 'bg-green-100 text-green-600' :
                                                    notification.type === 'WARNING' ? 'bg-yellow-100 text-yellow-600' :
                                                        'bg-red-100 text-red-600'
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
                                                {notification.isGlobal ? (
                                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                                                        Global
                                                    </span>
                                                ) : (
                                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium truncate max-w-[150px]">
                                                        User: {notification.userId}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0"
                                            onClick={() => handleDelete(notification.id)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
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
