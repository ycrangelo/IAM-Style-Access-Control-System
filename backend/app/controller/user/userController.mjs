import pkg from '../../generated/prisma/index.js';
const { PrismaClient } = pkg;
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

//create user
export async function create(req, res) {
  const { username, password } = req.body;
  
  if (!username || !password) {
    res.status(500).json({ error: "missing username or password" });
  }
  try {
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
   data: {
    username,
    passwordHash:hashedPassword
     }
     
    })
   res.status(201).json({ data: newUser });
  } catch (e) {
    res.status(500).json({ error: "error at creating user",details:e });
  }
}
//View users and their group memberships
//test kong may membership or group na
//get all users with thier group
export async function get(req, res) {
  try {
    const users = await prisma.user.findMany({
      include: {
        groupLinks: {
          include: {
            group: true, // include the group info for each link
          },
        },
      },
    });
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
}

//edit PUT
export async function edit(req, res) {
  try {
    const userId = parseInt(req.params.id); //  route: /users/:id
    const { username, password } = req.body;

    // Prepare the update object
   const data = {};
    //cheking kong meron username
   if (username) {
     data.username = username;
   }
       //cheking kong meron password
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      data.passwordHash = hashedPassword;
    }

    // Update the user
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data,
    });

    res.json({
      message: 'User updated successfully',
      user: updatedUser
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update user' });
  }
}

//DELETE
export async function remove(req, res) {
  try {
    const userId = parseInt(req.params.id); //  route: /users/:id

    // Delete the user
    const deletedUser = await prisma.user.delete({
      where: { id: userId },
    });

    res.json({
      message: 'User deleted successfully',
      user: deletedUser,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({ error: 'Failed to delete user' });
  }
}