import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import * as amqplib from 'amqplib';

@Injectable()
export class RabbitMQService implements OnModuleInit, OnModuleDestroy {
    private connection: amqplib.Connection;
    private channel: amqplib.Channel;

    async onModuleInit() {
        this.connection = await amqplib.connect('amqp://localhost');
        this.channel = await this.connection.createChannel();
    }

    async onModuleDestroy() {
        await this.connection.close();
        await this.channel.close();
    }

    async publish(queue: string, message: string, headers: { [key: string]: any }) {
        await this.channel.assertQueue(queue, { durable: true });
        this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), { headers });
    }

    async consume(queue: string, callback: (msg: amqplib.ConsumeMessage) => void) {
        await this.channel.assertQueue(queue, { durable: true });
        this.channel.consume(queue, callback, { noAck: true });
    }
}