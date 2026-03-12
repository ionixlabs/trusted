// Global State
let products = [];
let cart = [];
let allCategories = new Set();

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    loadCart();
    updateCartUI();
    setupDragAndDrop();
});

// Load products from localStorage
function loadProducts() {
    const stored = localStorage.getItem('wholesaleMedicines');
    if (stored) {
        products = JSON.parse(stored);
    } else {
        // Sample products
        products = [
            { id: 1, name: 'Paracetamol 500mg', category: 'Pain Relief', company: 'Cipla', price: '120', description: 'Effective pain and fever relief', stock: 'In Stock', packingType: 'Strip', composition: 'Paracetamol 500mg', unitsPerPack: '10', gstRate: '12%' },
            { id: 2, name: 'Amoxicillin 250mg', category: 'Antibiotics', company: 'Sun Pharma', price: '250', description: 'Broad-spectrum antibiotic', stock: 'In Stock', packingType: 'Strip', composition: 'Amoxicillin 250mg', unitsPerPack: '10', gstRate: '12%' },
            { id: 3, name: 'Vitamin D3 60K', category: 'Vitamins', company: 'Zydus', price: '180', description: 'Bone health supplement', stock: 'In Stock', packingType: 'Strip', composition: 'Cholecalciferol 60000 IU', unitsPerPack: '4', gstRate: '12%' },
            { id: 4, name: 'Omeprazole 20mg', category: 'Digestive', company: 'Cipla', price: '150', description: 'Acid reflux treatment', stock: 'In Stock', packingType: 'Strip', composition: 'Omeprazole 20mg', unitsPerPack: '10', gstRate: '12%' },
            { id: 5, name: 'Cetirizine 10mg', category: 'Antihistamine', company: 'Glenmark', price: '90', description: 'Allergy relief medication', stock: 'In Stock', packingType: 'Strip', composition: 'Cetirizine 10mg', unitsPerPack: '10', gstRate: '12%' },
            { id: 6, name: 'Metformin 500mg', category: 'Diabetes', company: 'Sun Pharma', price: '200', description: 'Blood sugar management', stock: 'In Stock', packingType: 'Strip', composition: 'Metformin 500mg', unitsPerPack: '10', gstRate: '12%' }
        ];
        saveProducts();
    }
    // Set global products for use in other pages
    window.products = products;
    renderProducts();
    updateCategories();
    updateCompanies();
    updateProductCount();
}

// Save products to localStorage
function saveProducts() {
    localStorage.setItem('wholesaleMedicines', JSON.stringify(products));
    updateProductCount();
}

// Get packing type CSS class
function getPackingTypeClass(packingType) {
    if (!packingType) return '';
    const normalized = packingType.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const mapping = {
        'strip': 'packing-strip',
        'alu-alu': 'packing-alu-alu',
        'bottle': 'packing-bottle',
        'syrup': 'packing-syrup',
        'inhaler': 'packing-inhaler',
        'tube': 'packing-tube',
        'cream': 'packing-cream',
        'sachet': 'packing-sachet',
        'lozenge': 'packing-lozenge'
    };
    return mapping[normalized] || 'packing-strip';
}

// Get packing type badge HTML
function getPackingTypeBadge(product) {
    if (!product.packingType) return '';
    const className = getPackingTypeClass(product.packingType);
    return `<span class="packing-badge ${className}">${product.packingType}</span>`;
}

// Expose functions globally for use in HTML pages
window.getPackingTypeClass = getPackingTypeClass;
window.getPackingTypeBadge = getPackingTypeBadge;

