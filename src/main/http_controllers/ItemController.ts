import HttpApiController from './HttpApiController';
import { injectable, singleton } from 'tsyringe';
import PrismaClient from '../PrismaClient';
import LoggerFactory, { Logger } from '../LoggerFactory';
import { Request, Response } from 'express';

@singleton()
@injectable()
export default class ItemController extends HttpApiController {
  public path = '/api/items';
  private prisma: PrismaClient['client'];
  private logger: Logger;

  constructor(prismaClient: PrismaClient, loggerFactory: LoggerFactory) {
    super();
    this.prisma = prismaClient.client;
    this.logger = loggerFactory.createPrivateClassLogger('ItemController');
  }

  public initRoutes(): void {
    this.router.get('/', this.getItems.bind(this));
    this.router.get('/:id', this.getItemById.bind(this));
    this.router.post('/', this.createItem.bind(this));
    this.router.put('/:id', this.updateItem.bind(this));
    this.router.delete('/:id', this.deleteItem.bind(this));
  }

  /**
   * GET /api/items
   * Fetch a paginated list of items, including brand, tags, and images.
   * Query params: ?limit=20&offset=0
   */
  private async getItems(req: Request, res: Response) {
    try {
      const limit = Math.max(1, Math.min(parseInt(req.query.limit as string) || 20, 100));
      const offset = Math.max(0, parseInt(req.query.offset as string) || 0);
      const [items, total] = await Promise.all([
        this.prisma.item.findMany({
          skip: offset,
          take: limit,
          orderBy: { createdAt: 'desc' },
          include: { brand: true, tags: true, images: true },
        }),
        this.prisma.item.count(),
      ]);
      res.json({ items, total, limit, offset });
    } catch (error) {
      this.logger.error('Failed to fetch items', error);
      res.status(500).json({ error: 'Failed to fetch items' });
    }
  }

  /**
   * GET /api/items/:id
   * Fetch a single item by ID, including brand and tags.
   */
  private async getItemById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) return res.status(400).json({ error: 'Invalid item ID' });
      const item = await this.prisma.item.findUnique({
        where: { id },
        include: { brand: true, tags: true, images: true },
      });
      if (!item) return res.status(404).json({ error: 'Item not found' });
      res.json(item);
    } catch (error) {
      this.logger.error('Failed to fetch item', error);
      res.status(500).json({ error: 'Failed to fetch item' });
    }
  }

  /**
   * POST /api/items
   * Create a new item (expects JSON body).
   */
  private async createItem(req: Request, res: Response) {
    try {
      const data = req.body;
      const item = await this.prisma.item.create({ data });
      res.status(201).json(item);
    } catch (error) {
      this.logger.error('Failed to create item', error);
      res.status(500).json({ error: 'Failed to create item' });
    }
  }

  /**
   * PUT /api/items/:id
   * Update an item by ID (expects JSON body).
   */
  private async updateItem(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) return res.status(400).json({ error: 'Invalid item ID' });
      const data = req.body;
      const item = await this.prisma.item.update({ where: { id }, data });
      res.json(item);
    } catch (error) {
      this.logger.error('Failed to update item', error);
      res.status(500).json({ error: 'Failed to update item' });
    }
  }

  /**
   * DELETE /api/items/:id
   * Delete an item by ID.
   */
  private async deleteItem(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) return res.status(400).json({ error: 'Invalid item ID' });
      await this.prisma.item.delete({ where: { id } });
      res.status(204).end();
    } catch (error) {
      this.logger.error('Failed to delete item', error);
      res.status(500).json({ error: 'Failed to delete item' });
    }
  }
}
