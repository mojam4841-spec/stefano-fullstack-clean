import { db } from './db';
import { sql } from 'drizzle-orm';

export interface DashboardMetrics {
  revenue: {
    today: number;
    thisWeek: number;
    thisMonth: number;
    growth: number;
  };
  orders: {
    today: number;
    pending: number;
    completed: number;
    averageValue: number;
    conversionRate: number;
  };
  customers: {
    total: number;
    new: number;
    returning: number;
    loyaltyMembers: number;
    churnRate: number;
  };
  products: {
    topSelling: Array<{ name: string; quantity: number; revenue: number }>;
    lowStock: Array<{ name: string; stock: number }>;
    categoryPerformance: Array<{ category: string; sales: number }>;
  };
  loyalty: {
    totalMembers: number;
    activeMembers: number;
    pointsIssued: number;
    pointsRedeemed: number;
    avgPointsPerMember: number;
  };
}

export class AnalyticsService {
  async getDashboardMetrics(): Promise<DashboardMetrics> {
    const [revenue, orders, customers, products, loyalty] = await Promise.all([
      this.getRevenueMetrics(),
      this.getOrderMetrics(),
      this.getCustomerMetrics(),
      this.getProductMetrics(),
      this.getLoyaltyMetrics()
    ]);

    return { revenue, orders, customers, products, loyalty };
  }

