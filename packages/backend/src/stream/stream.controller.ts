import { Controller, Get, Param, Res, Query } from '@nestjs/common';
import { Response } from 'express';
import { createClient } from 'redis';

@Controller('agent/stream')
export class StreamController {
  private redis = createClient({ url: process.env.REDIS_URL });

  constructor() {
    this.redis.connect();
  }

  @Get(':sessionId')
  async stream(@Param('sessionId') sessionId: string, @Res() res: Response) {
    res.set({
      'Cache-Control': 'no-cache',
      'Content-Type': 'text/event-stream',
      Connection: 'keep-alive',
    });
    res.flushHeaders();

    const subscriber = this.redis.duplicate();
    await subscriber.connect();
    const channel = `agent:stream:${sessionId}`;

    await subscriber.subscribe(channel, (message) => {
      // agent messages are JSON with {type:'token'|'thinking'|'done', payload:...}
      res.write(`data: ${message}\n\n`);
      if (JSON.parse(message).type === 'done') {
        // optionally close
        // res.end();
      }
    });

    req.on('close', async () => {
      await subscriber.unsubscribe(channel);
      await subscriber.quit();
    });
  }
}
