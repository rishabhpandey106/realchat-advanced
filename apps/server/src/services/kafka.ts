import {Kafka, Producer} from 'kafkajs'
import fs from "fs";
import path from 'path';
import prismaClient from './prisma';

const kafka = new Kafka({
    brokers: ["kafka-202a8244-rishabh.a.aivencloud.com:21320"],
    ssl: {
        ca: [fs.readFileSync(path.resolve("./ca.pem"), "utf-8")]
    },
    sasl: {
        username: "avnadmin",
        password: "AVNS_UojYh3VQD_2K_UmB3AT",
        mechanism: "plain"
    }
})

let producer: null | Producer = null;

export async function createProducer() {
    if(producer) return producer;

    const _producer = kafka.producer();
    await _producer.connect();
    producer = _producer;
    return producer;
}

export async function produceMessage(message:string) {
    const producer = await createProducer();
    await producer.send({
        messages: [{key: `message-${Date.now()}`, value: message}],
        topic: "MESSAGES"
    });
    return true;
}

export async function startConsumer() {
    console.log('consumer is running ... ...')
    const consumer = kafka.consumer({groupId: "default"});
    await consumer.connect();
    await consumer.subscribe({topic: "MESSAGES", fromBeginning: true});
    await consumer.run({
        autoCommit: true,
        eachMessage: async ({message , pause}) => {
            if(!message.value) return;
            console.log('new msg recieved and updated to database');
            try{
                await prismaClient.message.create({
                    data: {
                        text: message.value?.toString(),
                    }
                })
            } catch {
                console.log('something went wrong');
                pause();
                setTimeout(()=> {consumer.resume([{topic: "MESSAGES"}])}, 60*1000);
            }
            
        }
    })
}

export default kafka