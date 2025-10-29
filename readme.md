# Trusted Wholesale Medicines - E-Commerce Website

A modern, responsive e-commerce website for wholesale medicine distribution with WhatsApp integration for order enquiries.

## 🚀 Features

### 🏠 Main Features
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Product Catalog**: Browse through an extensive collection of medicines with detailed information
- **Search & Filter**: Easy search by name, description, company, or category with filtering options
- **Product Detail Pages**: Dedicated pages for each product with quantity selection and related products
- **Shopping Cart**: Add multiple products with adjustable quantities
- **WhatsApp Integration**: Send product enquiries directly via WhatsApp
- **Admin Panel**: Manage products by uploading CSV files or importing from Google Sheets

### 📱 WhatsApp Integration
- Direct product enquiry
- Bulk cart enquiry
- Instant customer support
- Automated enquiry message generation

### 🛠️ Admin Features
- Upload CSV files with product data
- Import products from Google Sheets
- Download sample CSV template
- View total product count
- Clear all products

## 📁 Project Structure

```
trusted/
├── index.html          # Main homepage with product catalog
├── product.html        # Product detail pages
├── script.js          # All JavaScript functionality
├── styles.css          # Custom styling and animations
└── readme.md           # This file
```

## 🎨 Design Features

- **Modern UI**: Clean, professional design with gradient effects
- **Smooth Animations**: Card hover effects, modal transitions, toast notifications
- **Color Scheme**: 
  - Primary Blue (#007BFF)
  - Success Green (#28A745)
  - Accent Orange (#FFA500)
- **Icons**: Font Awesome 6.4.0 for modern icons
- **Typography**: Inter font family for clean readability

## 🔧 Technologies Used

- **HTML5**: Semantic markup
- **CSS3**: Custom styling with animations
- **JavaScript**: ES6+ features
- **Tailwind CSS**: Utility-first CSS framework
- **Font Awesome**: Icon library
- **Local Storage API**: Data persistence
- **WhatsApp API**: Direct messaging integration

## 📦 Product Data Structure

Each product contains:
```javascript
{
  id: Number,
  name: String,
  category: String,
  company: String,
  price: String,
  description: String,
  stock: String
}
```

## 📝 CSV Format

Upload products using CSV with this format:
```csv
name,category,company,price,description,stock
Paracetamol 500mg,Pain Relief,Cipla,₹120/strip,Effective pain and fever relief,In Stock
Amoxicillin 250mg,Antibiotics,Sun Pharma,₹250/strip,Broad-spectrum antibiotic,In Stock
```

## 🚦 Getting Started

1. Open `index.html` in a web browser
2. Browse products in the catalog
3. Click on any product to view details
4. Add products to enquiry cart
5. Send enquiry via WhatsApp

## 🎯 User Flow

### For Customers:
1. Browse products on homepage
2. Search or filter by category
3. View product details by clicking on product
4. Add items to cart with desired quantity
5. Send enquiry via WhatsApp

### For Admins:
1. Click "Admin" button in navigation
2. Upload CSV file or paste Google Sheets URL
3. Products automatically load into catalog
4. Monitor total product count

## 📱 Responsive Breakpoints

- **Mobile**: < 768px (Single column grid)
- **Tablet**: 768px - 1024px (2-3 column grid)
- **Desktop**: > 1024px (Full 4+ column grid)

## 🔐 Data Persistence

- Products stored in `localStorage` with key `wholesaleMedicines`
- Cart items stored in `localStorage` with key `enquiryCart`
- Data persists across browser sessions

## 📞 Contact Integration

Replace WhatsApp number in `script.js`:
```javascript
const whatsappUrl = `https://wa.me/919876543210?text=${encoded}`;
// Change: +91 98765 43210 to your number
```

## 🎨 Customization

### Update Colors in `styles.css`:
```css
:root {
    --primary: #007BFF;
    --success: #28A745;
    --accent: #FFA500;
}
```

### Update Company Details in HTML files:
- Company name
- Contact information
- Social media links
- Footer information

## 🚀 Future Enhancements

- [ ] Image upload for products
- [ ] User authentication
- [ ] Order tracking system
- [ ] Payment gateway integration
- [ ] Email notifications
- [ ] Product reviews and ratings
- [ ] Multi-language support
- [ ] Dark mode toggle
- [ ] Advanced analytics dashboard

## 📄 License

This project is created for Trusted Wholesale Medicines. All rights reserved.

## 👨‍💻 Development

Built with modern web technologies focusing on:
- Performance optimization
- Accessibility
- User experience
- Mobile-first approach
- Clean code architecture

## 🐛 Bug Reports

For issues or suggestions, please contact through the WhatsApp integration feature.

## 📞 Support

- WhatsApp: +91 98765 43210
- Email: info@trustedmeds.com

---

**Made with ❤️ for Trusted Wholesale Medicines**

