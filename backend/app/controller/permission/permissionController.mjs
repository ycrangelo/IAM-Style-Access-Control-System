import pkg from '../../generated/prisma/index.js';
const { PrismaClient } = pkg;
const prisma = new PrismaClient();

export async function create(req, res) {
  try {
    const { moduleId, action } = req.body;

    if (!moduleId || !action) {
      return res.status(400).json({ error: "Missing moduleId or action" });
    }

    const newPermission = await prisma.permission.create({
      data: {
        moduleId,
        action, // must be CREATE, READ, UPDATE, DELETE
      },
    });

    res.status(201).json({ data: newPermission });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create permission' });
  }
}


export async function edit(req, res) {
  try {
    const permissionId = parseInt(req.params.id, 10); // route: /permission/:id

    if (isNaN(permissionId)) {
      return res.status(400).json({ error: "Invalid permission ID" });
    }

    const { moduleId, action } = req.body;

    const data = {};
    if (moduleId) data.moduleId = moduleId;
    if (action) data.action = action; // must be CREATE, READ, UPDATE, DELETE

    if (Object.keys(data).length === 0) {
      return res.status(400).json({ error: "No fields provided to update" });
    }

    const updatedPermission = await prisma.permission.update({
      where: { id: permissionId },
      data,
    });

    res.json({
      message: "Permission updated successfully",
      permission: updatedPermission,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update permission" });
  }
}


//DELETE
export async function remove(req, res) {
  try {
    const moduleId = parseInt(req.params.id); //  route: /role/:id

    // Delete the user
    const deleteGroup = await prisma.permission.delete({
      where: { id: moduleId },
    });

    res.json({
      message: 'permission deleted successfully',
      user: deleteGroup,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete permission' });
  }
}

export async function get(req, res) {
  try {
    const permissions = await prisma.permission.findMany({
      include: {
        module: true, // show module details (name, description,
        roleLinks: {
          include: {
            role: true, // include Role details instead
          },
        },
      },
    });

    res.json(permissions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch permissions with roles' });
  }
}


//POST /roles/:roleId/permissions – Assign permissions to a role
export async function assignPermissionRole(req, res) {
  try {
    const roleId = parseInt(req.params.roleId, 10); 
    const { permissionId } = req.body; // from request body

    if (isNaN(roleId) || !permissionId) {
      return res.status(400).json({ error: "Missing roleId or permissionId" });
    }

    const rolePermission = await prisma.rolePermission.create({
      data: {
        role: { connect: { id: roleId } },
        permission: { connect: { id: permissionId } }
      }
    });

    res.status(201).json({
      message: "Permission assigned to role successfully",
      rolePermission
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to assign permission to role" });
  }
}