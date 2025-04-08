
# Virtual Bookshelf App

A fully interactive virtual bookshelf application that lets you organize your books, add notes, track reading progress, and customize your shelves. Now featuring a Widget Launcher for different types of collections.

## Features

### Library Types
- **Book Library**: Track and organize your book collection
- **Widget Launcher**: Access specialized sticker books for different content types
- **Notebook Library** (Coming Soon): Store and organize your notes and journals
- **Recipe Library** (Coming Soon): Collect recipes from online and family traditions
- **Music Library** (Coming Soon): Track your favorite songs and playlists

### Book Management
- Upload book covers using drag and drop or file selection
- Track reading progress with visual progress bars
- Rate books and organize into customizable shelves
- Add detailed notes, plot summaries, and character information
- Create custom quizzes for each book

### Stickers & Decorations
- Add decorative stickers and Lottie animations to your shelves
- Add stickers via file uploads or direct URLs
- Resize, rotate, and reposition stickers
- Adjust opacity and scale of decorative elements
- Support for both image stickers and Lottie animations

### Shelf Customization
- Create multiple bookshelves with custom names
- Customize shelf appearance (colors, textures, backgrounds)
- Adjust shelf dimensions (rows and columns)
- Set custom background images for your entire collection
- Reset shelves to default state when needed

### Organization
- Drag and drop books between shelf positions
- Multiple shelves for different categories
- Search functionality to quickly find books

### Storage Options
- Local browser storage for offline usage
- Cloud storage integration (coming soon)
  - Sync across devices
  - Secure backup of your book collection
  - Share bookshelves with friends

### User Authentication (coming soon)
- Create an account to access your bookshelf anywhere
- Secure sign-in options
- User profile customization
- Public and private bookshelves

## Usage Instructions

### Adding Books
1. Click on any empty slot with the "Book" tab selected
2. Upload a book cover image
3. Fill in book details in the modal that appears
4. Track your reading progress using the progress slider

### Using the Widget Launcher
1. Click on the "Widget Launcher" button in the header
2. Select the type of library you want to work with
3. Each library type has specialized features for its content

### Adding Stickers/Decorations
1. Click on any empty slot with the "Sticker" tab selected
2. Upload an image or Lottie JSON file, or add from URL
3. Use the popover controls to resize, rotate, or reposition

### Shelf Management
- Create new shelves using the "+" button in the header
- Rename shelves using the edit button
- Customize shelf appearance in the shelf controls menu
- Reset your bookshelf to default in storage settings

### Background Customization
- Click the palette icon to set a custom background
- Upload your own image or use a URL

### Storage Management
- View storage usage statistics
- Choose between local and cloud storage (when available)
- Reset shelf data or all application data as needed

## Debugging Guide

### Common Issues and Solutions

#### Empty Slots Not Displaying Controls
- Check console logs for errors related to empty slots
- Verify CSS classes for slot controls (`SlotControls.tsx`)
- Ensure z-index values are correct in the CSS
- Look for errors in the EmptySlot component 

#### Zoom Controls Not Working
- Check if `zoomSlice.ts` is properly integrated in the bookshelf store
- Verify that the ZoomControls component is rendering properly
- Check CSS classes for proper styling of zoom controls

#### Missing Book Slots
- Inspect the ShelfRow component in the browser dev tools
- Verify row and column configuration in the active shelf settings
- Check console logs for any errors in rendering grid components

#### Drag and Drop Issues
- Inspect the useDragAndDrop hook implementation
- Check event handlers in BookSlot and related components
- Verify proper event propagation and default prevention

#### Widget Launcher Navigation Issues
- Check the router configuration in main.tsx
- Verify that the Link components have correct paths
- Inspect NavigationMenu styling in the header component

### Using Browser DevTools
1. Open browser developer tools (F12 or Ctrl+Shift+I)
2. Check the console tab for error messages
3. Use the Elements tab to inspect component structure
4. Use the Network tab to check for failed resource loading
5. Set breakpoints in the Sources tab to debug JavaScript execution

### Adding Console Logs
Add strategic console logs with descriptive prefixes:
```jsx
// Component render logs
console.log("[ComponentName] Rendering with props:", props);

// Function call logs
console.log("[FunctionName] Called with args:", args);

// State change logs
console.log("[StateName] Changed from", prevState, "to", newState);
```

### Protected Core Functionality
The codebase contains protected core functionality that should not be modified:
- **DO NOT MODIFY** `zoomSlice.ts` as it contains essential zoom functionality
- **DO NOT MODIFY** drag and drop hooks as they are critical for shelf interaction
- **DO NOT MODIFY** the bookshelf grid layout rendering
- **DO NOT MODIFY** core theme application logic

## Development Notes

### Core Components
- **DO NOT MODIFY** the core zoom functionality in `zoomSlice.ts` as it's essential for the bookshelf interface
- **DO NOT MODIFY** drag and drop hooks without thorough testing to ensure compatibility
- **DO NOT MODIFY** the bookshelf grid layout rendering without consideration for all shelf configurations

### State Management Guidelines
- Keep Zustand slices small and focused on specific functionality
- Use selector functions to access only needed state portions
- Update state immutably to ensure proper re-renders

## Getting Started

```sh
# Clone the repository
git clone <repository-url>

# Navigate to the project directory
cd virtual-bookshelf

# Install dependencies
npm install

# Start the development server
npm run dev
```

## Technologies
- React with TypeScript
- Zustand for state management
- Tailwind CSS for styling
- Shadcn UI components
- Lottie for animations
- Browser storage API for data persistence
- Cloud storage integration (coming soon)

## Future Development Plans
- Mobile application using Capacitor
- Cross-device synchronization with cloud storage
- Social features for sharing bookshelves
- Book import from external APIs
- Enhanced search and filtering capabilities

## License
This project is open source and available under the MIT License.
