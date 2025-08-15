import pkg from '../../generated/prisma/index.js';
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

// GET /me/permissions
export async function getMyPermissions(req, res) {
  try {
    const userId = req.user?.id; // depends on your auth middleware

    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    // Fetch user's permissions through groups -> roles -> permissions
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        groupLinks: {
          include: {
            group: {
              include: {
                roleLinks: {
                  include: {
                    role: {
                      include: {
                        permissionLinks: {
                          include: {
                            permission: {
                              include: { module: true }
                            }
                          }
                        }
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

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Flatten permissions (may have duplicates)
    const permissions = user.groupLinks.flatMap(gl =>
      gl.group.roleLinks.flatMap(rl =>
        rl.role.permissionLinks.map(pl => ({
          permissionId: pl.permission.id,
          action: pl.permission.action,
          module: pl.permission.module.name
        }))
      )
    );

    // Remove duplicates
    const uniquePermissions = Array.from(
      new Map(
        permissions.map(p => [p.permissionId, p])
      ).values()
    );

    res.json({ userId, permissions: uniquePermissions });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch user permissions" });
  }
}


/**
 * POST /simulate-action
 * Body: { userId: number, moduleName: string, action: string }
 */
export async function simulateAction(req, res) {
  try {
    const userId = req.user?.id; 
    const { moduleName, action } = req.body;

    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    if (!moduleName || !action) {
      return res.status(400).json({ error: "Missing moduleName or action" });
    }

    // Fetch user's permissions through groups -> roles -> permissions
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        groupLinks: {
          include: {
            group: {
              include: {
                roleLinks: {
                  include: {
                    role: {
                      include: {
                        permissionLinks: {
                          include: {
                            permission: {
                              include: { module: true }
                            }
                          }
                        }
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

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Flatten permissions
    const permissions = user.groupLinks.flatMap(gl =>
      gl.group.roleLinks.flatMap(rl =>
        rl.role.permissionLinks.map(pl => ({
          permissionId: pl.permission.id,
          action: pl.permission.action,
          module: pl.permission.module.name
        }))
      )
    );

    // Check if any permission matches the module + action
    const allowed = permissions.some(
      p =>
        p.module.toLowerCase() === moduleName.toLowerCase() &&
        p.action.toLowerCase() === action.toLowerCase()
    );

    res.json({allowed });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to simulate action" });
  }
}
