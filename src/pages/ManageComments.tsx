import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Navigation } from "@/components/Navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  Brain,
  ArrowLeft,
  Edit,
  Trash2,
  Star,
  AlertCircle,
  Search,
  Filter,
} from "lucide-react";
import { Input } from "@/components/ui/input";

interface Comment {
  id: number;
  star_count: number;
  comment_text: string;
  commenter_name: string;
  commenter_job: string | null;
  created_at: string;
  updated_at: string;
}

const ManageComments = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStars, setFilterStars] = useState<number | null>(null);

  // Check if user is admin
  const isAdmin = user?.is_admin === true;

  // Fetch comments from Laravel backend
  const fetchComments = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch('https://rakantrad.eu/api/customer-comments'); 
      
      if (!response.ok) {
        throw new Error('Failed to fetch comments');
      }
      
      const data = await response.json();
      
      if (data.success) {
        setComments(data.data);
      } else {
        throw new Error(data.message || 'Failed to fetch comments');
      }
    } catch (err) {
      console.error('Error fetching comments:', err);
      setError('Failed to load comments. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  // Handle delete comment
  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    try {
      const response = await fetch(`https://rakantrad.eu/api/customer-comments/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Comment deleted successfully!');
        // Refresh comments list
        fetchComments();
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(''), 3000);
      } else {
        throw new Error(data.message || 'Failed to delete comment');
      }
    } catch (err) {
      console.error('Error deleting comment:', err);
      setError('Failed to delete comment. Please try again.');
      setTimeout(() => setError(''), 3000);
    }
  };

  // Handle edit - navigate to edit page or open modal
  const handleEdit = (comment: Comment) => {
    // For now, we'll just show an alert. You can implement a modal or separate edit page later.
    alert(`Edit comment from ${comment.commenter_name}\n\nYou can implement an edit modal or page here.`);
  };

  // Filter comments based on search and filter
  const filteredComments = comments.filter(comment => {
    const matchesSearch = comment.commenter_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         comment.comment_text.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (comment.commenter_job && comment.commenter_job.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStars = filterStars === null || comment.star_count === filterStars;
    
    return matchesSearch && matchesStars;
  });

  // Redirect if not authenticated or not admin
  if (!isAuthenticated || !isAdmin) {
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
              You need to be an administrator to access this page.
            </p>
            <Button onClick={() => navigate("/")}>Go to Home</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Manage Comments
              </h1>
              <p className="text-muted-foreground">
                View, edit, and delete customer comments
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Brain className="h-8 w-8 text-primary" />
          </div>
        </div>

        <div className="space-y-6">
          {/* Success Message */}
          {success && (
            <div className="p-4 bg-green-100 border border-green-300 rounded-lg">
              <p className="text-green-700 text-sm">{success}</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-100 border border-red-300 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Filters and Search */}
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search comments..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Star Filter */}
                <div>
                  <select
                    value={filterStars === null ? '' : filterStars}
                    onChange={(e) => setFilterStars(e.target.value ? parseInt(e.target.value) : null)}
                    className="w-full p-2 border border-border rounded-lg bg-background"
                  >
                    <option value="">All Ratings</option>
                    {[1, 2, 3, 4, 5].map(star => (
                      <option key={star} value={star}>
                        {star} Star{star !== 1 ? 's' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Results Count */}
                <div className="flex items-center justify-end">
                  <span className="text-sm text-muted-foreground">
                    {filteredComments.length} comment{filteredComments.length !== 1 ? 's' : ''} found
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Comments Table */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Comments</CardTitle>
              <CardDescription>
                Manage all customer testimonials and feedback
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : filteredComments.length > 0 ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Customer</TableHead>
                        <TableHead>Job Title</TableHead>
                        <TableHead>Comment</TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredComments.map((comment) => (
                        <TableRow key={comment.id}>
                          <TableCell className="font-medium">
                            {comment.commenter_name}
                          </TableCell>
                          <TableCell>
                            {comment.commenter_job || "N/A"}
                          </TableCell>
                          <TableCell className="max-w-xs truncate">
                            {comment.comment_text}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-1">
                              <span className="text-sm mr-2">{comment.star_count}</span>
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < comment.star_count
                                      ? "fill-accent text-accent"
                                      : "fill-muted text-muted"
                                  }`}
                                />
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>
                            {new Date(comment.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEdit(comment)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDelete(comment.id)}
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
              ) : (
                <div className="text-center py-12">
                  <Filter className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    No comments found
                  </h3>
                  <p className="text-muted-foreground">
                    {searchTerm || filterStars !== null
                      ? "Try adjusting your search or filter criteria."
                      : "No customer comments have been submitted yet."}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ManageComments;