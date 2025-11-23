// src/auth/google-auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class GoogleAuthService {
  private client: OAuth2Client;

  constructor() {
    const clientIds = process.env.CLIENT_ID;
    if (!clientIds) {
      throw new Error('GOOGLE_CLIENT_IDS not defined in environment variables');
    }

    this.client = new OAuth2Client(clientIds.split(',')[0]) 
  }

  async verifyGoogleToken(idToken: string) {
    const clientIds = process.env.CLIENT_ID;
    if (!clientIds) {
      throw new UnauthorizedException('Google client IDs not configured');
    }

    try {
      const ticket = await this.client.verifyIdToken({
        idToken,
        audience: clientIds.split(','),
      });

      const payload = ticket.getPayload();
      return payload; // email, name, picture ...
    } catch (err) {
      throw new UnauthorizedException('Invalid Google Token');
    }
  }
}
