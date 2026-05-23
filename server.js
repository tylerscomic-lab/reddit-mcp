import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const MODEL = 'llama-3.3-70b-versatile';

async function ask(prompt) {
  const res = await groq.chat.completions.create({
    model: MODEL,
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
    max_tokens: 1500,
  });
  return res.choices[0].message.content;
}

const server = new McpServer({ name: 'reddit-marketing', version: '1.0.0' });

server.registerTool('find_subreddits', {
  description: 'Find the best subreddits to post your product or startup in. Returns ranked list with subscriber counts, rules summary, and fit score.',
  inputSchema: z.object({
    product_description: z.string().describe('What your product does and who it is for'),
    goal: z.enum(['launch', 'feedback', 'users', 'awareness']).optional().default('users').describe('What you want from the post'),
  }),
}, async ({ product_description, goal }) => {
  const result = await ask(`You are a Reddit marketing expert for indie hackers and startup founders.

Product: ${product_description}
Goal: ${goal}

Find the 8 best subreddits to post this product in. For each subreddit include:
- Name (r/name)
- Approximate subscriber count
- Why it fits this product
- Posting rules to know (self-promo allowed? Show HN-style posts? etc.)
- Fit score out of 10
- Best post type (Show HN style, question, story, direct promo)

Sort by fit score. Be specific and realistic — include both large and niche subreddits. Flag any subreddits that are self-promo friendly.`);
  return { content: [{ type: 'text', text: result }] };
});

server.registerTool('draft_reddit_post', {
  description: 'Draft a Reddit post for your product that fits the subreddit culture and avoids looking like spam.',
  inputSchema: z.object({
    product_name: z.string().describe('Your product name'),
    product_description: z.string().describe('What your product does'),
    subreddit: z.string().describe('Target subreddit, e.g. r/SideProject'),
    post_type: z.enum(['show', 'story', 'question', 'value', 'launch']).describe('show=Show HN style, story=founder journey, question=ask for feedback, value=share useful content, launch=direct launch post'),
    your_story: z.string().optional().describe('Optional personal context to make the post more authentic'),
  }),
}, async ({ product_name, product_description, subreddit, post_type, your_story }) => {
  const result = await ask(`You are a Reddit copywriter who specializes in posts that feel native, get upvotes, and drive signups without being banned.

Write a Reddit post for:
- Product: ${product_name} — ${product_description}
- Subreddit: ${subreddit}
- Post type: ${post_type}
${your_story ? `- Personal context: ${your_story}` : ''}

Rules:
- Sound like a real person, not a marketer
- Match the tone of ${subreddit} (casual, technical, story-driven as appropriate)
- No buzzwords, no "I'm excited to announce", no emojis unless the sub uses them
- For story/value posts: lead with insight or result, mention the product naturally
- For show posts: be direct about what it does and what stage you're at
- Include a hook title (5-10 words) and full post body
- End with a natural call to action

Output:
TITLE: [title here]

BODY:
[post body here]

NOTES: [1-2 tips for this specific sub]`);
  return { content: [{ type: 'text', text: result }] };
});

server.registerTool('score_post', {
  description: 'Score a Reddit post for ban risk, upvote potential, and authenticity. Get specific suggestions to improve it.',
  inputSchema: z.object({
    post_title: z.string().describe('The post title'),
    post_body: z.string().describe('The post body'),
    subreddit: z.string().describe('Target subreddit'),
  }),
}, async ({ post_title, post_body, subreddit }) => {
  const result = await ask(`You are a Reddit moderation and marketing expert. Analyze this post:

Subreddit: ${subreddit}
Title: ${post_title}
Body: ${post_body}

Score it on:
1. Ban/removal risk (0-10, 10 = definitely removed)
2. Upvote potential (0-10)
3. Authenticity (0-10, does it sound like a real person?)
4. Engagement potential (0-10, will people comment?)

For each score, explain why. Then give 3 specific rewrites or tweaks to improve the lowest scoring areas. Be brutally honest.`);
  return { content: [{ type: 'text', text: result }] };
});

server.registerTool('plan_reddit_campaign', {
  description: 'Build a full Reddit marketing campaign plan: which subreddits, what to post, in what order, with timing.',
  inputSchema: z.object({
    product_name: z.string(),
    product_description: z.string(),
    target_users: z.string().describe('Who your ideal users are'),
    timeline_days: z.number().int().min(7).max(90).optional().default(30),
  }),
}, async ({ product_name, product_description, target_users, timeline_days }) => {
  const result = await ask(`You are a growth hacker who has driven thousands of users from Reddit organically.

Product: ${product_name} — ${product_description}
Target users: ${target_users}
Timeline: ${timeline_days} days

Build a complete Reddit campaign plan:
1. Phase 1 (days 1-7): Warm-up — which communities to join and engage in (no posts yet)
2. Phase 2 (days 8-14): Value posts — share insights, not the product
3. Phase 3 (days 15-21): Soft launch — story or Show HN posts
4. Phase 4 (days 22+): Amplify — follow-up posts, AMA, milestone updates

For each phase list:
- Exact subreddits (r/name)
- Post type and rough angle
- What NOT to do
- Expected result

Include a warning list: 5 things that will get you banned or shadowbanned.`);
  return { content: [{ type: 'text', text: result }] };
});

const transport = new StdioServerTransport();
await server.connect(transport);