// Render products
function renderProducts() {
    const grid = document.getElementById('productGrid');
    const emptyState = document.getElementById('emptyState');
    // If not on products page, safely exit
    if (!grid || !emptyState) return;

    if (products.length === 0) {
        grid.innerHTML = '';
        emptyState.classList.remove('hidden');
        return;
    }

    emptyState.classList.add('hidden');
    grid.innerHTML = products.map(product => {
        const productName = product.name || 'Unnamed Product';
        const productPrice = product.price || '0';
        const productCategory = product.category || 'General';
        const productDescription = product.description || '';
        return `
                <div class="card-hover bg-white rounded-xl shadow-md overflow-hidden cursor-pointer" onclick="window.location.href='productdetial.html?id=${product.id}'">
                    <div class="bg-gradient-to-br from-blue-500 to-blue-600 h-32 flex items-center justify-center">
                        <i class="fas fa-capsules text-6xl text-white opacity-80"></i>
                    </div>
                    <div class="p-5">
                        <div class="flex justify-between items-start mb-2">
                            <h3 class="font-bold text-lg text-gray-800 line-clamp-2">${productName}</h3>
                            ${product.stock === 'In Stock' ? '<span class="text-green-600 text-xs font-semibold"><i class="fas fa-check-circle"></i></span>' : '<span class="text-red-600 text-xs font-semibold">Out</span>'}
                        </div>
                        ${product.company ? `<p class="text-xs text-blue-600 mb-1 font-semibold"><i class="fas fa-industry"></i> ${product.company}</p>` : ''}
                        <p class="text-sm text-gray-600 mb-3 line-clamp-2">${productDescription}</p>
                        <div class="mb-3 flex flex-wrap gap-2">
                            <span class="category-badge">${productCategory}</span>
                            ${getPackingTypeBadge(product)}
                        </div>
                        <div class="flex justify-between items-center">
                            <span class="text-xl font-bold text-blue-600">₹${productPrice}</span>
                            <button onclick="event.stopPropagation(); addToCart(${product.id})" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full text-sm font-semibold transition">
                                <i class="fas fa-plus mr-1"></i> Add
                            </button>
                        </div>
                    </div>
                </div>
            `;
    }).join('');
}

// Filter products
function filterProducts() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const category = document.getElementById('categoryFilter').value;
    const company = document.getElementById('companyFilter').value;

    const filtered = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm) ||
            (product.company && product.company.toLowerCase().includes(searchTerm));
        const matchesCategory = !category || product.category === category;
        const matchesCompany = !company || (product.company && product.company === company);
        return matchesSearch && matchesCategory && matchesCompany;
    });

    const grid = document.getElementById('productGrid');
    const emptyState = document.getElementById('emptyState');

    if (filtered.length === 0) {
        grid.innerHTML = '';
        emptyState.classList.remove('hidden');
    } else {
        emptyState.classList.add('hidden');
        grid.innerHTML = filtered.map(product => {
            const productName = product.name || 'Unnamed Product';
            const productPrice = product.price || '0';
            const productCategory = product.category || 'General';
            const productDescription = product.description || '';
            return `
                    <div class="card-hover bg-white rounded-xl shadow-md overflow-hidden cursor-pointer" onclick="window.location.href='productdetial.html?id=${product.id}'">
                        <div class="bg-gradient-to-br from-blue-500 to-blue-600 h-32 flex items-center justify-center">
                            <i class="fas fa-capsules text-6xl text-white opacity-80"></i>
                        </div>
                        <div class="p-5">
                            <div class="flex justify-between items-start mb-2">
                                <h3 class="font-bold text-lg text-gray-800 line-clamp-2">${productName}</h3>
                                ${product.stock === 'In Stock' ? '<span class="text-green-600 text-xs font-semibold"><i class="fas fa-check-circle"></i></span>' : '<span class="text-red-600 text-xs font-semibold">Out</span>'}
                            </div>
                            ${product.company ? `<p class="text-xs text-blue-600 mb-1 font-semibold"><i class="fas fa-industry"></i> ${product.company}</p>` : ''}
                            <p class="text-sm text-gray-600 mb-3 line-clamp-2">${productDescription}</p>
                            <div class="mb-3 flex flex-wrap gap-2">
                                <span class="category-badge">${productCategory}</span>
                                ${getPackingTypeBadge(product)}
                            </div>
                            <div class="flex justify-between items-center">
                                <span class="text-xl font-bold text-blue-600">₹${productPrice}</span>
                                <button onclick="event.stopPropagation(); addToCart(${product.id})" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full text-sm font-semibold transition">
                                    <i class="fas fa-plus mr-1"></i> Add
                                </button>
                            </div>
                        </div>
                    </div>
                `;
        }).join('');
    }
}

// Clear filters
function clearFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('categoryFilter').value = '';
    document.getElementById('companyFilter').value = '';
    filterProducts();
}

// Update categories dropdown
function updateCategories() {
    allCategories = new Set(products.map(p => p.category));
    const select = document.getElementById('categoryFilter');
    if (select) {
        select.innerHTML = '<option value="">All Categories</option>' +
            Array.from(allCategories).map(cat => `<option value="${cat}">${cat}</option>`).join('');
    }
}

