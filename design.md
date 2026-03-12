# Design

## Structural Overview
The project is built around a lightweight frontend architecture:
```
trusted/
├── index.html          # Main homepage with product catalog
├── products.html       # Full products listing page
├── productdetial.html  # Product detail page (linked with ?id=)
├── script.js           # Shared JavaScript functionality
├── styles.css          # Custom styling and animations
└── readme.md           # Documentation
```

## Design Features
- **Modern UI**: Clean, professional design with gradient effects
- **Smooth Animations**: Card hover effects, modal transitions, toast notifications
- **Color Scheme**: 
  - Primary Blue (#007BFF)
  - Success Green (#28A745)
  - Accent Orange (#FFA500)
- **Icons**: Font Awesome 6.4.0 for modern icons
- **Typography**: Inter font family for clean readability

## Responsive Breakpoints
- **Mobile**: < 768px (Single column grid)
- **Tablet**: 768px - 1024px (2-3 column grid)
- **Desktop**: > 1024px (Full 4+ column grid)

## User Flows

### For Customers:
1. Browse products on the homepage or full products page.
2. Search or filter by category.
3. View product details by clicking on a product card.
4. Add items to the enquiry cart with the desired quantity.
5. Review the cart and send a consolidated enquiry via WhatsApp.

### For Admins:
1. Click the "Admin" button in the navigation.
2. Upload a formatted CSV file or paste a Google Sheets URL.
3. Products automatically load into the catalog using LocalStorage.
4. Monitor the total product count and clear products if necessary.
