# Discord Clone

This is a Discord clone with real-time chat and video functionality. You'll build a React frontend with Tailwind CSS, a backend API using Convex, and integrate WebRTC for real-time video and audio.

[Tutorial](tutorial/tutorial.ipynb)

Tech Stacks: 
* Typescript
* Tailwind CSS
* Nodejs
* Convex for backedn API
* Clerk for authorization

Skills:
* Chat and Video
* 


## Sources
[Tour of Convex](https://docs.convex.dev/get-started)
[Convex Functions](https://docs.convex.dev/functions)
[Convex Database](https://docs.convex.dev/database)
[Convex & Clerk](https://docs.convex.dev/auth/clerk)
[Clerk Webhooks](https://clerk.com/docs/integrations/webhooks/sync-data)

# Developer's Notes

## Reinitialize convex
npx convex dev --configure=existing --team irvin-tancioco --project proj-chatstarter

```bash
    ## development dependency
    pnpm add -D npm-run-all
    pnpm convex dev
    pnpm add @clerk/nextjs
    pnpm add svix
    pnpm add convex-helpers
    pnpm add groq-sdk
    pnpm add openai

    # For UI
    npx shadcn init
    npx shadcn add sidebar
    npx shadcn add dialog
    npx shadcn add label
    npx shadcn add sonner
    npx shadcn add avatar
    npx shadcn add dropdown-menu
    npx shadcn add scroll-area
```

## package for sycning clerk data to your webhook
[Sync Clerk data to your application with webhooks](https://clerk.com/docs/integrations/webhooks/sync-data#install-svix)
```bash
    pnpm add svix
```


