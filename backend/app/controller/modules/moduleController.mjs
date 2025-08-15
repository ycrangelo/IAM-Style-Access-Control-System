import pkg from '../../generated/prisma/index.js';
const { PrismaClient } = pkg;

const prisma = new PrismaClient();


//create a module
export async function create(req, res) {
  try {
    const { moduleName,description } = req.body;

    if (!moduleName) {
      return res.status(400).json({ error: "Missing module Name" });
    }

    const newModule = await prisma.module.create({
      data: {
        name: moduleName,
        description
      }
    });

    res.status(201).json({ data: newModule });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create role' });
  }
}


//get all module with thier permission
export async function get(req, res) {
  try {
    const modules = await prisma.module.findMany({
      include: {
        permissions: {
          include: {
            roleLinks: {
              include: {
                role: {
                  include: {
                    groupLinks: {
                      include: {
                        group: true // get the groups for each role
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });

    res.json(modules);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch modules' });
  }
}


//DELETE
export async function remove(req, res) {
  try {
    const moduleId = parseInt(req.params.id); //  route: /modeule/:id

    // Delete the user
    const deleteModule = await prisma.module.delete({
      where: { id: moduleId },
    });

    res.json({
      message: 'modeule deleted successfully',
      user: deleteModule,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete modeule' });
  }
}


//edit PUT moduele
export async function edit(req, res) {
 try {
  const moduleId = Number(req.params.id); //  route: /moduele/:id
  const { moduleName,description } = req.body;

   console.log("this is the modulename",moduleName)
  // Prepare the update object
  const data = {};

  //cheking kong meron moduele
  if (moduleName) {
   data.name = moduleName;
   data.description=description
  }
      console.log("this is the data modulename",data.description)

  // Update the moduele 
  const updateModule = await prisma.module.update({
   where: { id: moduleId },
   data,
  });

  res.json({
   message: 'moduele updated successfully',
   user: updateModule
  });

 } catch (err) {
  console.error(err);
  res.status(500).json({ error: 'Failed to update moduele' });
 }
}