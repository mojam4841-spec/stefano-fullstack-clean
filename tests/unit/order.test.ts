import { describe, test, expect, beforeEach, vi } from 'vitest';
import { DatabaseStorage } from '../../server/database-storage';
import { db } from '../../server/db';

vi.mock('../../server/db');

describe('Order Service Tests', () => {
  let storage: DatabaseStorage;

  beforeEach(() => {
    storage = new DatabaseStorage();
    vi.clearAllMocks();
  });

  describe('createOrder', () => {
    test('should create order with valid data', async () => {
      const orderData = {
        customerName: 'Test Customer',
        customerPhone: '123456789',
        customerEmail: 'test@example.com',
        items: JSON.stringify([{ name: 'Pizza', price: 45, quantity: 1 }]),
        totalAmount: 45,
        status: 'pending',
        paymentMethod: 'cash'
      };

      const mockOrder = { id: 1, ...orderData, createdAt: new Date() };
      vi.mocked(db.insert).mockReturnValue({
        values: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([mockOrder])
        })
      } as any);

      const result = await storage.createOrder(orderData);
      
      expect(result).toEqual(mockOrder);
      expect(db.insert).toHaveBeenCalled();
    });

    test('should validate required fields', async () => {
      const invalidOrder = {
        customerName: '',
        customerPhone: '',
        items: '',
        totalAmount: 0,
        status: 'pending',
        paymentMethod: 'cash'
      };

      await expect(storage.createOrder(invalidOrder)).rejects.toThrow();
    });
  });

  describe('getOrders', () => {
    test('should return orders sorted by date', async () => {
      const mockOrders = [
        { id: 1, customerName: 'Customer 1', createdAt: new Date('2024-01-02') },
        { id: 2, customerName: 'Customer 2', createdAt: new Date('2024-01-01') }
      ];

      vi.mocked(db.select).mockReturnValue({
        from: vi.fn().mockReturnValue({
          orderBy: vi.fn().mockResolvedValue(mockOrders)
        })
      } as any);

      const result = await storage.getOrders();
      
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe(1);
    });
  });

  describe('updateOrderStatus', () => {
    test('should update order status', async () => {
      vi.mocked(db.update).mockReturnValue({
        set: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([])
        })
      } as any);

      await storage.updateOrderStatus(1, 'completed');
      
      expect(db.update).toHaveBeenCalled();
    });

    test('should validate status values', async () => {
      const invalidStatuses = ['invalid', 'unknown', ''];
      
      for (const status of invalidStatuses) {
        await expect(storage.updateOrderStatus(1, status)).rejects.toThrow();
      }
    });
  });
});