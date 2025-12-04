import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { Navigation } from "@/components/Navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  Search,
  Edit,
  Trash2,
  Eye,
  Mail,
  Building,
  User,
  Calendar,
  RefreshCw,
  Filter,
  AlertCircle,
  Send,
} from "lucide-react";

interface ContactSubmission {
  id: number;
  name: string;
  company: string | null;
  email: string;
  role: string | null;
  message: string;
  created_at: string;
  updated_at: string;
}

const ContactManagementPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubmission, setSelectedSubmission] =
    useState<ContactSubmission | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingSubmission, setEditingSubmission] =
    useState<ContactSubmission | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // send email
  const [sendMessageDialogOpen, setSendMessageDialogOpen] = useState(false);
  const [messageData, setMessageData] = useState({
    subject: "",
    message: "",
  });
  const [isSending, setIsSending] = useState(false);

  // Handle open send message dialog
  const handleSendMessage = (submission: ContactSubmission) => {
    setSelectedSubmission(submission);
    setMessageData({
      subject: "",
      message: "",
    });
    setSendMessageDialogOpen(true);
  };

  // Handle send message API call
  const handleSendMessageSubmit = async () => {
    if (!selectedSubmission) return;

    setIsSending(true);
    try {
      const response = await fetch(
        `https://rakantrad.eu/api/contact-submissions/${selectedSubmission.id}/send-message`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            subject: messageData.subject,
            message: messageData.message,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        alert("Message sent successfully!");
        setSendMessageDialogOpen(false);
        setMessageData({ subject: "", message: "" });
      } else {
        if (result.errors) {
          const errorMessages = Object.values(result.errors).flat().join("\n");
          alert(`Error: ${errorMessages}`);
        } else {
          alert(result.message || "Failed to send message");
        }
      }
    } catch (error) {
      console.error("Send message error:", error);
      alert("Network error. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  // Fetch contact submissions
  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://rakantrad.eu/api/contact-submissions"
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setSubmissions(data.data);
      } else {
        throw new Error(data.message || "Failed to fetch submissions");
      }
    } catch (error) {
      console.error("Error fetching submissions:", error);
      alert("Failed to load contact submissions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchSubmissions();
    }
  }, [isAuthenticated]);

  // Filter submissions based on search term
  const filteredSubmissions = submissions.filter((submission) =>
    Object.values(submission).some(
      (value) =>
        value &&
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Handle view submission
  const handleView = (submission: ContactSubmission) => {
    setSelectedSubmission(submission);
    setViewDialogOpen(true);
  };

  // Handle edit submission
  const handleEdit = (submission: ContactSubmission) => {
    setEditingSubmission({ ...submission });
    setEditDialogOpen(true);
  };

  // Handle update submission
  const handleUpdate = async () => {
    if (!editingSubmission) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(
        `https://rakantrad.eu/api/contact-submissions/${editingSubmission.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(editingSubmission),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        setSubmissions((prev) =>
          prev.map((sub) =>
            sub.id === editingSubmission.id ? result.data : sub
          )
        );
        setEditDialogOpen(false);
        setEditingSubmission(null);
        alert("Submission updated successfully!");
      } else {
        if (result.errors) {
          const errorMessages = Object.values(result.errors).flat().join("\n");
          alert(`Please fix the following errors:\n${errorMessages}`);
        } else {
          alert(result.message || "Failed to update submission");
        }
      }
    } catch (error) {
      console.error("Update error:", error);
      alert("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete submission
  const handleDelete = async () => {
    if (!selectedSubmission) return;

    try {
      const response = await fetch(
        `https://rakantrad.eu/api/contact-submissions/${selectedSubmission.id}`,
        {
          method: "DELETE",
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        setSubmissions((prev) =>
          prev.filter((sub) => sub.id !== selectedSubmission.id)
        );
        setDeleteDialogOpen(false);
        setSelectedSubmission(null);
        alert("Submission deleted successfully!");
      } else {
        alert(result.message || "Failed to delete submission");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Network error. Please try again.");
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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
              You need to be logged in to manage contact submissions.
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
            <p className="text-muted-foreground">
              Loading contact submissions...
            </p>
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
              Contact Submissions Management
            </h1>
            <p className="text-muted-foreground">
              Manage and review all contact form submissions
            </p>
          </div>

          {/* Rest of your component remains the same */}
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Total Submissions
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {submissions.length}
                    </p>
                  </div>
                  <Mail className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            {/* ... rest of your existing JSX ... */}
          </div>

          {/* Search and Controls */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="relative flex-1 w-full sm:max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search submissions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={fetchSubmissions}
                    className="flex items-center gap-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Refresh
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submissions Table */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Submissions</CardTitle>
            </CardHeader>
            <CardContent>
              {filteredSubmissions.length === 0 ? (
                <div className="text-center py-8">
                  <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    {searchTerm
                      ? "No submissions match your search."
                      : "No contact submissions yet."}
                  </p>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Company</TableHead>
                        {/* <TableHead>Role</TableHead> */}
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredSubmissions.map((submission) => (
                        <TableRow key={submission.id}>
                          <TableCell className="font-medium">
                            {submission.name}
                          </TableCell>
                          <TableCell>{submission.email}</TableCell>
                          <TableCell>
                            {submission.company || (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>

                          <TableCell>
                            {formatDate(submission.created_at)}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleView(submission)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEdit(submission)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedSubmission(submission);
                                  setDeleteDialogOpen(true);
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>

                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleSendMessage(submission)}
                              >
                                <Send className="h-4 w-4" />
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

          {/* Dialogs remain the same */}
          {/* View Dialog */}
          <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>View Submission</DialogTitle>
                <DialogDescription>
                  Contact form submission details
                </DialogDescription>
              </DialogHeader>
              {selectedSubmission && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground">
                        Name
                      </label>
                      <p className="text-muted-foreground">
                        {selectedSubmission.name}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground">
                        Email
                      </label>
                      <p className="text-muted-foreground">
                        {selectedSubmission.email}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground">
                        Company
                      </label>
                      <p className="text-muted-foreground">
                        {selectedSubmission.company || "Not provided"}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground">
                        Role
                      </label>
                      <p className="text-muted-foreground">
                        {selectedSubmission.role || "Not provided"}
                      </p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">
                      Message
                    </label>
                    <p className="text-muted-foreground whitespace-pre-wrap">
                      {selectedSubmission.message}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground">
                        Submitted
                      </label>
                      <p className="text-muted-foreground">
                        {formatDate(selectedSubmission.created_at)}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground">
                        Last Updated
                      </label>
                      <p className="text-muted-foreground">
                        {formatDate(selectedSubmission.updated_at)}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              <DialogFooter>
                <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Edit Dialog */}
          <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Edit Submission</DialogTitle>
                <DialogDescription>
                  Update contact form submission details
                </DialogDescription>
              </DialogHeader>
              {editingSubmission && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2">
                        Name
                      </label>
                      <Input
                        value={editingSubmission.name}
                        onChange={(e) =>
                          setEditingSubmission({
                            ...editingSubmission,
                            name: e.target.value,
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
                        value={editingSubmission.email}
                        onChange={(e) =>
                          setEditingSubmission({
                            ...editingSubmission,
                            email: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2">
                        Company
                      </label>
                      <Input
                        value={editingSubmission.company || ""}
                        onChange={(e) =>
                          setEditingSubmission({
                            ...editingSubmission,
                            company: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2">
                        Role
                      </label>
                      <Input
                        value={editingSubmission.role || ""}
                        onChange={(e) =>
                          setEditingSubmission({
                            ...editingSubmission,
                            role: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2">
                      Message
                    </label>
                    <Textarea
                      value={editingSubmission.message}
                      onChange={(e) =>
                        setEditingSubmission({
                          ...editingSubmission,
                          message: e.target.value,
                        })
                      }
                      rows={4}
                    />
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
                  {isSubmitting ? "Updating..." : "Update Submission"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Delete Confirmation Dialog */}
          <AlertDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  contact submission from the database.
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

          {/* Send Message Dialog */}
          <Dialog
            open={sendMessageDialogOpen}
            onOpenChange={setSendMessageDialogOpen}
          >
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Send Message to User</DialogTitle>
                <DialogDescription>
                  Send an email response to {selectedSubmission?.name} (
                  {selectedSubmission?.email})
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Subject
                  </label>
                  <Input
                    value={messageData.subject}
                    onChange={(e) =>
                      setMessageData({
                        ...messageData,
                        subject: e.target.value,
                      })
                    }
                    placeholder="Enter email subject..."
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Message
                  </label>
                  <Textarea
                    value={messageData.message}
                    onChange={(e) =>
                      setMessageData({
                        ...messageData,
                        message: e.target.value,
                      })
                    }
                    placeholder="Enter your message here..."
                    rows={6}
                  />
                </div>

                <div className="bg-secondary/50 p-3 rounded-md text-sm">
                  <p className="font-medium mb-1">Recipient Details:</p>
                  <p>Name: {selectedSubmission?.name}</p>
                  <p>Email: {selectedSubmission?.email}</p>
                  {selectedSubmission?.company && (
                    <p>Company: {selectedSubmission.company}</p>
                  )}
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setSendMessageDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSendMessageSubmit}
                  disabled={
                    isSending ||
                    !messageData.subject.trim() ||
                    !messageData.message.trim()
                  }
                  className="flex items-center gap-2"
                >
                  {isSending ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Send Message
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default ContactManagementPage;
