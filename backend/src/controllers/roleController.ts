import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Role from '../models/Role';
import { ALL_PERMISSIONS, ROLE_PERMISSIONS } from '../config/permissions';

// @desc    Get all roles and permissions configuration
// @route   GET /api/roles
// @access  SuperAdmin / Admin
export const getRoles = async (req: Request, res: Response) => {
  try {
    let roles = await Role.find().sort({ name: 1 });

    // Seed defaults in-memory if DB has not been seeded yet
    if (!roles || roles.length === 0) {
      const defaultRoles = Object.entries(ROLE_PERMISSIONS).map(([name, permissions]) => ({
        name,
        permissions,
      }));
      return res.status(200).json({
        success: true,
        roles: defaultRoles,
        allPermissions: ALL_PERMISSIONS,
        defaultRolePermissions: ROLE_PERMISSIONS,
      });
    }

    return res.status(200).json({
      success: true,
      roles,
      allPermissions: ALL_PERMISSIONS,
      defaultRolePermissions: ROLE_PERMISSIONS,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to fetch roles', error: error.message });
  }
};

// @desc    Update permissions for a specific role
// @route   PUT /api/roles/:id/permissions
// @access  SuperAdmin
export const updateRolePermissions = async (req: Request, res: Response) => {
  try {
    const rawId = req.params.id;
    const target = Array.isArray(rawId) ? rawId[0] : rawId;
    const { permissions } = req.body;

    if (!Array.isArray(permissions)) {
      return res.status(400).json({ success: false, message: 'Permissions must be an array of strings' });
    }

    // Validate every permission against canonical ALL_PERMISSIONS
    const validSet = new Set<string>(ALL_PERMISSIONS);
    const invalidPermissions = permissions.filter((p: string) => typeof p !== 'string' || !validSet.has(p));

    if (invalidPermissions.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Invalid permissions provided: ${invalidPermissions.join(', ')}`,
        invalidPermissions,
      });
    }

    const query = mongoose.Types.ObjectId.isValid(target)
      ? { _id: target }
      : { name: target };

    let role = await Role.findOne(query);
    if (!role) {
      // Create role document if it didn't exist in MongoDB yet
      if (typeof target === 'string' && !mongoose.Types.ObjectId.isValid(target)) {
        role = await Role.create({ name: target, permissions });
      } else {
        return res.status(404).json({ success: false, message: 'Role not found' });
      }
    } else {
      role.permissions = permissions;
      await role.save();
    }

    return res.status(200).json({
      success: true,
      message: `Permissions updated successfully for role ${role.name}`,
      role,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to update role permissions', error: error.message });
  }
};
