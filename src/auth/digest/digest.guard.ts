import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class DigestGuard implements CanActivate {
  private readonly username = 'aws';
  private readonly password = 'candidate';
  private readonly realm = 'AWS Candidate Test';

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    // Get the authorization header
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Digest ')) {
      this.challengeClient(response);
      return false;
    }

    // Parse the authorization header
    const digestParts = this.parseDigestAuth(authHeader);

    // Verify username
    if (digestParts.username !== this.username) {
      this.challengeClient(response);
      return false;
    }

    // Calculate the expected response
    const ha1 = crypto
      .createHash('md5')
      .update(`${this.username}:${this.realm}:${this.password}`)
      .digest('hex');
    const ha2 = crypto
      .createHash('md5')
      .update(`${request.method}:${digestParts.uri}`)
      .digest('hex');

    let expectedResponse;
    if (digestParts.qop) {
      expectedResponse = crypto
        .createHash('md5')
        .update(
          `${ha1}:${digestParts.nonce}:${digestParts.nc}:${digestParts.cnonce}:${digestParts.qop}:${ha2}`,
        )
        .digest('hex');
    } else {
      expectedResponse = crypto
        .createHash('md5')
        .update(`${ha1}:${digestParts.nonce}:${ha2}`)
        .digest('hex');
    }

    if (digestParts.response !== expectedResponse) {
      this.challengeClient(response);
      return false;
    }

    return true;
  }

  private parseDigestAuth(authHeader: string): any {
    const digestString = authHeader.substr(7);
    const parts = digestString.split(',');
    const digestParts: any = {};

    for (const part of parts) {
      const [key, value] = part.trim().split('=');
      digestParts[key] = value.replace(/"/g, '');
    }

    return digestParts;
  }

  private challengeClient(response: any): void {
    const nonce = crypto.randomBytes(16).toString('hex');
    const opaque = crypto.randomBytes(8).toString('hex');

    response.setHeader(
      'WWW-Authenticate',
      `Digest realm="${this.realm}", qop="auth", algorithm=MD5, nonce="${nonce}", opaque="${opaque}"`,
    );

    throw new UnauthorizedException('Digest authentication required');
  }
}
