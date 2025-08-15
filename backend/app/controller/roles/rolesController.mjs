import pkg from '../../generated/prisma/index.js';
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

//create a role
export async function create(req, res) {
  try {
    const { roleName } = req.body;

    if (!roleName) {
      return res.status(400).json({ error: "Missing role Name" });
    }

    const newRole = await prisma.role.create({
      data: {
        name:roleName
      }
    });

    res.status(201).json({ data: newRole });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create role' });
  }
}

//edit PUT role
export async function edit(req, res) {
 try {
  const roleId = parseInt(req.params.id); //  route: /role/:id
  const { roleName } = req.body;

  // Prepare the update object
  const data = {};

  //cheking kong meron role
  if (roleName) {
   data.name = roleName;
  }

  // Update the role 
  const updateGroup = await prisma.role.update({
   where: { id: roleId },
   data,
  });

  res.json({
   message: 'Role updated successfully',
   user: updateGroup
  });

 } catch (err) {
  console.error(err);
  res.status(500).json({ error: 'Failed to update Role' });
 }
}

//DELETE
export async function remove(req, res) {
  try {
    const roleId = parseInt(req.params.id); //  route: /role/:id

    // Delete the user
    const deleteGroup = await prisma.role.delete({
      where: { id: roleId },
    });

    res.json({
      message: 'role deleted successfully',
      user: deleteGroup,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete role' });
  }
}

//get all roles with thier group and permission
export async function get(req, res) {
  try {
    const roles = await prisma.role.findMany({
      include: {
        permissionLinks: {
          include: {
            permission: true, // include Permission details
          },
        },
        groupLinks: {
          include: {
            group: true, // include Group details
          },
        },
      },
    });

    res.json(roles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch groups with users and roles' });
  }
}

//POST /groups/:groupId/roles – Assign roles to groups

export async function asignRolesGroup(req,res) {
 const groupId = parseInt(req.params.groupId); //  route: /group/:id
  const { roleId } = req.body;
  console.log('groupId:', req.params.groupId, 'roleId:', req.body.roleId);

 try {

  if (!roleId) {
   res.status(400).json({ error: "missing groupId" });
  }

  const addRoleGroup = await prisma.groupRole.create({
  data: {
    group: { connect: { id: groupId } }, 
    role:  { connect: { id: roleId } }   
  }
});
  res.json({
   message: 'Added user to a role successfully',
   roleGroup: addRoleGroup
  });

 } catch (error) {
   console.error(error);
   res.status(500).json({ error: 'Failed to Added user to a role' });
 }
}
