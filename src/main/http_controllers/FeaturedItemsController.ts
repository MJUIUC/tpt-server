import HttpApiController from './HttpApiController';
import { injectable, singleton } from 'tsyringe';
import PrismaClient from '../PrismaClient';
import LoggerFactory, { Logger } from '../LoggerFactory';
import { Request, Response } from 'express';

@singleton()
@injectable()
export default class FeaturedItemsController extends HttpApiController {
  public path = '/api/featured-items';
  private prisma: PrismaClient['client'];
  private logger: Logger;

  constructor(prismaClient: PrismaClient, loggerFactory: LoggerFactory) {
    super();
    this.prisma = prismaClient.client;
    this.logger = loggerFactory.createPrivateClassLogger('FeaturedItemsController');
  }

  public initRoutes(): void {
    this.router.get('/', this.getFeaturedItems.bind(this));
  }

  /**
   * GET /api/featured-items
   * Fetches up to 4 most recently created featured items from the database, including their brand and tags.
   * Responds with an array of item objects or a 500 error if the query fails.
   */
  private async getFeaturedItems(req: Request, res: Response) {
    try {
      const items = await this.prisma.item.findMany({
        where: { featured: true },
        take: 4,
        orderBy: { createdAt: 'desc' },
        include: {
          brand: true,
          tags: true,
          images: true, // Include related images
        },
      });
      // Map items to include the first image URL as 'image' for backward compatibility
      const itemsWithImages = items.map((item: any) => ({
        ...item,
        image: item.images && item.images.length > 0 ? item.images[0].url : item.image || null,
      }));
      res.json(itemsWithImages);
    } catch (error) {
      this.logger.error('Failed to fetch featured items', error);
      res.status(500).json({ error: 'Failed to fetch featured items' });
    }
  }
}
