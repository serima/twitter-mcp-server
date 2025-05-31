#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import * as twitterText from 'twitter-text';

class TwitterMCPServer {
  private server: Server;

  constructor() {
    this.server = new Server(
      {
        name: 'twitter-mcp-server',
        version: '0.1.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
    this.setupErrorHandling();
  }

  private setupErrorHandling(): void {
    this.server.onerror = (error) => console.error('[MCP Error]', error);
    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  private setupToolHandlers(): void {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'count_tweet_characters',
          description: 'Twitter/Xの投稿文字数を正確にカウントします。URLや絵文字も考慮します。',
          inputSchema: {
            type: 'object',
            properties: {
              text: {
                type: 'string',
                description: 'カウントしたいTwitter/Xの投稿テキスト',
              },
            },
            required: ['text'],
          },
        },
        {
          name: 'validate_tweet',
          description: 'Twitter/Xの投稿が有効かどうかを検証します（文字数制限、URL、メンションなど）',
          inputSchema: {
            type: 'object',
            properties: {
              text: {
                type: 'string',
                description: '検証したいTwitter/Xの投稿テキスト',
              },
            },
            required: ['text'],
          },
        },
        {
          name: 'optimize_tweet',
          description: 'Twitter/Xの投稿を最適化します（長すぎる場合は短縮提案など）',
          inputSchema: {
            type: 'object',
            properties: {
              text: {
                type: 'string',
                description: '最適化したいTwitter/Xの投稿テキスト',
              },
              maxLength: {
                type: 'number',
                description: '最大文字数（デフォルト: 280）',
                default: 280,
              },
            },
            required: ['text'],
          },
        },
        {
          name: 'extract_entities',
          description: 'Twitter/Xの投稿からエンティティ（URL、メンション、ハッシュタグ）を抽出します',
          inputSchema: {
            type: 'object',
            properties: {
              text: {
                type: 'string',
                description: 'エンティティを抽出したいTwitter/Xの投稿テキスト',
              },
            },
            required: ['text'],
          },
        },
      ],
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      switch (request.params.name) {
        case 'count_tweet_characters':
          return this.countTweetCharacters(request.params.arguments?.text as string);

        case 'validate_tweet':
          return this.validateTweet(request.params.arguments?.text as string);

        case 'optimize_tweet':
          return this.optimizeTweet(
            request.params.arguments?.text as string,
            request.params.arguments?.maxLength as number
          );

        case 'extract_entities':
          return this.extractEntities(request.params.arguments?.text as string);

        default:
          throw new Error(`Unknown tool: ${request.params.name}`);
      }
    });
  }

  private countTweetCharacters(text: string) {
    const parsed = twitterText.parseTweet(text);

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            characterCount: parsed.weightedLength,
            maxLength: 280,
            remaining: 280 - parsed.weightedLength,
            valid: parsed.valid,
            details: {
              displayRangeStart: parsed.displayRangeStart,
              displayRangeEnd: parsed.displayRangeEnd,
              permillage: parsed.permillage,
            }
          }, null, 2),
        },
      ],
    };
  }

  private validateTweet(text: string) {
    const parsed = twitterText.parseTweet(text);
    const entities = twitterText.extractEntitiesWithIndices(text);

    const validation = {
      valid: parsed.valid,
      characterCount: parsed.weightedLength,
      maxLength: 280,
      remaining: 280 - parsed.weightedLength,
      issues: [] as string[],
      entities: {
        urls: entities.filter((e: any) => e.url).length,
        mentions: entities.filter((e: any) => e.screenName).length,
        hashtags: entities.filter((e: any) => e.hashtag).length,
      }
    };

    if (!parsed.valid) {
      validation.issues.push('文字数制限を超えています');
    }

    if (parsed.weightedLength === 0) {
      validation.issues.push('投稿内容が空です');
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(validation, null, 2),
        },
      ],
    };
  }

  private optimizeTweet(text: string, maxLength: number = 280) {
    const parsed = twitterText.parseTweet(text);

    if (parsed.valid && parsed.weightedLength <= maxLength) {
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              original: text,
              optimized: text,
              characterCount: parsed.weightedLength,
              optimization: 'すでに最適化されています',
              saved: 0,
            }, null, 2),
          },
        ],
      };
    }

    // 簡単な最適化: 複数スペースを単一スペースに、改行を整理
    let optimized = text
      .replace(/\s+/g, ' ')
      .replace(/\n\s*\n/g, '\n')
      .trim();

    const optimizedParsed = twitterText.parseTweet(optimized);

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            original: text,
            optimized: optimized,
            originalCount: parsed.weightedLength,
            optimizedCount: optimizedParsed.weightedLength,
            saved: parsed.weightedLength - optimizedParsed.weightedLength,
            valid: optimizedParsed.valid,
            suggestions: optimizedParsed.weightedLength > maxLength
              ? ['URLを短縮する', '不要な語句を削除する', '略語を使用する']
              : [],
          }, null, 2),
        },
      ],
    };
  }

  private extractEntities(text: string) {
    const urls = twitterText.extractUrls(text);
    const mentions = twitterText.extractMentions(text);
    const hashtags = twitterText.extractHashtags(text);
    const entities = twitterText.extractEntitiesWithIndices(text);

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            urls,
            mentions,
            hashtags,
            entitiesWithIndices: entities,
            summary: {
              totalUrls: urls.length,
              totalMentions: mentions.length,
              totalHashtags: hashtags.length,
            }
          }, null, 2),
        },
      ],
    };
  }

  async run(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Twitter MCP server running on stdio');
  }
}

const server = new TwitterMCPServer();
server.run().catch(console.error);
