# Tech Stack

## Core Languages
- **HTML5**: Used for semantic structural markup across all pages (`index.html`, `products.html`, `productdetial.html`).
- **CSS3**: Used for custom styling, layouts, and animations directly in `styles.css`.
- **JavaScript (ES6+)**: Handles dynamic rendering, search/filtering logic, cart management, and admin CSV parsing in `script.js`.

## Frameworks & Libraries
- **Tailwind CSS**: Utility-first CSS framework utilized for rapid UI development and ensuring responsive layouts across different breakpoints.
- **Font Awesome (6.4.0)**: Provides a comprehensive library of modern vector icons used throughout the UI.

## Tools, APIs & Storage
- **Local Storage API**: Eliminates the need for a database right now by persistently storing the product catalog (`wholesaleMedicines`) and the user's cart (`enquiryCart`) directly in the browser across sessions.
- **WhatsApp API**: Used to generate direct messaging links (`https://wa.me/...`) pre-filled with formatted text summarizing the user's enquiry or cart contents.
- **CSV/Google Sheets**: Acts as an ad-hoc CMS, allowing admins to upload datasets formatted in a specific way to update the catalog.