  private async getRevenueMetrics() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 2);

    const revenueData = await db.execute(sql`
      SELECT 
        SUM(CASE WHEN created_at >= ${today} THEN total_amount ELSE 0 END) as today,
        SUM(CASE WHEN created_at >= ${weekAgo} THEN total_amount ELSE 0 END) as this_week,
        SUM(CASE WHEN created_at >= ${monthAgo} THEN total_amount ELSE 0 END) as this_month,
        SUM(CASE WHEN created_at >= ${lastMonth} AND created_at < ${monthAgo} THEN total_amount ELSE 0 END) as last_month
      FROM orders
      WHERE status IN ('completed', 'delivered')
    `);

    const row = revenueData.rows[0];
    const thisMonth = Number(row.this_month) || 0;
    const lastMonthValue = Number(row.last_month) || 0;
    
    return {
      today: Number(row.today) || 0,
      thisWeek: Number(row.this_week) || 0,
      thisMonth: thisMonth,
      growth: lastMonthValue > 0 ? ((thisMonth - lastMonthValue) / lastMonthValue * 100) : 0
    };
  }

  private async getOrderMetrics() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const orderData = await db.execute(sql`
      SELECT 
        COUNT(CASE WHEN created_at >= ${today} THEN 1 END) as today,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending,
        COUNT(CASE WHEN status IN ('completed', 'delivered') THEN 1 END) as completed,
        AVG(total_amount) as avg_value,
        COUNT(*) as total
      FROM orders
    `);

    const row = orderData.rows[0];
    const completed = Number(row.completed) || 0;
    const total = Number(row.total) || 0;

    return {
      today: Number(row.today) || 0,
      pending: Number(row.pending) || 0,
      completed: completed,
      averageValue: Number(row.avg_value) || 0,
      conversionRate: total > 0 ? (completed / total * 100) : 0
    };
  }

  private async getCustomerMetrics() {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const customerData = await db.execute(sql`
      SELECT 
        COUNT(DISTINCT c.id) as total,
        COUNT(DISTINCT CASE WHEN c.created_at >= ${thirtyDaysAgo} THEN c.id END) as new_customers,
        COUNT(DISTINCT CASE WHEN o.customer_id IS NOT NULL THEN c.id END) as returning,
        COUNT(DISTINCT lm.customer_id) as loyalty_members
      FROM customers c
      LEFT JOIN orders o ON c.id = o.customer_id AND o.created_at < c.created_at + INTERVAL '30 days'
      LEFT JOIN loyalty_members lm ON c.id = lm.customer_id
    `);

    const row = customerData.rows[0];
    const total = Number(row.total) || 0;
    const returning = Number(row.returning) || 0;

    return {
      total: total,
      new: Number(row.new_customers) || 0,
      returning: returning,
      loyaltyMembers: Number(row.loyalty_members) || 0,
      churnRate: total > 0 ? ((total - returning) / total * 100) : 0
    };
  }

  private async getProductMetrics() {
    // Top selling products
    const topSellingData = await db.execute(sql`
      SELECT 
        item_name as name,
        SUM(quantity) as quantity,
        SUM(price * quantity) as revenue
      FROM order_items
      JOIN orders ON order_items.order_id = orders.id
      WHERE orders.created_at >= CURRENT_DATE - INTERVAL '30 days'
        AND orders.status IN ('completed', 'delivered')
      GROUP BY item_name
      ORDER BY revenue DESC
      LIMIT 10
    `);

    const topSelling = topSellingData.rows.map(row => ({
      name: row.name as string,
      quantity: Number(row.quantity) || 0,
      revenue: Number(row.revenue) || 0
    }));

    // Category performance
    const categoryData = await db.execute(sql`
      SELECT 
        category,
        SUM(price * quantity) as sales
      FROM order_items
      JOIN orders ON order_items.order_id = orders.id
      WHERE orders.created_at >= CURRENT_DATE - INTERVAL '30 days'
        AND orders.status IN ('completed', 'delivered')
      GROUP BY category
      ORDER BY sales DESC
    `);

    const categoryPerformance = categoryData.rows.map(row => ({
      category: row.category as string,
      sales: Number(row.sales) || 0
    }));

    return {
      topSelling,
      lowStock: [], // Would need inventory table
      categoryPerformance
    };
  }

  private async getLoyaltyMetrics() {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const loyaltyData = await db.execute(sql`
      SELECT 
        COUNT(DISTINCT lm.id) as total_members,
        COUNT(DISTINCT CASE WHEN pt.created_at >= ${thirtyDaysAgo} THEN lm.id END) as active_members,
        SUM(CASE WHEN pt.points > 0 THEN pt.points ELSE 0 END) as points_issued,
        SUM(CASE WHEN pt.points < 0 THEN ABS(pt.points) ELSE 0 END) as points_redeemed,
        AVG(lm.total_points) as avg_points
      FROM loyalty_members lm
      LEFT JOIN points_transactions pt ON lm.id = pt.member_id
    `);

    const row = loyaltyData.rows[0];

    return {
      totalMembers: Number(row.total_members) || 0,
      activeMembers: Number(row.active_members) || 0,
      pointsIssued: Number(row.points_issued) || 0,
      pointsRedeemed: Number(row.points_redeemed) || 0,
      avgPointsPerMember: Number(row.avg_points) || 0
    };
  }

  async getRevenueByPeriod(startDate: Date, endDate: Date, groupBy: 'day' | 'week' | 'month') {
    const dateFormat = {
      day: 'YYYY-MM-DD',
      week: 'YYYY-WW',
      month: 'YYYY-MM'
    }[groupBy];

    const result = await db.execute(sql`
      SELECT 
        TO_CHAR(created_at, ${dateFormat}) as period,
        SUM(total_amount) as revenue,
        COUNT(*) as orders
      FROM orders
      WHERE created_at BETWEEN ${startDate} AND ${endDate}
        AND status IN ('completed', 'delivered')
      GROUP BY period
      ORDER BY period
    `);

    return result.rows.map(row => ({
      period: row.period,
      revenue: Number(row.revenue) || 0,
      orders: Number(row.orders) || 0
    }));
  }

  async getCustomerSegmentation() {
    const segments = await db.execute(sql`
      SELECT 
        CASE 
          WHEN total_spent >= 1000 THEN 'VIP'
          WHEN total_spent >= 500 THEN 'Regular'
          WHEN total_spent >= 100 THEN 'Occasional'
          ELSE 'New'
        END as segment,
        COUNT(*) as count,
        AVG(total_spent) as avg_spent,
        AVG(total_orders) as avg_orders
      FROM customers
      GROUP BY segment
      ORDER BY avg_spent DESC
    `);

    return segments.rows.map(row => ({
      segment: row.segment,
      count: Number(row.count) || 0,
      avgSpent: Number(row.avg_spent) || 0,
      avgOrders: Number(row.avg_orders) || 0
    }));
  }

  async getProductABCAnalysis() {
    const products = await db.execute(sql`
      WITH product_revenue AS (
        SELECT 
          item_name,
          SUM(price * quantity) as revenue,
          SUM(quantity) as units_sold
        FROM order_items
        JOIN orders ON order_items.order_id = orders.id
        WHERE orders.created_at >= CURRENT_DATE - INTERVAL '90 days'
          AND orders.status IN ('completed', 'delivered')
        GROUP BY item_name
      ),
      cumulative AS (
        SELECT 
          item_name,
          revenue,
          units_sold,
          SUM(revenue) OVER (ORDER BY revenue DESC) as cumulative_revenue,
          SUM(revenue) OVER () as total_revenue
        FROM product_revenue
      )
      SELECT 
        item_name,
        revenue,
        units_sold,
        CASE 
          WHEN cumulative_revenue <= total_revenue * 0.8 THEN 'A'
          WHEN cumulative_revenue <= total_revenue * 0.95 THEN 'B'
          ELSE 'C'
        END as category
      FROM cumulative
      ORDER BY revenue DESC
    `);

    return products.rows.map(row => ({
      name: row.item_name,
      revenue: Number(row.revenue) || 0,
      unitsSold: Number(row.units_sold) || 0,
      category: row.category
    }));
  }
}

export const analytics = new AnalyticsService();