// Update companies dropdown
function updateCompanies() {
    const allCompanies = new Set(products.map(p => p.company).filter(c => c));
    const select = document.getElementById('companyFilter');
    if (select) {
        select.innerHTML = '<option value="">All Companies</option>' +
            Array.from(allCompanies).map(company => `<option value="${company}">${company}</option>`).join('');
    }
}

// Cart Functions
function loadCart() {
    const stored = localStorage.getItem('enquiryCart');
    if (stored) {
        cart = JSON.parse(stored);
    }
}

function saveCart() {
    localStorage.setItem('enquiryCart', JSON.stringify(cart));
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({...product, quantity: 1 });
    }

    saveCart();
    updateCartUI();
    showToast('✓', `${product.name} added to cart!`, 'success');
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartUI();
}

function updateQuantity(productId, quantity) {
    const item = cart.find(item => item.id === productId);
    if (item && quantity > 0) {
        item.quantity = parseInt(quantity);
        saveCart();
        updateCartUI();
    }
}

function clearCart() {
    if (confirm('Are you sure you want to clear the cart?')) {
        cart = [];
        saveCart();
        updateCartUI();
        showToast('🗑️', 'Cart cleared successfully', 'info');
    }
}

function updateCartUI() {
    const badge = document.getElementById('cartBadge');
    const cartItems = document.getElementById('cartItems');
    const emptyCart = document.getElementById('emptyCart');
    const cartFooter = document.getElementById('cartFooter');

    // If the page doesn't have cart UI elements, skip updating
    if (!badge || !cartItems || !emptyCart || !cartFooter) {
        return;
    }

    if (cart.length === 0) {
        badge.classList.add('hidden');
        cartItems.innerHTML = '';
        emptyCart.classList.remove('hidden');
        cartFooter.classList.add('hidden');
    } else {
        badge.classList.remove('hidden');
        badge.textContent = cart.length;
        emptyCart.classList.add('hidden');
        cartFooter.classList.remove('hidden');

        cartItems.innerHTML = cart.map(item => `
                    <div class="bg-white border border-gray-200 rounded-lg p-4 mb-3">
                        <div class="flex justify-between items-start mb-2">
                            <h4 class="font-semibold text-gray-800 flex-1">${item.name}</h4>
                            <button onclick="removeFromCart(${item.id})" class="text-red-500 hover:text-red-700 ml-2">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                        <p class="text-sm text-gray-600 mb-2">${item.category}</p>
                        <div class="flex justify-between items-center">
                            <span class="font-semibold text-blue-600">${item.price}</span>
                            <div class="flex items-center space-x-2">
                                <button onclick="updateQuantity(${item.id}, ${item.quantity - 1})" class="bg-gray-200 hover:bg-gray-300 w-8 h-8 rounded-full">-</button>
                                <input 
                                    type="number" 
                                    value="${item.quantity}" 
                                    min="1" 
                                    class="quantity-input border border-gray-300 rounded px-2 py-1"
                                    onchange="updateQuantity(${item.id}, this.value)"
                                >
                                <button onclick="updateQuantity(${item.id}, ${item.quantity + 1})" class="bg-gray-200 hover:bg-gray-300 w-8 h-8 rounded-full">+</button>
                            </div>
                        </div>
                    </div>
                `).join('');
    }
}

