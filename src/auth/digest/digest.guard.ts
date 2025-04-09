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

    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Digest ')) {
      this.sendUnauthorized(response);
      return false;
    }

    const authParams = this.parseDigestHeader(authHeader);

    if (!this.validateDigestRequest(authParams)) {
      this.sendUnauthorized(response);
      return false;
    }

    return true;
  }

  private parseDigestHeader(authHeader: string): Record<string, string> {
    const parts = authHeader.substring(7).split(',');
    const params: Record<string, string> = {};

    parts.forEach((part) => {
      const [key, value] = part.trim().split('=');
      params[key] = value.replace(/"/g, '');
    });

    return params;
  }

  private validateDigestRequest(params: Record<string, string>): boolean {
    if (params.username !== this.username) {
      return false;
    }

    // HA1 = MD5(username:realm:password)
    const ha1 = crypto
      .createHash('md5')
      .update(`${this.username}:${this.realm}:${this.password}`)
      .digest('hex');

    // HA2 = MD5(method:digestURI)
    const ha2 = crypto
      .createHash('md5')
      .update(`${params.method}:${params.uri}`)
      .digest('hex');

    // Response = MD5(HA1:nonce:nonceCount:cnonce:qop:HA2)
    const expectedResponse = crypto
      .createHash('md5')
      .update(
        `${ha1}:${params.nonce}:${params.nc}:${params.cnonce}:${params.qop}:${ha2}`,
      )
      .digest('hex');

    return expectedResponse === params.response;
  }

  private sendUnauthorized(response: any): void {
    const nonce = crypto.randomBytes(16).toString('hex');
    const opaque = crypto.randomBytes(16).toString('hex');

    response.header(
      'WWW-Authenticate',
      `Digest realm="${this.realm}", qop="auth", nonce="${nonce}", opaque="${opaque}"`,
    );

    throw new UnauthorizedException();
  }
}
