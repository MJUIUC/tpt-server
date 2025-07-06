import prisma from '@prisma/client';
import LoggerFactory, {Logger} from './LoggerFactory';
import { injectable, singleton } from "tsyringe";

@singleton()
@injectable()
export default class PrismaClient {
    public client: prisma.PrismaClient;
    private logger: Logger;

    constructor(logger: LoggerFactory) {
        this.logger = logger.createPrivateClassLogger(this.constructor.name);
        this.client = new prisma.PrismaClient();
    }
}