# reddit-mcp

AI-powered Reddit content MCP server. Generate Reddit posts, craft comment replies, write AMAs, and research subreddit trends — natively inside Claude, Cursor, Windsurf, or any MCP-compatible AI client.

**Live on MCPize:** [mcpize.com/mcp/reddit-mcp](https://mcpize.com/mcp/reddit-mcp)

---

## Tools

| Tool | Description |
|------|-------------|
| `write_reddit_post` | Generate a Reddit post (self-post or link post) tailored to a specific subreddit's culture |
| `craft_reddit_comment` | Write a high-quality comment reply that adds value to a thread |
| `write_ama_responses` | Generate AMA (Ask Me Anything) answers that sound authentic and thorough |
| `research_subreddit` | Analyze a subreddit's culture, top content types, and posting best practices |

---

## Usage

Use via MCPize gateway (no local setup required):

```json
{
  "mcpServers": {
    "reddit": {
      "url": "https://reddit-mcp.mcpize.run/mcp",
      "headers": {
        "Authorization": "Bearer YOUR_MCPIZE_API_KEY"
      }
    }
  }
}
```

Or run locally:

```bash
git clone https://github.com/tylerscomic-lab/reddit-mcp
cd reddit-mcp
npm install
GROQ_API_KEY=your_key node server.js
```

---

## Examples

```
write_reddit_post(
  subreddit: "r/SaaS",
  topic: "I built 13 AI tools in a month — here's what I learned",
  post_type: "self",
  tone: "authentic, builder-focused",
  goal: "drive traffic to mcpize.com"
)

craft_reddit_comment(
  thread_title: "What AI tools do you use for content creation?",
  subreddit: "r/entrepreneur",
  your_perspective: "I build AI tools and have seen these categories work best...",
  tone: "helpful, not promotional"
)
```

---

## Pricing

Available on [MCPize marketplace](https://mcpize.com/mcp/reddit-mcp):
- **Free:** 20 requests/day
- **Pro:** $9.99/month — unlimited requests

---

## More MCP Servers

Browse the full suite: [mcpize.com](https://mcpize.com) | GitHub org: [github.com/tylerscomic-lab](https://github.com/tylerscomic-lab)
