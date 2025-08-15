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
  Alert,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  TextInput,
  Label,
} from "flowbite-react";
import Navbarr from "../components/navbar";

interface Permission {
  id: number;
  action: string;
}

interface Module {
  id: number;
  name: string;
  description?: string | null;
  permissions: Permission[];
}

const Module = () => {
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentModule, setCurrentModule] = useState<Module | null>(null);
  const [formData, setFormData] = useState({ moduleName: "", description: "" });

  useEffect(() => {
    fetchModules();
  }, []);

  const fetchModules = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");

      const res = await axios.get("http://localhost:3000/api/module/get", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setModules(res.data);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch modules");
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateModule = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      await axios.post(
        "http://localhost:3000/api/module/post",
        { moduleName: formData.moduleName, description: formData.description },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess("Module created successfully");
      setShowCreateModal(false);
      fetchModules();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create module");
    }
  };

  const handleEditModule = async () => {
    if (!currentModule) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      await axios.put(
        `http://localhost:3000/api/module/edit/${currentModule.id}`,
        { moduleName: formData.moduleName, description: formData.description },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess("Module updated successfully");
      setShowEditModal(false);
      fetchModules();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update module");
    }
  };

  const handleDeleteModule = async (moduleId: number) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      if (!window.confirm("Are you sure you want to delete this module?"))
        return;

      await axios.delete(
        `http://localhost:3000/api/module/delete/${moduleId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSuccess("Module deleted successfully");
      fetchModules();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete module");
    }
  };

  const openEditModal = (mod: Module) => {
    setCurrentModule(mod);
    setFormData({ moduleName: mod.name, description: mod.description ?? "" });
    setShowEditModal(true);
  };

  if (loading) return <div className="text-center py-4">Loading...</div>;

  return (
    <div className="p-4">
      <Navbarr />
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
        <h1 className="text-2xl font-bold">Modules Management</h1>
        <Button onClick={() => setShowCreateModal(true)}>Create Module</Button>
      </div>

      <div className="overflow-x-auto">
        <Table hoverable>
          <TableHead>
            <TableRow>
              <TableHeadCell>ID</TableHeadCell>
              <TableHeadCell>Name</TableHeadCell>
              <TableHeadCell>Description</TableHeadCell>
              <TableHeadCell>Permissions</TableHeadCell>
              <TableHeadCell>Actions</TableHeadCell>
            </TableRow>
          </TableHead>
          <TableBody className="divide-y">
            {modules.map((mod) => (
              <TableRow
                key={mod.id}
                className="bg-white dark:border-gray-700 dark:bg-gray-800"
              >
                <TableCell>{mod.id}</TableCell>
                <TableCell className="font-medium text-gray-900 dark:text-white">
                  {mod.name}
                </TableCell>
                <TableCell>{mod.description ?? "-"}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {mod.permissions.length > 0 ? (
                      mod.permissions.map((perm) => (
                        <Badge key={perm.id} color="purple">
                          {perm.action}
                        </Badge>
                      ))
                    ) : (
                      <Badge color="gray">No permissions</Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button size="xs" onClick={() => openEditModal(mod)}>
                      Edit
                    </Button>
                    <Button
                      size="xs"
                      color="red"
                      onClick={() => handleDeleteModule(mod.id)}
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

      {/* Create Module Modal */}
      <Modal show={showCreateModal} onClose={() => setShowCreateModal(false)}>
        <ModalHeader>Create Module</ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <div>
              <Label htmlFor="moduleName">Module Name</Label>
              <TextInput
                id="moduleName"
                name="moduleName"
                value={formData.moduleName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <TextInput
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button onClick={handleCreateModule}>Create</Button>
          <Button color="gray" onClick={() => setShowCreateModal(false)}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>

      {/* Edit Module Modal */}
      <Modal show={showEditModal} onClose={() => setShowEditModal(false)}>
        <ModalHeader>Edit Module</ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <div>
              <Label htmlFor="moduleNameEdit">Module Name</Label>
              <TextInput
                id="moduleNameEdit"
                name="moduleName"
                value={formData.moduleName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="descriptionEdit">Description</Label>
              <TextInput
                id="descriptionEdit"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button onClick={handleEditModule}>Save Changes</Button>
          <Button color="gray" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default Module;
