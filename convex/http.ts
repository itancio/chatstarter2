import { httpRouter } from 'convex/server';
import { httpAction } from './_generated/server';
import { Webhook } from 'svix';
import type { WebhookEvent } from '@clerk/nextjs/server';
import { internal } from './_generated/api';

const http = httpRouter();

http.route({
    method: "POST",
    path: '/clerk-webhook',
    handler: httpAction(async (ctx, req) => {
        const body = await validateRequest(req);
        if (!body) {
            return new Response('Unauthorized', { status: 401 });
        }

        switch (body.type) {
            case 'user.created':
                await ctx.runMutation(internal.functions.user.upsert, { 
                    username: body.data.username!,
                    image: body.data.image_url,
                    clerkId: body.data.id,
                });
                break;
            case 'user.updated':
                await ctx.runMutation(internal.functions.user.upsert, { 
                    username: body.data.username!,
                    image: body.data.image_url,
                    clerkId: body.data.id,
                });
                break;
            case 'user.deleted':
                if (body.data.id) {
                    await ctx.runMutation(internal.functions.user.remove, { 
                        clerkId: body.data.id,
                    });
                }
                break;
            default:
                return new Response('Unrecognized event', { status: 400 });
        }

        return new Response('OK', { status: 200 });
    }),
});

const validateRequest = async (req: Request) => {
    const headers = req.headers;

    // Request content
    const text = await req.text();

    const svix_id = headers.get('svix-id');
    const svix_timestamp = headers.get('svix-timestamp');
    const svix_signature = headers.get('svix-signature');

    try {
        // Initialize webhook
        const webhook = new Webhook(process.env.CLERK_WEBHOOK_SECRET!);
        return webhook.verify(text, {
            'svix-id': svix_id!,
            'svix-timestamp': svix_timestamp!,
            'svix-signature': svix_signature!,
        }) as unknown as WebhookEvent;
    } catch (error) {
        console.error('Webhook verification failed in https.ts:', error);
        return null;
    }
};

export default http;
