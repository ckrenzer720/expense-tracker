# Expense Tracker

A modern, intuitive personal finance management application that helps users track spending, manage budgets, and gain insights into their financial habits.

## Features

- **📊 Expense Tracking**: Add, edit, and delete expenses with categories
- **💰 Budget Management**: Set monthly budgets per category
- **📈 Analytics**: View spending trends and category breakdowns
- **🎨 Modern UI**: Clean, responsive design with dark/light mode support
- **💾 Local Storage**: All data stored locally for privacy
- **📱 Responsive**: Works on desktop, tablet, and mobile

## Tech Stack

- **Frontend**: React.js with Vite
- **Styling**: CSS with CSS Custom Properties
- **State Management**: React Context API
- **Data Storage**: Local Storage
- **Build Tool**: Vite

## Project Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── Header.jsx
│   │   └── Sidebar.jsx
│   ├── ui/
│   │   ├── Button.jsx
│   │   └── Card.jsx
│   └── forms/
├── context/
│   ├── ExpenseContext.js
│   └── ExpenseProvider.jsx
├── hooks/
│   └── useExpense.js
├── utils/
│   ├── currency.js
│   └── validation.js
├── data/
├── styles/
├── App.jsx
├── main.jsx
└── index.css
```

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd expense-tracker
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Project Architecture

#### Components

- **Layout Components**: Header, Sidebar, and main layout structure
- **UI Components**: Reusable components like Button, Card
- **Form Components**: Expense forms and input components

#### State Management

- **ExpenseContext**: Central state management for expenses, categories, and budgets
- **useExpense Hook**: Custom hook for accessing expense context

#### Utilities

- **currency.js**: Currency formatting and calculation utilities
- **validation.js**: Form validation functions

## Design System

### Colors

- **Primary**: Blue (#3B82F6) - Trust, stability
- **Secondary**: Green (#10B981) - Success, money
- **Warning**: Orange (#F59E0B) - Caution, approaching limits
- **Danger**: Red (#EF4444) - Over budget, errors
- **Neutral**: Gray (#6B7280) - Text, borders

### Typography

- **Font Family**: system-ui, Avenir, Helvetica, Arial, sans-serif
- **Line Height**: 1.5
- **Font Weight**: 400 (normal), 500 (medium), 600 (semibold)

## Data Structure

### Expense Object

```javascript
{
  id: string,
  amount: number,
  category: string,
  date: Date,
  notes: string,
  createdAt: Date,
  updatedAt: Date
}
```

### Category Object

```javascript
{
  id: string,
  name: string,
  color: string,
  icon: string,
  isCustom: boolean
}
```

### Budget Object

```javascript
{
  id: string,
  categoryId: string,
  amount: number,
  month: string, // YYYY-MM format
  rollover: boolean
}
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Roadmap

### Phase 1: Core Functionality ✅

- [x] Basic expense entry and listing
- [x] Pre-defined categories
- [x] Simple monthly view
- [x] Local data storage

### Phase 2: Budget Management

- [ ] Budget setting per category
- [ ] Budget tracking and alerts
- [ ] Visual budget indicators

### Phase 3: Analytics & Insights

- [ ] Spending charts and graphs
- [ ] Trend analysis
- [ ] Category breakdown
- [ ] Monthly comparisons

### Phase 4: Advanced Features

- [ ] Custom categories
- [ ] Data export/import
- [ ] Settings and preferences
- [ ] Mobile optimization

### Phase 5: Enhanced UX

- [ ] Dark mode
- [ ] Notifications
- [ ] Keyboard shortcuts
- [ ] Advanced filtering

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Design inspiration from modern financial apps
- Icons from Lucide React
- Color palette based on Tailwind CSS

<!-- 🚀 Implementation Strategy
Week 1: Foundation
Days 1-2: Restructure project and fix naming √

Days 3-4: Add error boundaries and loading states
Days 5-7: Modularize CSS and persist budget data

Week 2: Tooling
Days 1-2: Add dependencies and configure tools
Days 3-4: Set up Prettier, ESLint, and Git hooks
Days 5-7: Create component index files and improve imports

Week 3: Performance
Days 1-2: Add React.memo and useMemo optimizations
Days 3-4: Implement code splitting and lazy loading
Days 5-7: Add toast notifications and enhanced UX

Week 4: Features
Days 1-2: Add data export/import functionality
Days 3-4: Implement search and advanced filtering
Days 5-7: Add accessibility improvements

Week 5: Testing
Days 1-3: Set up testing framework and write tests
Days 4-5: Add production optimizations
Days 6-7: Final polish and documentation -->