function openCart() {
    const modal = document.getElementById('cartModal');
    if (!modal) {
        // Gracefully handle pages without a cart modal
        showToast('🛒', 'Cart is available on the Products page.', 'info');
        return;
    }
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeCart() {
    const modal = document.getElementById('cartModal');
    if (!modal) return;
    modal.classList.add('hidden');
    document.body.style.overflow = 'auto';
}

// WhatsApp Functions
function sendWhatsAppEnquiry() {
    if (cart.length === 0) {
        showToast('⚠️', 'Cart is empty!', 'warning');
        return;
    }

    let message = '🏥 *Medicine Enquiry from Trusted Wholesale*\n\n';
    message += '📋 *Products:*\n';
    cart.forEach((item, index) => {
        message += `${index + 1}. ${item.name}\n`;
        message += `   Category: ${item.category}\n`;
        // message += `   Price: ${item.price}\n`;
        message += `   Quantity: ${item.quantity}\n\n`;
    });
    message += '\n✅I confirm my order for the above items.\n';
    message += 'Thank you!';

    const encoded = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/919876543210?text=${encoded}`;
    window.open(whatsappUrl, '_blank');
}

function sendWhatsAppMessage() {
    const message = '👋 Hi! I would like to know more about your wholesale medicines.';
    const encoded = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/919876543210?text=${encoded}`;
    window.open(whatsappUrl, '_blank');
}

// Admin Panel Functions
function showAdminPanel() {
    document.getElementById('adminModal').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    // Initialize auth UI whenever opening the modal
    updateAdminAuthUI();
}

function closeAdminPanel() {
    document.getElementById('adminModal').classList.add('hidden');
    document.body.style.overflow = 'auto';
}

// Admin Password Management
const ADMIN_PASSWORD_KEY = 'adminPasswordHash';
const ADMIN_UNLOCKED_KEY = 'adminUnlocked';

async function hashText(text) {
    const enc = new TextEncoder();
    const data = enc.encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

function isPasswordSet() {
    return !!localStorage.getItem(ADMIN_PASSWORD_KEY);
}

function isAdminUnlocked() {
    return sessionStorage.getItem(ADMIN_UNLOCKED_KEY) === 'true';
}

function updateAdminAuthUI() {
    const authSection = document.getElementById('adminAuthSection');
    const setBlock = document.getElementById('adminAuthSet');
    const unlockBlock = document.getElementById('adminAuthUnlock');
    const changeBlock = document.getElementById('adminChangePassword');
    const adminContent = document.getElementById('adminContent');

    if (!authSection || !setBlock || !unlockBlock || !changeBlock || !adminContent) return;

    // Clear inputs
    const inputs = [
        'newAdminPassword','confirmAdminPassword','adminPasswordInput',
        'currentAdminPassword','newAdminPassword2','confirmAdminPassword2'
    ];
    inputs.forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });

    if (!isPasswordSet()) {
        authSection.classList.remove('hidden');
        setBlock.classList.remove('hidden');
        unlockBlock.classList.add('hidden');
        changeBlock.classList.add('hidden');
        adminContent.classList.add('hidden');
        return;
    }

    if (!isAdminUnlocked()) {
        authSection.classList.remove('hidden');
        setBlock.classList.add('hidden');
        unlockBlock.classList.remove('hidden');
        changeBlock.classList.add('hidden');
        adminContent.classList.add('hidden');
        return;
    }

    // Unlocked
    authSection.classList.add('hidden');
    changeBlock.classList.remove('hidden');
    adminContent.classList.remove('hidden');
}

async function setAdminPassword() {
    const pwd = document.getElementById('newAdminPassword')?.value || '';
    const confirm = document.getElementById('confirmAdminPassword')?.value || '';
    if (!pwd || pwd.length < 4) { showToast('⚠️', 'Password must be at least 4 characters', 'warning'); return; }
    if (pwd !== confirm) { showToast('❌', 'Passwords do not match', 'error'); return; }
    const hash = await hashText(pwd);
    localStorage.setItem(ADMIN_PASSWORD_KEY, hash);
    sessionStorage.setItem(ADMIN_UNLOCKED_KEY, 'true');
    showToast('✓', 'Admin password set', 'success');
    updateAdminAuthUI();
}

async function unlockAdminPanel() {
    const input = document.getElementById('adminPasswordInput')?.value || '';
    if (!input) { showToast('⚠️', 'Enter password', 'warning'); return; }
    const stored = localStorage.getItem(ADMIN_PASSWORD_KEY);
    const hash = await hashText(input);
    if (stored && stored === hash) {
        sessionStorage.setItem(ADMIN_UNLOCKED_KEY, 'true');
        showToast('✓', 'Admin unlocked', 'success');
        updateAdminAuthUI();
    } else {
        showToast('❌', 'Incorrect password', 'error');
    }
}

function lockAdminPanel() {
    sessionStorage.removeItem(ADMIN_UNLOCKED_KEY);
    showToast('🔒', 'Admin locked', 'info');
    updateAdminAuthUI();
}

async function changeAdminPassword() {
    const current = document.getElementById('currentAdminPassword')?.value || '';
    const next = document.getElementById('newAdminPassword2')?.value || '';
    const confirm = document.getElementById('confirmAdminPassword2')?.value || '';
    if (!next || next.length < 4) { showToast('⚠️', 'New password must be at least 4 characters', 'warning'); return; }
    if (next !== confirm) { showToast('❌', 'Passwords do not match', 'error'); return; }
    const stored = localStorage.getItem(ADMIN_PASSWORD_KEY);
    const currentHash = await hashText(current);
    if (stored && stored === currentHash) {
        const newHash = await hashText(next);
        localStorage.setItem(ADMIN_PASSWORD_KEY, newHash);
        showToast('✓', 'Password updated', 'success');
        updateAdminAuthUI();
    } else {
        showToast('❌', 'Current password is incorrect', 'error');
    }
}

