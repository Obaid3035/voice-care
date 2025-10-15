import type { FastifyReply, FastifyRequest } from 'fastify';
import { generateSessionToken } from '../../utils/helpers/jwt.helper';
import { BadRequest } from '../../utils/http-errors';
import {
  checkMacAddressExists,
  checkUserExists,
  createDevice,
  createDeviceToken,
} from '../../utils/queries/device';
import type { ProvisionDeviceParams } from './provisioning.schema';

interface ProvisionDeviceRequest extends FastifyRequest {
  params: ProvisionDeviceParams;
}

export const provisionDeviceController = async (
  request: ProvisionDeviceRequest,
  reply: FastifyReply
) => {
  try {
    const { user_id, mac_address } = request.params;

    // Check if user exists
    const userExists = await checkUserExists(user_id);
    if (!userExists) {
      return reply.status(404).send({
        success: false,
        message: 'User not found',
      });
    }

    // Check if MAC address is already registered
    const macExists = await checkMacAddressExists(mac_address);
    if (macExists) {
      return reply.status(409).send({
        success: false,
        message: 'MAC address already provisioned',
      });
    }

    // Create the device
    const device = await createDevice(user_id, mac_address);

    // Generate session token (expires in 2 days)
    const { token, expiry_time } = generateSessionToken(user_id, device.id, 2);

    // Store token in device_tokens table
    await createDeviceToken(device.id, token, expiry_time, user_id);

    // Return success response with token
    return reply.status(201).send({
      success: true,
      token,
    });
  } catch (error) {
    console.error('Provision device error:', error);

    if (error instanceof BadRequest) {
      return reply.status(400).send({
        success: false,
        message: error.message,
      });
    }

    return reply.status(500).send({
      success: false,
      message: 'Failed to provision device',
    });
  }
};
