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
  TextInput,
  Label,
  Select,
  Alert,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "flowbite-react";
import Navbarr from "../components/navbar";

interface User {
  id: number;
  username: string;
}

interface Role {
  id: number;
  name: string;
}

interface GroupUserLink {
  user: User;
}

interface GroupRoleLink {
  role: Role;
}

interface Group {
  id: number;
  name: string;
  createdAt: string;
  userLinks: GroupUserLink[];
  roleLinks: GroupRoleLink[];
}

const Group = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [currentGroup, setCurrentGroup] = useState<Group | null>(null);
  const [formData, setFormData] = useState({ name: "" });
  const [assignData, setAssignData] = useState({ userId: "" });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");

      const [groupsRes, usersRes] = await Promise.all([
        axios.get("http://localhost:3000/api/group/get", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://localhost:3000/api/user/get", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setGroups(groupsRes.data);
      setUsers(usersRes.data);
      setLoading(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
      setLoading(false);
    }
  };

  // Modal handlers
  const openCreateModal = () => {
    setFormData({ name: "" });
    setShowCreateModal(true);
  };

  const openEditModal = (group: Group) => {
    setCurrentGroup(group);
    setFormData({ name: group.name });
    setShowEditModal(true);
  };

  const openAssignModal = (group: Group) => {
    setCurrentGroup(group);
    setAssignData({ userId: "" });
    setShowAssignModal(true);
  };

  const closeModals = () => {
    setShowCreateModal(false);
    setShowEditModal(false);
    setShowAssignModal(false);
    setError(null);
    setSuccess(null);
  };

  // Form handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAssignData((prev) => ({ ...prev, [name]: value }));
  };

  // API operations
  const createGroup = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      await axios.post(
        "http://localhost:3000/api/group/post",
        { groupName: formData.name },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess("Group created successfully");
      setTimeout(() => {
        closeModals();
        fetchData();
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create group");
    }
  };

  const updateGroup = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token || !currentGroup) return;

      await axios.put(
        `http://localhost:3000/api/group/edit/${currentGroup.id}`,
        { groupName: formData.name },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess("Group updated successfully");
      setTimeout(() => {
        closeModals();
        fetchData();
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update group");
    }
  };

  const deleteGroup = async (groupId: number) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      if (window.confirm("Are you sure you want to delete this group?")) {
        await axios.delete(
          `http://localhost:3000/api/group/delete/${groupId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSuccess("Group deleted successfully");
        fetchData();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete group");
    }
  };

  const assignUserToGroup = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token || !currentGroup) return;

      await axios.post(
        `http://localhost:3000/api/group/${currentGroup.id}/users`,
        { userId: parseInt(assignData.userId) },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess("User assigned to group successfully");
      setTimeout(() => {
        closeModals();
        fetchData();
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to assign user");
    }
  };

  if (loading) return <div className="text-center py-4">Loading...</div>;

  return (
    <div className="p-4">
      <Navbarr/>
      {/* Success/Error Alerts */}
      {success && (
        <Alert
          color="success"
          className="mb-4"
          onDismiss={() => setSuccess(null)}
        >
          {success}
        </Alert>
      )}
      {error && (
        <Alert
          color="failure"
          className="mb-4"
          onDismiss={() => setError(null)}
        >
          {error}
        </Alert>
      )}

      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Group Management</h1>
        <Button onClick={openCreateModal}>Create Group</Button>
      </div>

      {/* Groups Table */}
      <div className="overflow-x-auto">
        <Table hoverable>
          <TableHead>
            <TableRow>
              <TableHeadCell>ID</TableHeadCell>
              <TableHeadCell>Name</TableHeadCell>
              <TableHeadCell>Users</TableHeadCell>
              <TableHeadCell>Roles</TableHeadCell>
              <TableHeadCell>Actions</TableHeadCell>
            </TableRow>
          </TableHead>
          <TableBody className="divide-y">
            {groups.map((group) => (
              <TableRow
                key={group.id}
                className="bg-white dark:border-gray-700 dark:bg-gray-800"
              >
                <TableCell>{group.id}</TableCell>
                <TableCell className="font-medium text-gray-900 dark:text-white">
                  {group.name}
                </TableCell>
                <TableCell>
                  {group.userLinks.length > 0 ? (
                    <ul className="list-disc list-inside">
                      {group.userLinks.map((link) => (
                        <li key={link.user.id}>{link.user.username}</li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-gray-400">No users</span>
                  )}
                </TableCell>
                <TableCell>
                  {group.roleLinks.length > 0 ? (
                    <ul className="list-disc list-inside">
                      {group.roleLinks.map((link) => (
                        <li key={link.role.id}>{link.role.name}</li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-gray-400">No roles</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-2">
                    <Button size="xs" onClick={() => openEditModal(group)}>
                      Edit
                    </Button>
                    <Button
                      size="xs"
                      color="red"
                      onClick={() => deleteGroup(group.id)}
                    >
                      Delete
                    </Button>
                    <Button
                      size="xs"
                      color="light"
                      onClick={() => openAssignModal(group)}
                    >
                      Assign User
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Create Group Modal */}
      <Modal show={showCreateModal} onClose={closeModals}>
        <ModalHeader>Create New Group</ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <div>
               <Label htmlFor="edit-username">Group Name</Label>
              <TextInput
                id="create-name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter group name"
                required
              />
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button onClick={createGroup}>Create</Button>
          <Button color="gray" onClick={closeModals}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>

      {/* Edit Group Modal */}
      <Modal show={showEditModal} onClose={closeModals}>
        <ModalHeader>Edit Group</ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <div>
             <Label htmlFor="edit-username">Group Name</Label>
              <TextInput
                id="edit-name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter group name"
                required
              />
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button onClick={updateGroup}>Save Changes</Button>
          <Button color="gray" onClick={closeModals}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>

      {/* Assign User Modal */}
      <Modal show={showAssignModal} onClose={closeModals}>
        <ModalHeader>Assign User to Group</ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-username">Select User</Label>
              <Select
                id="assign-user"
                name="userId"
                value={assignData.userId}
                onChange={handleSelectChange}
                required
              >
                <option value="">Select a user</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.username}
                  </option>
                ))}
              </Select>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button onClick={assignUserToGroup}>Assign</Button>
          <Button color="gray" onClick={closeModals}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default Group;
