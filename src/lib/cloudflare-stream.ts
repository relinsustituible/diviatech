/**
 * Cloudflare Stream integration for live streams.
 */

export class CloudflareStreamService {
  private accountId: string;
  private apiToken: string;

  constructor(accountId: string, apiToken: string) {
    this.accountId = accountId;
    this.apiToken = apiToken;
  }

  async createLiveInput(consultationId: string, description?: string): Promise<string | null> {
    try {
      const response = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${this.accountId}/stream/live_inputs`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${this.apiToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            meta: {
              name: `consultation-${consultationId}-${description || 'teleconsulta'}`,
            },
          }),
        },
      );

      const data = (await response.json()) as any;
      if (data?.success && data?.result?.uid) {
        return data.result.uid;
      }

      console.error('Cloudflare Stream createLiveInput failed:', data);
      return null;
    } catch (error) {
      console.error('Cloudflare Stream error:', error);
      return null;
    }
  }

  async getRtmpsUrl(streamId: string): Promise<{ url: string; streamKey: string } | null> {
    try {
      const response = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${this.accountId}/stream/live_inputs/${streamId}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${this.apiToken}`,
          },
        },
      );

      const data = (await response.json()) as any;
      if (data?.success && data?.result?.rtmps) {
        return {
          url: data.result.rtmps.url,
          streamKey: data.result.rtmps.streamKey,
        };
      }

      return null;
    } catch (error) {
      console.error('Cloudflare Stream status error:', error);
      return null;
    }
  }

  getStreamEmbedUrl(streamId: string): string {
    return `https://customer-${streamId}.cloudflarestream.com/`;
  }
}

export function initializeStreamService(accountId?: string, apiToken?: string): CloudflareStreamService | null {
  const resolvedAccountId = accountId || process.env.CLOUDFLARE_ACCOUNT_ID;
  const resolvedApiToken = apiToken || process.env.CLOUDFLARE_API_TOKEN;

  if (!resolvedAccountId || !resolvedApiToken) {
    console.warn('Cloudflare Stream is not configured. Set CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN.');
    return null;
  }

  return new CloudflareStreamService(resolvedAccountId, resolvedApiToken);
}
