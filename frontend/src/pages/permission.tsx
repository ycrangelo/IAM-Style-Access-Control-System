import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
  Badge,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  TextInput,
  Label,
  Select,
  Alert,
} from "flowbite-react";

interface Module {
  id: number;
  name: string;
  description?: string | null;
}

interface Role {
  id: number;
  name: string;
}

interface Permission {
  id: number;
  action: string;
  module: Module;
  roleLinks: { role: Role }[];
}

const PermissionPage = () => {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);

  const [currentPermission, setCurrentPermission] = useState<Permission | null>(
    null
  );

  const [formData, setFormData] = useState({
    moduleId: "",
    action: "",
  });

  const [assignData, setAssignData] = useState({
    roleId: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");

      const [permRes, modRes, roleRes] = await Promise.all([
        axios.get("http://localhost:3000/api/permission/get", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://localhost:3000/api/module/get", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://localhost:3000/api/role/get", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setPermissions(permRes.data);
      setModules(modRes.data);
      setRoles(roleRes.data);
      setLoading(false);
      console.log(permRes.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch data");
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAssignChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setAssignData({ roleId: value });
  };

  const handleCreateSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      await axios.post(
        "http://localhost:3000/api/permission/post",
        {
          moduleId: parseInt(formData.moduleId, 10),
          action: formData.action,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess("Permission created successfully");
      setShowCreateModal(false);
      fetchData();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create permission"
      );
    }
  };

  const handleEditSubmit = async () => {
    if (!currentPermission) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      await axios.put(
        `http://localhost:3000/api/permission/edit/${currentPermission.id}`,
        {
          moduleId: parseInt(formData.moduleId, 10),
          action: formData.action,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess("Permission updated successfully");
      setShowEditModal(false);
      fetchData();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update permission"
      );
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this permission?"))
      return;
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      await axios.delete(`http://localhost:3000/api/permission/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSuccess("Permission deleted successfully");
      fetchData();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete permission"
      );
    }
  };

  const handleAssignSubmit = async () => {
    if (!currentPermission) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      await axios.post(
        `http://localhost:3000/api/permission/${assignData.roleId}/permissions`,
        { permissionId: currentPermission.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess("Permission assigned to role successfully");
      setShowAssignModal(false);
      fetchData();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to assign permission"
      );
    }
  };

  if (loading) return <div className="text-center py-4">Loading...</div>;

  return (
    <div className="p-4">
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

      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Permissions</h1>
        <Button onClick={() => setShowCreateModal(true)}>
          Create Permission
        </Button>
      </div>

      <div className="overflow-x-auto">
        <Table hoverable>
          <TableHead>
            <TableRow>
              <TableHeadCell>ID</TableHeadCell>
              <TableHeadCell>Action</TableHeadCell>
              <TableHeadCell>Module Name</TableHeadCell>
              <TableHeadCell>Description</TableHeadCell>
              <TableHeadCell>Roles</TableHeadCell>
              <TableHeadCell>Actions</TableHeadCell>
            </TableRow>
          </TableHead>
          <TableBody className="divide-y">
            {permissions.map((perm) => (
              <TableRow
                key={perm.id}
                className="bg-white dark:border-gray-700 dark:bg-gray-800"
              >
                <TableCell>{perm.id}</TableCell>
                <TableCell>{perm.action}</TableCell>
                <TableCell>{perm.module.name}</TableCell>
                <TableCell>{perm.module.description ?? "-"}</TableCell>
                <TableCell>
                  {perm.roleLinks.length > 0 ? (
                    perm.roleLinks.map((link) => (
                      <Badge key={link.role.id} color="info">
                        {link.role.name}
                      </Badge>
                    ))
                  ) : (
                    <Badge color="gray">No roles</Badge>
                  )}
                </TableCell>
                <TableCell className="flex gap-2">
                  <Button
                    size="xs"
                    onClick={() => {
                      setCurrentPermission(perm);
                      setFormData({
                        moduleId: perm.module.id.toString(),
                        action: perm.action,
                      });
                      setShowEditModal(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    size="xs"
                    color="red"
                    onClick={() => handleDelete(perm.id)}
                  >
                    Delete
                  </Button>
                  <Button
                    size="xs"
                    color="light"
                    onClick={() => {
                      setCurrentPermission(perm);
                      setAssignData({ roleId: "" });
                      setShowAssignModal(true);
                    }}
                  >
                    Assign Role
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Create Modal */}
      <Modal show={showCreateModal} onClose={() => setShowCreateModal(false)}>
        <ModalHeader>Create Permission</ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <div>
              <Label>Module</Label>
              <Select
                name="moduleId"
                value={formData.moduleId}
                onChange={handleInputChange}
              >
                <option value="">Select Module</option>
                {modules.map((mod) => (
                  <option key={mod.id} value={mod.id}>
                    {mod.name}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label>Action</Label>
              <Select
                name="action"
                value={formData.action}
                onChange={handleInputChange}
              >
                <option value="">Select Action</option>
                <option value="CREATE">CREATE</option>
                <option value="READ">READ</option>
                <option value="UPDATE">UPDATE</option>
                <option value="DELETE">DELETE</option>
              </Select>
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

      {/* Edit Modal */}
      <Modal show={showEditModal} onClose={() => setShowEditModal(false)}>
        <ModalHeader>Edit Permission</ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <div>
              <Label>Module</Label>
              <Select
                name="moduleId"
                value={formData.moduleId}
                onChange={handleInputChange}
              >
                <option value="">Select Module</option>
                {modules.map((mod) => (
                  <option key={mod.id} value={mod.id}>
                    {mod.name}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label>Action</Label>
              <Select
                name="action"
                value={formData.action}
                onChange={handleInputChange}
              >
                <option value="">Select Action</option>
                <option value="CREATE">CREATE</option>
                <option value="READ">READ</option>
                <option value="UPDATE">UPDATE</option>
                <option value="DELETE">DELETE</option>
              </Select>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button onClick={handleEditSubmit}>Save</Button>
          <Button color="gray" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>

      {/* Assign Modal */}
      {/* Assign Modal */}
      <Modal show={showAssignModal} onClose={() => setShowAssignModal(false)}>
        <ModalHeader>Assign Permission to Role</ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <div>
              <Label htmlFor="assign-role">Select Role</Label>
              <Select
                id="assign-role"
                name="roleId"
                value={assignData.roleId}
                onChange={handleAssignChange}
                required
              >
                <option value="">Select Role</option>
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
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

export default PermissionPage;
