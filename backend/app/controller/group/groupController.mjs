import pkg from '../../generated/prisma/index.js';
const { PrismaClient } = pkg;

const prisma = new PrismaClient();


//create a group
export async function create(req, res) {
  try {
    const { groupName } = req.body;

    if (!groupName) {
      return res.status(400).json({ error: "Missing Group Name" });
    }

    const newGroup = await prisma.group.create({
      data: {
        name:groupName
      }
    });

    res.status(201).json({ data: newGroup });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create group' });
  }
}

//edit PUT group
export async function edit(req, res) {
 try {
  const groupId = parseInt(req.params.id); //  route: /group/:id
  const { groupName } = req.body;

  // Prepare the update object
  const data = {};

  //cheking kong meron group
  if (groupName) {
   data.name = groupName;
  }

  // Update the group
  const updateGroup = await prisma.group.update({
   where: { id: groupId },
   data,
  });

  res.json({
   message: 'group updated successfully',
   user: updateGroup
  });

 } catch (err) {
  console.error(err);
  res.status(500).json({ error: 'Failed to update group' });
 }
}


//DELETE
export async function remove(req, res) {
  try {
    const groupId = parseInt(req.params.id); //  route: /group/:id

    // Delete the user
    const deleteGroup = await prisma.group.delete({
      where: { id: groupId },
    });

    res.json({
      message: 'group deleted successfully',
      user: deleteGroup,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete group' });
  }
}

//get all users with thier group
export async function get(req, res) {
  try {
    const groups = await prisma.group.findMany({
      include: {
        userLinks: {
          include: {
            user: true // fetch user details for each group-user link
          }
        },
        roleLinks: {
          include: {
            role: true // fetch role details for each group-role link
          }
        }
      }
    });

    res.json(groups);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch groups with users and roles' });
  }
}


//POST /groups/:groupId/users – Assign users to group

export async function asignUserGroup(req,res) {
 const groupId = parseInt(req.params.groupId); //  route: /group/:id
  const { userId } = req.body;
  console.log('groupId:', req.params.id, 'userId:', req.body.userId);

 try {

  if (!userId) {
   res.status(400).json({ error: "missing userId" });
  }

  const addUserGroup = await prisma.groupUser.create({
  data: {
    group: { connect: { id: groupId } }, // groupId from req.params
    user:  { connect: { id: userId } }   // userId from req.body
  }
});
  res.json({
   message: 'Added user to a group successfully',
   userGroup: addUserGroup
  });

 } catch (error) {
   console.error(error);
   res.status(500).json({ error: 'Failed to Added user to a group' });
 }
}