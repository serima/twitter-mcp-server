# Twitter MCP Server

An MCP (Model Context Protocol) server for Claude to accurately count Twitter/X post characters and optimize posts.

## Features

- **Accurate Character Counting**: Calculate character count based on Twitter/X's official counting method
- **Post Validation**: Check character limits and other constraints
- **Post Optimization**: Suggestions for optimizing posts that are too long
- **Entity Extraction**: Extract and analyze URLs, mentions, and hashtags

## Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd twitter-mcp-server

# Install dependencies
npm install

# Build
npm run build
```

## Configuration for Claude Desktop

Add the following to your Claude Desktop configuration file (`~/Library/Application Support/Claude/claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "twitter-mcp-server": {
      "command": "node",
      "args": ["/path/to/twitter-mcp-server/dist/server.js"]
    }
  }
}
```

## Usage

The following tools will be available in Claude:

### 1. count_tweet_characters
```
Please count the characters in this Twitter/X post accurately:
"Hello! It's a beautiful day today ☀️ #goodweather https://example.com"
```

### 2. validate_tweet
```
Please validate if this post is valid:
"(long post text)"
```

### 3. optimize_tweet
```
Please optimize this post:
"(post text to optimize)"
```

### 4. extract_entities
```
Please extract entities from this post:
"@user Hello! #hello please check out https://example.com"
```

## Development

```bash
# Start in development mode
npm run dev

# Build
npm run build

# Start in production
npm start
```

## API Details

### count_tweet_characters
- **Input**: `text` (string) - Text to count
- **Output**: Detailed information including character count, remaining characters, validity

### validate_tweet
- **Input**: `text` (string) - Text to validate
- **Output**: Validity, issues, entity information

### optimize_tweet
- **Input**: 
  - `text` (string) - Text to optimize
  - `maxLength` (number, optional) - Maximum character count (default: 280)
- **Output**: Optimized text and suggestions

### extract_entities
- **Input**: `text` (string) - Text to extract entities from
- **Output**: Lists of URLs, mentions, and hashtags

## Tech Stack

- **TypeScript**: Type safety and better development experience
- **@modelcontextprotocol/sdk**: MCP server implementation
- **twitter-text**: Official Twitter character counting library

## License

MIT License

## Contributing

1. Fork this repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Create a Pull Request

## Support

If you have any issues or questions, please report them in GitHub Issues.
