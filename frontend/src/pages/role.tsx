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
  Select,
  Alert,
  Badge,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "flowbite-react";
import Navbarr from "../components/navbar";

interface Permission {
  id: number;
  action: string;
  module: {
    name: string;
  };
}

interface Group {
  id: number;
  name: string;
}

interface Role {
  id: number;
  name: string;
  createdAt: string;
  permissionLinks: {
    permission: Permission;
  }[];
  groupLinks: {
    group: Group;
  }[];
}

const Role = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);

  const [currentRole, setCurrentRole] = useState<Role | null>(null);

  const [formData, setFormData] = useState({
    name: "",
  });

  const [assignData, setAssignData] = useState({
    groupId: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");

      const [rolesRes, groupsRes] = await Promise.all([
        axios.get("http://localhost:3000/api/role/get", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://localhost:3000/api/group/get", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setRoles(rolesRes.data);
      setGroups(groupsRes.data);
      setLoading(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAssignData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateClick = () => {
    setFormData({ name: "" });
    setShowCreateModal(true);
  };

  const handleEditClick = (role: Role) => {
    setCurrentRole(role);
    setFormData({ name: role.name });
    setShowEditModal(true);
  };

  const handleAssignClick = (role: Role) => {
    setCurrentRole(role);
    setAssignData({ groupId: "" });
    setShowAssignModal(true);
  };

  const handleCreateSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      await axios.post(
        "http://localhost:3000/api/role/post",
        { roleName: formData.name },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess("Role created successfully");
      setShowCreateModal(false);
      fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create role");
    }
  };

  const handleEditSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token || !currentRole) return;

      await axios.put(
        `http://localhost:3000/api/role/edit/${currentRole.id}`,
        { roleName: formData.name },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess("Role updated successfully");
      setShowEditModal(false);
      fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update role");
    }
  };

  const handleAssignSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token || !currentRole) return;

      await axios.post(
        `http://localhost:3000/api/role/${assignData.groupId}/roles`,
        { roleId: currentRole.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess("Role assigned to group successfully");
      setShowAssignModal(false);
      fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to assign role");
    }
  };

  const handleDelete = async (roleId: number) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      if (window.confirm("Are you sure you want to delete this role?")) {
        await axios.delete(`http://localhost:3000/api/role/delete/${roleId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSuccess("Role deleted successfully");
        fetchData();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete role");
    }
  };

  if (loading) return <div className="text-center py-4">Loading...</div>;

  return (
    <div className="p-4">
      <Navbarr />
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
        <h1 className="text-2xl font-bold">Role Management</h1>
        <Button onClick={handleCreateClick}>Create Role</Button>
      </div>

      {/* Roles Table */}
      <div className="overflow-x-auto">
        <Table hoverable>
          <TableHead>
            <TableRow>
              <TableHeadCell>ID</TableHeadCell>
              <TableHeadCell>Name</TableHeadCell>
              <TableHeadCell>Created At</TableHeadCell>
              <TableHeadCell>Permissions</TableHeadCell>
              <TableHeadCell>Groups</TableHeadCell>
              <TableHeadCell>Actions</TableHeadCell>
            </TableRow>
          </TableHead>
          <TableBody className="divide-y">
            {roles.map((role) => (
              <TableRow
                key={role.id}
                className="bg-white dark:border-gray-700 dark:bg-gray-800"
              >
                <TableCell>{role.id}</TableCell>
                <TableCell className="font-medium text-gray-900 dark:text-white">
                  {role.name}
                </TableCell>
                <TableCell>
                  {new Date(role.createdAt).toLocaleString()}
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {role.permissionLinks?.length ? (
                      role.permissionLinks.map((link) => (
                        <Badge key={link.permission.id} color="purple">
                          {link.permission.module?.name}:
                          {link.permission.action}
                        </Badge>
                      ))
                    ) : (
                      <Badge color="gray">No permissions</Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {role.groupLinks?.length ? (
                      role.groupLinks.map((link) => (
                        <Badge key={link.group.id} color="info">
                          {link.group.name}
                        </Badge>
                      ))
                    ) : (
                      <Badge color="gray">No groups</Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button size="xs" onClick={() => handleEditClick(role)}>
                      Edit
                    </Button>
                    <Button
                      size="xs"
                      color="red"
                      onClick={() => handleDelete(role.id)}
                    >
                      Delete
                    </Button>
                    <Button
                      size="xs"
                      color="light"
                      onClick={() => handleAssignClick(role)}
                    >
                      Assign to Group
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Create Role Modal */}
      <Modal show={showCreateModal} onClose={() => setShowCreateModal(false)}>
        <ModalHeader>Create New Role</ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <div>
              <Label htmlFor="create-name">Role Name</Label>
              <TextInput
                id="create-name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button onClick={handleCreateSubmit}>Create</Button>
          <Button color="gray" onClick={() => setShowCreateModal(false)}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>

      {/* Edit Role Modal */}
      <Modal show={showEditModal} onClose={() => setShowEditModal(false)}>
        <ModalHeader>Edit Role</ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Role Name</Label>
              <TextInput
                id="edit-name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button onClick={handleEditSubmit}>Save Changes</Button>
          <Button color="gray" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>

      {/* Assign Role to Group Modal */}
      <Modal show={showAssignModal} onClose={() => setShowAssignModal(false)}>
        <ModalHeader>Assign Role to Group</ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <div>
              <Label htmlFor="assign-group">Select Group</Label>
              <Select
                id="assign-group"
                name="groupId"
                value={assignData.groupId}
                onChange={handleSelectChange}
                required
              >
                <option value="">Select a group</option>
                {groups.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.name}
                  </option>
                ))}
              </Select>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button onClick={handleAssignSubmit}>Assign</Button>
          <Button color="gray" onClick={() => setShowAssignModal(false)}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default Role;
