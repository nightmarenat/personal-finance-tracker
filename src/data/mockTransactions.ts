import type { Transaction } from '../types'

// Realistic mock data for demo mode
export const MOCK_TRANSACTIONS: Transaction[] = [
  // April 2026 - Income
  { date: '4/1/2026', type: 'Income', amount: 85000, categoryGroup: 'Income', subcategory: 'Salary', paymentMethod: 'Transfer', valueAlignment: 'Worth It', note: 'Monthly salary' },
  { date: '4/15/2026', type: 'Income', amount: 12000, categoryGroup: 'Income', subcategory: 'Side Job', paymentMethod: 'Transfer', valueAlignment: 'Worth It', note: 'Freelance project' },

  // April 2026 - Survival
  { date: '4/2/2026', type: 'Expense', amount: 320, categoryGroup: 'Survival', subcategory: 'Food', paymentMethod: 'Cash', valueAlignment: 'Worth It', note: 'Supermarket' },
  { date: '4/3/2026', type: 'Expense', amount: 89, categoryGroup: 'Survival', subcategory: 'Delivery', paymentMethod: 'Credit Card', valueAlignment: 'Neutral', note: 'Grab food' },
  { date: '4/5/2026', type: 'Expense', amount: 45, categoryGroup: 'Survival', subcategory: 'Public Transport', paymentMethod: 'Cash', valueAlignment: 'Worth It', note: 'BTS monthly' },
  { date: '4/7/2026', type: 'Expense', amount: 1200, categoryGroup: 'Survival', subcategory: 'Utilities', paymentMethod: 'Transfer', valueAlignment: 'Worth It', note: 'Electric + water' },
  { date: '4/10/2026', type: 'Expense', amount: 450, categoryGroup: 'Survival', subcategory: 'Food', paymentMethod: 'Cash', valueAlignment: 'Worth It', note: 'Weekly groceries' },
  { date: '4/14/2026', type: 'Expense', amount: 650, categoryGroup: 'Survival', subcategory: 'Healthcare', paymentMethod: 'Credit Card', valueAlignment: 'Worth It', note: 'Dentist' },
  { date: '4/18/2026', type: 'Expense', amount: 120, categoryGroup: 'Survival', subcategory: 'Delivery', paymentMethod: 'Credit Card', valueAlignment: 'Neutral', note: '' },
  { date: '4/22/2026', type: 'Expense', amount: 380, categoryGroup: 'Survival', subcategory: 'Food', paymentMethod: 'Cash', valueAlignment: 'Worth It', note: 'Supermarket' },

  // April 2026 - Fulfillment
  { date: '4/2/2026', type: 'Expense', amount: 180, categoryGroup: 'Fulfillment', subcategory: 'Drink & Cafe', paymentMethod: 'Cash', valueAlignment: 'Worth It', note: 'Morning coffee x5' },
  { date: '4/4/2026', type: 'Expense', amount: 520, categoryGroup: 'Fulfillment', subcategory: 'Restaurant', paymentMethod: 'Credit Card', valueAlignment: 'Worth It', note: 'Dinner with friends' },
  { date: '4/8/2026', type: 'Expense', amount: 2200, categoryGroup: 'Fulfillment', subcategory: 'Shopping', paymentMethod: 'Credit Card', valueAlignment: 'Worth It', note: 'New shoes' },
  { date: '4/11/2026', type: 'Expense', amount: 350, categoryGroup: 'Fulfillment', subcategory: 'Drink & Cafe', paymentMethod: 'Cash', valueAlignment: 'Neutral', note: '' },
  { date: '4/13/2026', type: 'Expense', amount: 890, categoryGroup: 'Fulfillment', subcategory: 'Game & Entertainment', paymentMethod: 'Credit Card', valueAlignment: 'Worth It', note: 'Concert tickets' },
  { date: '4/16/2026', type: 'Expense', amount: 4500, categoryGroup: 'Fulfillment', subcategory: 'Travel', paymentMethod: 'Credit Card', valueAlignment: 'Worth It', note: 'Weekend Chiang Mai' },
  { date: '4/20/2026', type: 'Expense', amount: 280, categoryGroup: 'Fulfillment', subcategory: 'Restaurant', paymentMethod: 'Cash', valueAlignment: 'Worth It', note: 'Sushi lunch' },
  { date: '4/23/2026', type: 'Expense', amount: 150, categoryGroup: 'Fulfillment', subcategory: 'Sport', paymentMethod: 'Cash', valueAlignment: 'Worth It', note: 'Gym day pass' },

  // April 2026 - Capital
  { date: '4/6/2026', type: 'Expense', amount: 590, categoryGroup: 'Capital', subcategory: 'Books', paymentMethod: 'Credit Card', valueAlignment: 'Worth It', note: 'Atomic Habits + Deep Work' },
  { date: '4/12/2026', type: 'Expense', amount: 1490, categoryGroup: 'Capital', subcategory: 'Course', paymentMethod: 'Credit Card', valueAlignment: 'Worth It', note: 'Udemy React course' },
  { date: '4/19/2026', type: 'Expense', amount: 5000, categoryGroup: 'Capital', subcategory: 'Investment', paymentMethod: 'Transfer', valueAlignment: 'Worth It', note: 'DCA ETF' },

  // April 2026 - Giving
  { date: '4/9/2026', type: 'Expense', amount: 500, categoryGroup: 'Giving', subcategory: 'Family support', paymentMethod: 'Transfer', valueAlignment: 'Worth It', note: 'Mom' },
  { date: '4/17/2026', type: 'Expense', amount: 300, categoryGroup: 'Giving', subcategory: 'Gift', paymentMethod: 'Cash', valueAlignment: 'Worth It', note: "Friend's birthday" },

  // April 2026 - Unconscious
  { date: '4/1/2026', type: 'Expense', amount: 429, categoryGroup: 'Unconscious', subcategory: 'Subscription', paymentMethod: 'Credit Card', valueAlignment: 'Neutral', note: 'Netflix + Spotify + iCloud' },
  { date: '4/3/2026', type: 'Expense', amount: 45, categoryGroup: 'Unconscious', subcategory: 'Convenience spend', paymentMethod: 'Cash', valueAlignment: 'Not Worth It', note: '7-Eleven impulse' },
  { date: '4/21/2026', type: 'Expense', amount: 210, categoryGroup: 'Unconscious', subcategory: 'Random', paymentMethod: 'Cash', valueAlignment: 'Not Worth It', note: '' },

  // March 2026 - Income
  { date: '3/1/2026', type: 'Income', amount: 85000, categoryGroup: 'Income', subcategory: 'Salary', paymentMethod: 'Transfer', valueAlignment: 'Worth It', note: 'Monthly salary' },
  { date: '3/20/2026', type: 'Income', amount: 3500, categoryGroup: 'Income', subcategory: 'Investment Income', paymentMethod: 'Transfer', valueAlignment: 'Worth It', note: 'Dividend' },

  // March 2026 - Expenses
  { date: '3/2/2026', type: 'Expense', amount: 290, categoryGroup: 'Survival', subcategory: 'Food', paymentMethod: 'Cash', valueAlignment: 'Worth It', note: '' },
  { date: '3/4/2026', type: 'Expense', amount: 420, categoryGroup: 'Fulfillment', subcategory: 'Restaurant', paymentMethod: 'Credit Card', valueAlignment: 'Worth It', note: 'Team lunch' },
  { date: '3/6/2026', type: 'Expense', amount: 99, categoryGroup: 'Unconscious', subcategory: 'Subscription', paymentMethod: 'Credit Card', valueAlignment: 'Neutral', note: 'ChatGPT Plus' },
  { date: '3/8/2026', type: 'Expense', amount: 1800, categoryGroup: 'Fulfillment', subcategory: 'Shopping', paymentMethod: 'Credit Card', valueAlignment: 'Worth It', note: 'Clothes' },
  { date: '3/10/2026', type: 'Expense', amount: 2500, categoryGroup: 'Capital', subcategory: 'Investment', paymentMethod: 'Transfer', valueAlignment: 'Worth It', note: 'DCA ETF' },
  { date: '3/12/2026', type: 'Expense', amount: 45, categoryGroup: 'Survival', subcategory: 'Public Transport', paymentMethod: 'Cash', valueAlignment: 'Worth It', note: 'BTS' },
  { date: '3/14/2026', type: 'Expense', amount: 680, categoryGroup: 'Fulfillment', subcategory: 'Travel', paymentMethod: 'Credit Card', valueAlignment: 'Worth It', note: 'Pattaya day trip' },
  { date: '3/16/2026', type: 'Expense', amount: 350, categoryGroup: 'Survival', subcategory: 'Utilities', paymentMethod: 'Transfer', valueAlignment: 'Worth It', note: '' },
  { date: '3/18/2026', type: 'Expense', amount: 240, categoryGroup: 'Fulfillment', subcategory: 'Drink & Cafe', paymentMethod: 'Cash', valueAlignment: 'Worth It', note: '' },
  { date: '3/22/2026', type: 'Expense', amount: 500, categoryGroup: 'Giving', subcategory: 'Family support', paymentMethod: 'Transfer', valueAlignment: 'Worth It', note: 'Mom' },
  { date: '3/25/2026', type: 'Expense', amount: 155, categoryGroup: 'Unconscious', subcategory: 'Convenience spend', paymentMethod: 'Cash', valueAlignment: 'Not Worth It', note: '' },

  // February 2026
  { date: '2/1/2026', type: 'Income', amount: 85000, categoryGroup: 'Income', subcategory: 'Salary', paymentMethod: 'Transfer', valueAlignment: 'Worth It', note: '' },
  { date: '2/3/2026', type: 'Expense', amount: 310, categoryGroup: 'Survival', subcategory: 'Food', paymentMethod: 'Cash', valueAlignment: 'Worth It', note: '' },
  { date: '2/5/2026', type: 'Expense', amount: 8900, categoryGroup: 'Fulfillment', subcategory: 'Travel', paymentMethod: 'Credit Card', valueAlignment: 'Worth It', note: 'Phuket trip' },
  { date: '2/10/2026', type: 'Expense', amount: 429, categoryGroup: 'Unconscious', subcategory: 'Subscription', paymentMethod: 'Credit Card', valueAlignment: 'Neutral', note: '' },
  { date: '2/14/2026', type: 'Expense', amount: 1200, categoryGroup: 'Giving', subcategory: 'Gift', paymentMethod: 'Credit Card', valueAlignment: 'Worth It', note: "Valentine's" },
  { date: '2/18/2026', type: 'Expense', amount: 5000, categoryGroup: 'Capital', subcategory: 'Investment', paymentMethod: 'Transfer', valueAlignment: 'Worth It', note: 'DCA ETF' },
  { date: '2/20/2026', type: 'Expense', amount: 880, categoryGroup: 'Fulfillment', subcategory: 'Shopping', paymentMethod: 'Credit Card', valueAlignment: 'Neutral', note: '' },
  { date: '2/25/2026', type: 'Expense', amount: 500, categoryGroup: 'Giving', subcategory: 'Family support', paymentMethod: 'Transfer', valueAlignment: 'Worth It', note: 'Mom' },
]
