import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
  Button,
  Modal,
  TextInput,
  Label,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "flowbite-react";
import Navbarr from "../components/navbar";

// Define TypeScript interfaces
interface Group {
  id: number;
  name: string;
  createdAt: string;
}

interface GroupLink {
  group: Group;
}

interface User {
  id: number;
  username: string;
  createdAt: string;
  groupLinks: GroupLink[];
}

const User = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.get<User[]>(
        "http://localhost:3000/api/user/get",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUsers(response.data);
      setLoading(false);
      console.log(response.data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      setError(errorMessage);
      setLoading(false);
      console.error("Error fetching users:", err);

      if (errorMessage.includes("401")) {
        // Redirect to login or refresh token
      }
    }
  };

  const handleEditClick = (user: User) => {
    setCurrentUser(user);
    setFormData({
      username: user.username,
      password: "",
    });
    setShowEditModal(true);
  };

  const handleCreateClick = () => {
    setFormData({
      username: "",
      password: "",
    });
    setShowCreateModal(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitEdit = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token || !currentUser) return;

      await axios.put(
        `http://localhost:3000/api/user/edit/${currentUser.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setShowEditModal(false);
      fetchUsers(); // Refresh the user list
    } catch (err) {
      console.error("Error updating user:", err);
    }
  };

  const handleSubmitCreate = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      await axios.post("http://localhost:3000/api/user/post", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setShowCreateModal(false);
      fetchUsers(); // Refresh the user list
    } catch (err) {
      console.error("Error creating user:", err);
    }
  };

  const handleDelete = async (userId: number) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      if (window.confirm("Are you sure you want to delete this user?")) {
        await axios.delete(`http://localhost:3000/api/user/remove/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        fetchUsers(); // Refresh the user list
      }
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading users...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-4">
      <Navbarr />
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">User Management</h1>
        <Button onClick={handleCreateClick}>Add New User</Button>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHead>
            <TableRow>
              <TableHeadCell>ID</TableHeadCell>
              <TableHeadCell>Username</TableHeadCell>
              <TableHeadCell>Created At</TableHeadCell>
              <TableHeadCell>Groups</TableHeadCell>
              <TableHeadCell>Actions</TableHeadCell>
            </TableRow>
          </TableHead>
          <TableBody className="divide-y">
            {users.map((user) => (
              <TableRow
                key={user.id}
                className="bg-white dark:border-gray-700 dark:bg-gray-800"
              >
                <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  {user.id}
                </TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>
                  {new Date(user.createdAt).toLocaleString()}
                </TableCell>
                <TableCell>
                  {user.groupLinks.length > 0 ? (
                    <ul className="list-disc list-inside">
                      {user.groupLinks.map((link) => (
                        <li key={link.group.id}>{link.group.name}</li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-gray-400">No groups</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      size="xs"
                      color="light"
                      onClick={() => handleEditClick(user)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="xs"
                      color="red"
                      onClick={() => handleDelete(user.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Edit User Modal */}
      <Modal show={showEditModal} onClose={() => setShowEditModal(false)}>
        <ModalHeader>Edit User</ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-username">Username</Label>
              <TextInput
                id="edit-username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-username">password</Label>
              <TextInput
                id="edit-password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter new password"
              />
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button onClick={handleSubmitEdit}>Save Changes</Button>
          <Button color="gray" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>

      {/* Create User Modal */}
      <Modal show={showCreateModal} onClose={() => setShowCreateModal(false)}>
        <ModalHeader>Create New User</ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-username">Username</Label>
              <TextInput
                id="create-username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Enter username"
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-username">password</Label>
              <TextInput
                id="create-password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter password"
                required
              />
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button onClick={handleSubmitCreate}>Create User</Button>
          <Button color="gray" onClick={() => setShowCreateModal(false)}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default User;
