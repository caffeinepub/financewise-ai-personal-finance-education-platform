import { BlogPost } from '../types/backend-types';

export const defaultBlogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Complete Guide to Monthly Budgeting',
    content: '',
    excerpt: 'Learn how to create and stick to a monthly budget that works for your lifestyle and financial goals.',
    featuredImage: '/assets/generated/blog-monthly-budget.dim_800x600.jpg',
    publicationDate: Date.now() * 1000000,
    slug: 'monthly-budgeting-guide',
    seoMeta: 'budgeting, personal finance, money management',
  },
  {
    id: '2',
    title: 'Building Your Emergency Fund',
    content: '',
    excerpt: 'Essential steps to build a solid emergency fund and protect yourself from financial emergencies.',
    featuredImage: '/assets/generated/blog-emergency-fund.dim_800x600.jpg',
    publicationDate: Date.now() * 1000000,
    slug: 'emergency-fund-guide',
    seoMeta: 'emergency fund, savings, financial security',
  },
];