function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
        showToast('❌', 'Please upload a CSV file', 'error');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        parseCSV(e.target.result);
    };
    reader.readAsText(file);
}

function parseCSV(csvText) {
    const lines = csvText.split('\n').filter(line => line.trim());
    if (lines.length < 2) {
        showToast('❌', 'CSV file is empty or invalid', 'error');
        return;
    }

    // Parse CSV considering quoted fields
    function parseCSVLine(line) {
        const result = [];
        let current = '';
        let inQuotes = false;
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                result.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }
        result.push(current.trim());
        return result;
    }

    const headers = parseCSVLine(lines[0]).map(h => h.trim().toLowerCase().replace(/"/g, ''));
    const newProducts = [];

    for (let i = 1; i < lines.length; i++) {
        const values = parseCSVLine(lines[i]).map(v => v.trim().replace(/^"|"$/g, ''));
        if (values.length < 3) continue;

        const getValue = (key) => {
            const idx = headers.indexOf(key.toLowerCase());
            return idx >= 0 && values[idx] ? values[idx] : '';
        };

        const product = {
            id: Date.now() + i,
            company: getValue('company') || '',
            name: getValue('product name') || getValue('name') || 'Unnamed Product',
            composition: getValue('composition') || '',
            category: getValue('category') || 'General',
            price: getValue('price (₹)') || getValue('price') || '0',
            packingType: getValue('packing type') || 'Strip',
            unitsPerPack: getValue('units/pack') || '',
            gstRate: getValue('gst rate') || '',
            stock: getValue('stock') || 'In Stock',
            description: getValue('description') || `${getValue('composition') || 'Quality medicine'}`
        };

        newProducts.push(product);
    }

    if (newProducts.length > 0) {
        products = newProducts;
        window.products = products;
        saveProducts();
        renderProducts();
        updateCategories();
        updateCompanies();
        showToast('✓', `Successfully imported ${newProducts.length} products!`, 'success');
        closeAdminPanel();

        // Reload page if on products page to refresh display
        if (window.location.pathname.includes('products.html')) {
            setTimeout(() => window.location.reload(), 500);
        }
    } else {
        showToast('❌', 'No valid products found in CSV', 'error');
    }
}

async function importFromSheets() {
    const urlInput = document.getElementById('sheetsUrl');
    if (!urlInput) {
        showToast('❌', 'URL input not found', 'error');
        return;
    }

    const url = urlInput.value.trim();
    if (!url) {
        showToast('❌', 'Please enter a Google Sheets URL', 'error');
        return;
    }

    // Extract sheet ID and gid from URL
    let sheetId = '';
    let gid = '0';

    if (url.includes('/spreadsheets/d/')) {
        const match = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
        if (match && match[1]) {
            sheetId = match[1];
        }
        const gidMatch = url.match(/[#&]gid=(\d+)/);
        if (gidMatch && gidMatch[1]) {
            gid = gidMatch[1];
        }
    } else {
        showToast('❌', 'Invalid Google Sheets URL format. Please use the full URL from your browser.', 'error');
        return;
    }

    if (!sheetId) {
        showToast('❌', 'Could not extract sheet ID from URL', 'error');
        return;
    }

    // Try multiple URL formats (Google Sheets has CORS restrictions, so we try different endpoints)
    const csvUrls = [
        // Method 1: Using gviz endpoint (works if sheet is published to web)
        `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&gid=${gid}`,
        // Method 2: Standard export endpoint
        `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`,
        // Method 3: Export without gid (uses first sheet)
        `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`,
        // Method 4: gviz without gid
        `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv`
    ];

    showToast('⏳', 'Importing from Google Sheets...', 'info');

    let lastError = null;

    // Try each URL format
    for (let i = 0; i < csvUrls.length; i++) {
        try {
            const response = await fetch(csvUrls[i], {
                method: 'GET',
                mode: 'cors',
                headers: {
                    'Accept': 'text/csv'
                }
            });

            if (response.ok) {
                const csvText = await response.text();

                // Check if response is valid CSV (not an error page)
                if (csvText && csvText.trim().length > 0 && !csvText.includes('<!DOCTYPE html>') && !csvText.includes('Error')) {
                    parseCSV(csvText);
                    return; // Success!
                }
            } else if (response.status === 403) {
                lastError = new Error('Access denied. Please ensure the sheet is shared publicly.');
                continue; // Try next URL
            }
        } catch (error) {
            lastError = error;
            // Continue to next URL if this one fails
            continue;
        }
    }

    // If all methods failed
    console.error('All import methods failed:', lastError);

    let errorMsg = 'Failed to import from Google Sheets. ';
    errorMsg += '\n\nTo fix this:\n';
    errorMsg += '1. Open your Google Sheet\n';
    errorMsg += '2. Click "File" > "Share" > "Change to anyone with the link"\n';
    errorMsg += '3. OR use "File" > "Publish to web" > Select CSV format > Publish\n';
    errorMsg += '4. Copy the published link or share link and try again\n\n';
    errorMsg += 'Alternatively, download the sheet as CSV and upload it directly.';
    
    showToast('❌', errorMsg, 'error');
    
    // Show a more detailed error in console for debugging
    console.log('Sheet ID:', sheetId);
    console.log('GID:', gid);
    console.log('Tried URLs:', csvUrls);
}

function downloadCSV() {
    if (products.length === 0) {
        showToast('⚠️', 'No products to download', 'warning');
        return;
    }

    const headers = ['Company', 'Product Name', 'Composition', 'Description', 'Category', 'Price (₹)', 'Packing Type', 'Units/Pack', 'GST Rate', 'Stock'];
    const csvContent = [
        headers.join(','),
        ...products.map(p => [
            `"${p.company || ''}"`, // Enclose in quotes to handle commas in data
            `"${p.name || ''}"`,
            `"${p.composition || ''}"`,
            `"${p.description || ''}"`,
            `"${p.category || ''}"`,
            `"${p.price || ''}"`,
            `"${p.packingType || ''}"`,
            `"${p.unitsPerPack || ''}"`,
            `"${p.gstRate || ''}"`,
            `"${p.stock || ''}"`
        ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'products.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    showToast('✓', 'Products CSV downloaded', 'success');
}

function downloadSampleCSV() {
    const csv = 'Company,Product Name,Composition,Description,Category,Price (₹),Packing Type,Units/Pack,GST Rate,Stock\nCipla,Paracetamol 500mg,Paracetamol 500mg,"Effective pain and fever relief",Pain Relief,120,Strip,10,12%,In Stock\nSun Pharma,Amoxicillin 250mg,Amoxicillin 250mg,"Broad-spectrum antibiotic",Antibiotics,250,Strip,10,12%,In Stock\nZydus,Vitamin D3 60K,Cholecalciferol 60000 IU,"Bone health supplement",Vitamins,180,Strip,4,12%,In Stock';
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample_medicines.csv';
    a.click();
    window.URL.revokeObjectURL(url);
}

function clearAllProducts() {
    if (confirm('Are you sure you want to delete all products? This cannot be undone.')) {
        products = [];
        saveProducts();
        renderProducts();
        updateCategories();
        updateCompanies();
        showToast('✓', 'All products cleared', 'success');
    }
}

function updateProductCount() {
    const count = document.getElementById('productCount');
    if (count) count.textContent = products.length;
}

// Drag and Drop
function setupDragAndDrop() {
    const dropZone = document.getElementById('dropZone');
    if (!dropZone) return; // Safeguard for pages without a drop zone

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => dropZone.classList.add('drag-over'), false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => dropZone.classList.remove('drag-over'), false);
    });

    dropZone.addEventListener('drop', handleDrop, false);

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        if (files.length > 0) {
            const file = files[0];
            if (file.name.endsWith('.csv')) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    parseCSV(e.target.result);
                };
                reader.readAsText(file);
            } else {
                showToast('❌', 'Please drop a CSV file', 'error');
            }
        }
    }
}

// Mobile Menu Toggle
function toggleMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    menu.classList.toggle('hidden');
}

// Toast Notification
function showToast(icon, message, type) {
    const toast = document.getElementById('toast');
    const toastIcon = document.getElementById('toastIcon');
    const toastMessage = document.getElementById('toastMessage');

    toastIcon.textContent = icon;
    toastMessage.textContent = message;

    toast.classList.remove('hidden');
    setTimeout(() => {
        toast.classList.add('hidden');
    }, 3000);
}

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            // Close mobile menu if open
            document.getElementById('mobileMenu').classList.add('hidden');
        }
    });
});