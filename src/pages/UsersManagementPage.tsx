import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Navigation } from "@/components/Navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  Search,
  Edit,
  Trash2,
  Eye,
  User,
  Shield,
  CheckCircle,
  XCircle,
  RefreshCw,
  Filter,
  Users,
  Calendar,
  Phone,
  Mail,
  AlertCircle,
  CheckSquare,
} from "lucide-react";

interface BotRegistration {
  id: number;
  telegram_user_id: string;
  username: string | null;
  first_name: string | null;
  last_name: string | null;
  phone_number: string | null;
  email: string | null;
  chat_id: string | null;
  conversation_data: unknown;
  approved: boolean;
  approved_from: string | null;
  approved_to: string | null;
  is_admin: boolean;
  account_type: string | null;
  created_at: string;
  updated_at: string;
}

const UsersManagementPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<BotRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total_users: 0,
    admin_users: 0,
    approved_users: 0,
    pending_users: 0,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<BotRegistration | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<BotRegistration | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);

  // Fetch users and statistics
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const [usersResponse, statsResponse] = await Promise.all([
        fetch("https://rakantrad.eu/api/bot-registrations"),
        fetch("https://rakantrad.eu/api/bot-registrations-stats/statistics")
      ]);

      if (!usersResponse.ok || !statsResponse.ok) {
        throw new Error('Failed to fetch data');
      }

      const usersData = await usersResponse.json();
      const statsData = await statsResponse.json();

      if (usersData.success) {
        setUsers(usersData.data);
      }
      if (statsData.success) {
        setStats(statsData.data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      alert("Failed to load users data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchUsers();
    }
  }, [isAuthenticated]);

  // Filter users based on search term
  const filteredUsers = users.filter((user) =>
    Object.values(user).some(
      (value) =>
        value &&
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Handle view user
  const handleView = (user: BotRegistration) => {
    setSelectedUser(user);
    setViewDialogOpen(true);
  };

  // Handle edit user
  const handleEdit = (user: BotRegistration) => {
    setEditingUser({ ...user });
    setEditDialogOpen(true);
  };

  // Handle update user
  const handleUpdate = async () => {
    if (!editingUser) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(
        `https://rakantrad.eu/api/bot-registrations/${editingUser.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(editingUser),
        }
      );

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const result = await response.json();

      if (result.success) {
        setUsers(prev => prev.map(user => user.id === editingUser.id ? result.data : user));
        setEditDialogOpen(false);
        setEditingUser(null);
        fetchUsers(); // Refresh stats
        alert("User updated successfully!");
      } else {
        if (result.errors) {
          const errorMessages = Object.values(result.errors).flat().join("\n");
          alert(`Please fix the following errors:\n${errorMessages}`);
        } else {
          alert(result.message || "Failed to update user");
        }
      }
    } catch (error) {
      console.error("Update error:", error);
      alert("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete user
  const handleDelete = async () => {
    if (!selectedUser) return;

    try {
      const response = await fetch(
        `https://rakantrad.eu/api/bot-registrations/${selectedUser.id}`,
        {
          method: "DELETE",
          headers: { Accept: "application/json" },
        }
      );

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const result = await response.json();

      if (result.success) {
        setUsers(prev => prev.filter(user => user.id !== selectedUser.id));
        setDeleteDialogOpen(false);
        setSelectedUser(null);
        fetchUsers(); // Refresh stats
        alert("User deleted successfully!");
      } else {
        alert(result.message || "Failed to delete user");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Network error. Please try again.");
    }
  };

  // Handle bulk approval
  const handleBulkApprove = async (approved: boolean) => {
    if (selectedUsers.length === 0) {
      alert("Please select at least one user");
      return;
    }

    try {
      const response = await fetch(
        "https://rakantrad.eu/api/bot-registrations/bulk-approve",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            user_ids: selectedUsers,
            approved: approved
          }),
        }
      );

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const result = await response.json();

      if (result.success) {
        setUsers(prev => 
          prev.map(user => 
            selectedUsers.includes(user.id) 
              ? { ...user, approved, approved_from: approved ? new Date().toISOString() : null, approved_to: approved ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() : null }
              : user
          )
        );
        setSelectedUsers([]);
        fetchUsers(); // Refresh stats
        alert(result.message);
      } else {
        alert(result.message || "Failed to update user approvals");
      }
    } catch (error) {
      console.error("Bulk approve error:", error);
      alert("Network error. Please try again.");
    }
  };

  // Toggle user selection
  const toggleUserSelection = (userId: number) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  // Toggle select all
  const toggleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(user => user.id));
    }
  };

  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Check if approval is expired
  const isApprovalExpired = (user: BotRegistration) => {
    if (!user.approved || !user.approved_to) return false;
    return new Date(user.approved_to) < new Date();
  };

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-md mx-auto text-center">
            <AlertCircle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Access Denied
            </h2>
            <p className="text-muted-foreground mb-6">
              You need to be logged in to manage users.
            </p>
            <Button onClick={() => navigate("/login")}>Go to Login</Button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="p-8 flex items-center justify-center">
          <div className="flex flex-col items-center space-y-4">
            <RefreshCw className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading users...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Users Management
            </h1>
            <p className="text-muted-foreground">
              Manage Telegram bot registered users
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Total Users
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {stats.total_users}
                    </p>
                  </div>
                  <Users className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Approved Users
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {stats.approved_users}
                    </p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Pending Approval
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {stats.pending_users}
                    </p>
                  </div>
                  <User className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Admin Users
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {stats.admin_users}
                    </p>
                  </div>
                  <Shield className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bulk Actions */}
          {selectedUsers.length > 0 && (
            <Card className="mb-6 bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-700">
                      {selectedUsers.length} user(s) selected
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleBulkApprove(true)}
                      className="flex items-center gap-2"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Approve Selected
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleBulkApprove(false)}
                      className="flex items-center gap-2"
                    >
                      <XCircle className="h-4 w-4" />
                      Reject Selected
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedUsers([])}
                    >
                      Clear Selection
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Search and Controls */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="relative flex-1 w-full sm:max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={fetchUsers}
                    className="flex items-center gap-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Refresh
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Users Table */}
          <Card>
            <CardHeader>
              <CardTitle>Registered Users</CardTitle>
            </CardHeader>
            <CardContent>
              {filteredUsers.length === 0 ? (
                <div className="text-center py-8">
                  <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    {searchTerm ? "No users match your search." : "No users registered yet."}
                  </p>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">
                          <Checkbox
                            checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                            onCheckedChange={toggleSelectAll}
                          />
                        </TableHead>
                        <TableHead>User Info</TableHead>
                        <TableHead>Telegram ID</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Account Type</TableHead>
                        <TableHead>Registration Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <Checkbox
                              checked={selectedUsers.includes(user.id)}
                              onCheckedChange={() => toggleUserSelection(user.id)}
                            />
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">
                                {user.first_name} {user.last_name}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                @{user.username || 'No username'}
                              </p>
                              {user.email && (
                                <p className="text-xs text-muted-foreground">
                                  {user.email}
                                </p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="font-mono text-sm">
                            {user.telegram_user_id}
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-1">
                              <Badge
                                variant={user.approved ? "default" : "secondary"}
                                className={user.approved ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}
                              >
                                {user.approved ? "Approved" : "Pending"}
                              </Badge>
                              {user.is_admin && (
                                <Badge variant="outline" className="bg-purple-100 text-purple-800">
                                  Admin
                                </Badge>
                              )}
                              {user.approved && user.approved_to && isApprovalExpired(user) && (
                                <Badge variant="destructive" className="text-xs">
                                  Expired
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {user.account_type || 'Not Set'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {formatDate(user.created_at)}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleView(user)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEdit(user)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedUser(user);
                                  setDeleteDialogOpen(true);
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* View Dialog */}
          <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>User Details</DialogTitle>
                <DialogDescription>
                  Complete information about the user
                </DialogDescription>
              </DialogHeader>
              {selectedUser && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground">
                        First Name
                      </label>
                      <p className="text-muted-foreground">
                        {selectedUser.first_name || "Not provided"}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground">
                        Last Name
                      </label>
                      <p className="text-muted-foreground">
                        {selectedUser.last_name || "Not provided"}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground">
                        Username
                      </label>
                      <p className="text-muted-foreground">
                        @{selectedUser.username || "Not provided"}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground">
                        Telegram ID
                      </label>
                      <p className="text-muted-foreground font-mono">
                        {selectedUser.telegram_user_id}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground">
                        Email
                      </label>
                      <p className="text-muted-foreground">
                        {selectedUser.email || "Not provided"}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground">
                        Phone
                      </label>
                      <p className="text-muted-foreground">
                        {selectedUser.phone_number || "Not provided"}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground">
                        Account Type
                      </label>
                      <p className="text-muted-foreground">
                        {selectedUser.account_type || "Not set"}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground">
                        Chat ID
                      </label>
                      <p className="text-muted-foreground font-mono">
                        {selectedUser.chat_id || "Not available"}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground">
                        Admin
                      </label>
                      <p className="text-muted-foreground">
                        {selectedUser.is_admin ? "Yes" : "No"}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground">
                        Approved
                      </label>
                      <p className="text-muted-foreground">
                        {selectedUser.approved ? "Yes" : "No"}
                      </p>
                    </div>
                  </div>
                  {selectedUser.approved && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-foreground">
                          Approved From
                        </label>
                        <p className="text-muted-foreground">
                          {formatDate(selectedUser.approved_from)}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground">
                          Approved To
                        </label>
                        <p className="text-muted-foreground">
                          {formatDate(selectedUser.approved_to)}
                          {isApprovalExpired(selectedUser) && (
                            <Badge variant="destructive" className="ml-2">Expired</Badge>
                          )}
                        </p>
                      </div>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground">
                        Registered
                      </label>
                      <p className="text-muted-foreground">
                        {formatDate(selectedUser.created_at)}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground">
                        Last Updated
                      </label>
                      <p className="text-muted-foreground">
                        {formatDate(selectedUser.updated_at)}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              <DialogFooter>
                <Button onClick={() => setViewDialogOpen(false)}>
                  Close
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Edit Dialog */}
          <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Edit User</DialogTitle>
                <DialogDescription>
                  Update user information and permissions
                </DialogDescription>
              </DialogHeader>
              {editingUser && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2">
                        First Name
                      </label>
                      <Input
                        value={editingUser.first_name || ""}
                        onChange={(e) =>
                          setEditingUser({
                            ...editingUser,
                            first_name: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2">
                        Last Name
                      </label>
                      <Input
                        value={editingUser.last_name || ""}
                        onChange={(e) =>
                          setEditingUser({
                            ...editingUser,
                            last_name: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2">
                        Username
                      </label>
                      <Input
                        value={editingUser.username || ""}
                        onChange={(e) =>
                          setEditingUser({
                            ...editingUser,
                            username: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2">
                        Email
                      </label>
                      <Input
                        type="email"
                        value={editingUser.email || ""}
                        onChange={(e) =>
                          setEditingUser({
                            ...editingUser,
                            email: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2">
                        Phone Number
                      </label>
                      <Input
                        value={editingUser.phone_number || ""}
                        onChange={(e) =>
                          setEditingUser({
                            ...editingUser,
                            phone_number: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2">
                        Account Type
                      </label>
                      <Input
                        value={editingUser.account_type || ""}
                        onChange={(e) =>
                          setEditingUser({
                            ...editingUser,
                            account_type: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="is_admin"
                        checked={editingUser.is_admin}
                        onChange={(e) =>
                          setEditingUser({
                            ...editingUser,
                            is_admin: e.target.checked,
                          })
                        }
                        className="rounded border-gray-300"
                      />
                      <label htmlFor="is_admin" className="text-sm font-medium text-foreground">
                        Is Admin
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="approved"
                        checked={editingUser.approved}
                        onChange={(e) =>
                          setEditingUser({
                            ...editingUser,
                            approved: e.target.checked,
                          })
                        }
                        className="rounded border-gray-300"
                      />
                      <label htmlFor="approved" className="text-sm font-medium text-foreground">
                        Approved
                      </label>
                    </div>
                  </div>
                </div>
              )}
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setEditDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleUpdate} disabled={isSubmitting}>
                  {isSubmitting ? "Updating..." : "Update User"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Delete Confirmation Dialog */}
          <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the user from the database.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
};

export default UsersManagementPage;