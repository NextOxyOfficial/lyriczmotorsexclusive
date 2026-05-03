# Lyricz Motors - Inventory Design (Reference-Based)

## 🎨 Design Overview

The homepage has been completely redesigned to match the reference motorcycle inventory website you provided. This is a professional, clean inventory listing layout focused on showcasing bikes with detailed specifications.

## 📋 New Components

### 1. **Navbar** (Black Background)
- **Style**: Black background with red accent color
- **Logo**: "LYRICZ MOTORS" text logo in red
- **Menu Items**: Home, About, Pages, Gallery, News, Shop, Contact
- **Icons**: Search, Shopping Cart, User profile
- **Mobile**: Hamburger menu with red background button
- **Sticky**: Fixed to top on scroll

### 2. **Hero Section** (Inventory Header)
- **Background**: Dark motorcycle image with overlay
- **Title**: Large "INVENTORY" text in uppercase
- **Breadcrumb**: "Home / Inventory" in bottom right
- **Diagonal Edge**: White SVG diagonal cut at bottom
- **Height**: ~450px
- **Style**: Bold, impactful header

### 3. **BikeInventory** (Main Content)
**Layout**: Sidebar + Main Content (2-column)

#### **Sidebar Filters** (Left - 320px width)
- **Search Options Widget** (Red background)
  - Icon and description
  
- **Filter Sections** (Gray background boxes):
  - Type of Bike (dropdown)
  - Select Make (dropdown)
  - Price Range (slider: $0 - $20,000)
  - Select Mileage (dropdown)
  
- **Apply Filter Button** (Red, full width with arrow)

- **Contact Card** (Black background)
  - Phone icon in red circle
  - Phone number: +1 (360) 555 0168
  - Call to action text

- **Mileage Range Info** (Gray box)
  - Min/Max mileage display

#### **Main Content** (Right - Flexible width)
- **Search Bar**:
  - Text input: "Your search for real results..."
  - Red "SEARCH" button
  - Sort dropdown: "New Arrival"
  - Grid/List view toggle buttons

- **Bike Listings** (List view):
  Each bike card contains:
  - **Left**: Bike image (320x256px)
  - **Badge**: Green "SPECIAL" or "FEATURED" label
  - **Right**: Details section
    - Bike name (large, uppercase, bold)
    - Price (large, red, right-aligned)
    - Specs row: MAKE, TYPE, YEAR, MODEL NAME
    - Icon row (4 columns):
      - Location (with map pin icon)
      - Year/Model (with calendar icon)
      - Mileage (with gauge icon)
      - Condition (with settings icon)
    - Dealer info at bottom
  
- **Pagination**: Numbered buttons (01, 02, 03)

### 4. **Newsletter Section**
- **Background**: Dark gray/black (#1a1a1a)
- **Title**: "SUBSCRIBE FOR UPDATED" (large, uppercase)
- **Subtitle**: "Get Every Single Update" (red, small)
- **Form**: Email input + Red "Subscribe" button with arrow
- **Layout**: Centered, max-width container

### 5. **Footer** (Black Background)
**4-Column Grid Layout**:

1. **About RevMoto**
   - Company description
   - Address

2. **Latest News**
   - 2 news items with thumbnails
   - Titles and dates

3. **Dealer Information**
   - Links list (5 items)

4. **Contact Us**
   - Phone, Email, Hours
   - Social media icons (Facebook, Twitter, Instagram, YouTube)

**Bottom Bar**:
- Copyright text
- Privacy, Terms, Cookie Policy links

## 🎨 Color Scheme

| Element | Color | Hex |
|---------|-------|-----|
| Primary (Red) | Red | #DC2626 |
| Background (Black) | Black | #000000 |
| Dark Gray | Dark Gray | #1a1a1a |
| Light Gray | Light Gray | #f3f4f6 |
| Text | White/Black | #ffffff / #000000 |
| Borders | Gray | #e5e7eb |
| Success (Green) | Green | #10b981 |

## 📱 Responsive Breakpoints

### Mobile (< 640px)
- Single column layout
- Sidebar filters collapse/stack
- Full-width bike cards
- Stacked image and details

### Tablet (640px - 1024px)
- Sidebar remains visible
- 2-column grids where applicable
- Adjusted spacing

### Desktop (> 1024px)
- Full sidebar + main content layout
- Optimal spacing and sizing
- All features visible

## 🏍️ Bike Data Structure

```typescript
interface Bike {
  id: number
  name: string
  price: number
  image: string
  badge?: 'SPECIAL' | 'FEATURED'
  make: string
  type: string
  year: number
  mileage: string
  modelName: string
  condition: string
  location: string
  dealer: string
}
```

## ✨ Key Features

### Filters
- ✅ Type of bike dropdown
- ✅ Make/brand selection
- ✅ Price range slider
- ✅ Mileage filter
- ✅ Apply filter button

### Bike Listings
- ✅ List/Grid view toggle
- ✅ Search functionality
- ✅ Sort options
- ✅ Detailed specs display
- ✅ Badge system (Special/Featured)
- ✅ Dealer information
- ✅ Location, year, mileage, condition icons

### User Experience
- ✅ Sticky navigation
- ✅ Hover effects on cards
- ✅ Smooth transitions
- ✅ Mobile-responsive
- ✅ Clean, professional layout
- ✅ Easy-to-scan information

## 🚀 Sample Bikes Included

1. **FRANK STARR 125 MOTORBIKE** - $4,500 (Special)
2. **YAMAHA YZF09 R3R5** - $3,200 (Featured)
3. **KTM RC 390 RACE** - $4,850
4. **DUCATI HYPERMOTARD 950 RVE** - $9,200 (Special)
5. **KAWASAKI VULCAN 900** - $6,500

## 📝 Notes

- All images use Unsplash motorcycle photos as placeholders
- Icons from Lucide React library
- TailwindCSS for all styling
- Fully responsive design
- Clean, professional inventory layout
- Matches reference design structure and style
