import 'reflect-metadata';
import express from 'express';
import { container } from 'tsyringe';
import LoggerFactory from './LoggerFactory';
import FeaturedItemsController from './http_controllers/FeaturedItemsController';
import ItemController from './http_controllers/ItemController';

async function main() {
    const logger = container.resolve(LoggerFactory).createPrivateClassLogger("Index.ts");
    
    const server = express();

    // Built-in middleware for parsing JSON request bodies
    server.use(express.json());

    // Built-in middleware for parsing URL-encoded request bodies
    server.use(express.urlencoded({ extended: true }));

    server.get('/', (req, res) => {
        res.send({
            message: 'The Paper Trail API'
        });
    });

    server.use(async (req, res, next) => {
        logger.info(`Request received: ${req.method} ${req.url}`);
        next();
    });

    // Register API routes
    const featuredItemsController = container.resolve(FeaturedItemsController) as FeaturedItemsController;
    server.use(featuredItemsController.path, featuredItemsController.router);

    const itemController = container.resolve(ItemController) as ItemController;
    server.use(itemController.path, itemController.router);

    server.listen(8080, async () => {
        logger.info("The Paper Trail API");
        logger.info('Server started on port 8080');
    });
}

(() => main())();
