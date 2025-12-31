# Contributing to TheraSpace

## Development Workflow

### Getting Started

1. **Clone the repository**
```bash
git clone https://github.com/lecuyerpsychologue-lab/psiav2.git
cd psiav2
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

## Project Structure

```
src/
├── components/
│   ├── auth/              # Authentication components
│   ├── dashboard/         # Main dashboard
│   ├── modules/           # Individual therapy modules
│   │   ├── Humeur/       # Mood tracking
│   │   ├── Respiration/  # Breathing exercises
│   │   ├── Ancrage/      # Grounding technique
│   │   ├── Journal/      # Note taking
│   │   ├── Psy/          # AI chat
│   │   └── Oracle/       # Wisdom stories
│   └── ui/               # Reusable UI components
├── contexts/             # React contexts (Auth, Theme)
├── utils/               # Helper functions
│   ├── helpers.js       # General utilities
│   └── ai.js           # AI integration helpers
├── App.jsx             # Main app component
├── main.jsx           # Entry point
└── index.css          # Global styles
```

## Adding a New Module

1. **Create module directory**
```bash
mkdir src/components/modules/YourModule
```

2. **Create component file**
```javascript
// src/components/modules/YourModule/YourModule.jsx
import React from 'react';
import { X } from 'lucide-react';

const YourModule = ({ onBack }) => {
  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-cream via-white to-cream/50 dark:from-dark-bg dark:via-dark-card dark:to-dark-bg overflow-hidden">
      {/* Header */}
      <header className="flex-shrink-0 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-2xl bg-gradient-to-br from-teal to-cyan-400">
            {/* Icon */}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate dark:text-dark-text">
              Your Module
            </h1>
            <p className="text-sm text-slate/70 dark:text-dark-text/70">
              Description
            </p>
          </div>
        </div>
        <button
          onClick={onBack}
          className="p-2 rounded-2xl hover:bg-slate/10 dark:hover:bg-dark-text/10 transition-colors"
        >
          <X className="w-6 h-6 text-slate dark:text-dark-text" />
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto px-4 pb-4 scrollbar-hide">
        {/* Your content */}
      </main>
    </div>
  );
};

export default YourModule;
```

3. **Add to App.jsx routing**
```javascript
import YourModule from './modules/YourModule/YourModule';

// In the switch statement:
case 'yourmodule':
  return <YourModule onBack={onBack} />;
```

4. **Add to Dashboard**
```javascript
// In Dashboard.jsx modules array:
{
  id: 'yourmodule',
  name: 'Your Module',
  description: 'Short description',
  icon: YourIcon,
  color: 'from-color to-color',
  bgColor: 'bg-color/10'
}
```

## Design Guidelines

### Colors

Use the predefined color palette:
- **Coral** (`#FF8FAB`): Emotion/Heart themes
- **Teal** (`#2A9D8F`): Stability/Calm themes
- **Solar** (`#E9C46A`): Energy/Wisdom themes
- **Cream** (`#FDFBF7`): Background
- **Slate** (`#2D3748`): Text

### Components

Always use the reusable UI components:
- `<Button variant="primary|coral|solar|outline|ghost" />`
- `<Card />`
- `<Modal />`
- `<Input />`

### Styling

- Use Tailwind utility classes
- Maintain glassmorphism effect: `glass-card` class
- Use `rounded-3xl` for large elements
- Use `rounded-2xl` for buttons and inputs
- Add hover states for interactive elements
- Support dark mode with `dark:` prefix

### Responsive Design

- Design mobile-first
- Use `h-screen` and `100dvh` for full-screen layouts
- Test on various screen sizes
- Ensure touch-friendly tap targets (min 44x44px)

## Data Management

### LocalStorage

Use the storage utility:
```javascript
import { storage } from '../utils/helpers';

// Save data
storage.set('key', value);

// Get data
const data = storage.get('key');

// Remove data
storage.remove('key');
```

### User-specific data

Always scope data to user ID:
```javascript
const key = `module_data_${user.id}`;
storage.set(key, data);
```

## AI Integration

### Using the AI helper

```javascript
import { callAI } from '../utils/ai';

const response = await callAI(
  [{ role: 'user', content: 'Your message' }],
  'psy', // module name
  { /* optional context */ }
);
```

### Safety Guards

Always check for crisis keywords:
```javascript
import { containsCrisisKeywords, getCrisisResponse } from '../utils/ai';

if (containsCrisisKeywords(userInput)) {
  return getCrisisResponse();
}
```

## Testing

### Manual Testing Checklist

- [ ] Module loads without errors
- [ ] All interactions work (buttons, inputs, etc.)
- [ ] Data persists in localStorage
- [ ] Works in light and dark mode
- [ ] Responsive on mobile and desktop
- [ ] Back button returns to dashboard
- [ ] No console errors

### Build Test

Always test build before committing:
```bash
npm run build
```

## Code Style

### JavaScript

- Use functional components with hooks
- Use arrow functions
- Destructure props
- Keep components focused (single responsibility)
- Add comments for complex logic

### React

- Use `useState` for local state
- Use `useEffect` for side effects
- Use `useContext` for global state
- Always clean up in useEffect
- Use meaningful variable names

### CSS

- Prefer Tailwind utilities
- Use custom classes in index.css for reusable patterns
- Follow the existing naming convention
- Add dark mode support

## Git Workflow

### Branches

- `main`: Production-ready code
- Feature branches: `feature/module-name`
- Fix branches: `fix/issue-description`

### Commits

Use clear, descriptive commit messages:
```
feat: Add Identité module with interview flow
fix: Resolve localStorage data persistence issue
docs: Update README with new module info
style: Improve mobile responsiveness for Dashboard
```

### Pull Requests

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Commit with clear messages
5. Push to GitHub
6. Create PR with description

## Best Practices

### Performance

- Lazy load images
- Use React.memo for expensive components
- Debounce user inputs
- Optimize re-renders

### Accessibility

- Use semantic HTML
- Add ARIA labels where needed
- Ensure keyboard navigation works
- Maintain good color contrast

### Security

- Never commit API keys
- Sanitize user inputs
- Use HTTPS in production
- Validate data before saving

### User Experience

- Provide loading states
- Show error messages clearly
- Add confirmation for destructive actions
- Keep interfaces simple and intuitive
- Always provide a way back

## Resources

- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Lucide Icons](https://lucide.dev)
- [Vite Guide](https://vitejs.dev)
- [Vercel Docs](https://vercel.com/docs)

## Questions?

For questions or issues:
1. Check existing documentation
2. Review similar modules
3. Test in isolation
4. Ask for help if needed

---

**Remember**: This app supports mental health. Every feature should be thoughtful, empathetic, and user-centered.
