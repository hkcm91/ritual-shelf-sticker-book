
# Virtual Bookshelf App

A fully interactive virtual bookshelf application that lets you organize your books, add notes, track reading progress, and customize your shelves.

## Features

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
