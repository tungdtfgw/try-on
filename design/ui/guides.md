# UI Design Guidelines - Fashion E-commerce

## 1. Tổng quan thiết kế

Thiết kế này dựa trên phân tích từ Figma Shopping Website Community template, được tối ưu hóa cho website bán hàng thời trang với phong cách trẻ trung, năng động.

### 1.1 Mục tiêu thiết kế
- Tạo trải nghiệm mua sắm trực quan, dễ sử dụng
- Tập trung vào hình ảnh sản phẩm chất lượng cao
- Khuyến khích tương tác và chuyển đổi
- Responsive trên mọi thiết bị

### 1.2 Đối tượng người dùng
- Độ tuổi: 18-35
- Quan tâm đến thời trang, xu hướng
- Thích mua sắm online
- Sử dụng thành thạo công nghệ

## 2. Color Palette

### 2.1 Primary Colors
```
Brand Yellow: #EBD96B (RGB: 235, 217, 107)
- Sử dụng cho: CTA buttons, highlights, promotional banners
- Tạo cảm giác năng động, trẻ trung, thu hút sự chú ý

Black: #000000
- Sử dụng cho: Text chính, buttons, footer
- Tạo sự tương phản mạnh, chuyên nghiệp

White: #FFFFFF
- Sử dụng cho: Background chính, cards, text on dark
- Tạo không gian thoáng đãng, sạch sẽ
```

### 2.2 Secondary Colors
```
Light Gray: #F4F6F5
- Background sections, subtle containers

Medium Gray: #7F7F7F, #8E8E8E
- Secondary text, descriptions

Dark Gray: #191818, #242323
- Body text, headings
```

### 2.3 Accent Colors
```
Yellow Gradient: Linear gradient from #E0C340 to #FAE157
- Promotional banners, special sections

Light Yellow: #E5C643
- Newsletter section, call-to-action areas
```

## 3. Typography

### 3.1 Font Family
```
Primary Font: Poppins
- Headings: Poppins Black (900)
- Subheadings: Poppins SemiBold (600)
- Body: Poppins Medium (500)
- Small text: Poppins Regular (400)

Secondary Font: Roboto (cho footer, legal text)
- Regular (400) cho nội dung phụ
```

### 3.2 Font Sizes & Hierarchy
```
Hero Heading: 45.6px (Black)
- Line height: 57px
- Use case: Main hero title, landing page

Section Heading: 22.8px - 30px (Black)
- Line height: 23.75px - 37px
- Use case: Section titles (New Arrivals, Favourites)

Product Title: 15.2px (Medium)
- Line height: 17.1px
- Use case: Product names, category titles

Body Text: 10.45px - 11.4px (Medium)
- Line height: normal
- Use case: Navigation, descriptions

Small Text: 6.5px - 9px (Regular)
- Line height: 9.47px - 14.156px
- Use case: Footer, legal text, product prices
```

### 3.3 Text Styles
```
Letter Spacing:
- Headings: 0.57px - 1.368px (wider for impact)
- Body: -0.76px to 0.3247px (tighter for readability)
- Small text: 0.13px - 0.26px

Text Transform:
- Navigation: UPPERCASE
- CTA Buttons: UPPERCASE
- Headings: Sentence case or UPPERCASE
- Body: Normal case
```

## 4. Layout & Spacing

### 4.1 Grid System
```
Desktop (>912px):
- Container max-width: 912px - 1600px
- Columns: 12 columns
- Gutter: 30px - 48px
- Margin: 48px

Mobile (<520px):
- Container: Full width
- Padding: 28px
- Gutter: 13px - 17px
```

### 4.2 Spacing Scale
```
xs: 3.3px - 5px
sm: 7.6px - 11px
md: 13.3px - 17.6px
lg: 23.5px - 30px
xl: 48px - 58px
2xl: 64px - 100px
```

### 4.3 Component Spacing
```
Section Padding: 48px vertical
Card Gap: 48px horizontal
Content Gap: 13.3px - 17.6px
Button Padding: 15px horizontal, 9px vertical
```

## 5. Components

### 5.1 Navigation Bar
```
Height: 30px - 53px
Background: White
Shadow: Optional subtle shadow
Position: Fixed top (recommended)

Elements:
- Logo (left): Icon + "FASHION" text
- Menu (center): CATALOGUE, FASHION, FAVOURITE, LIFESTYLE
- CTA (right): SIGN UP button (black bg, white text)

Mobile:
- Hamburger menu
- Logo centered
- CTA button prominent
```

### 5.2 Hero Section
```
Height: 405px - 600px
Background: Light gray (#F4F6F5)
Border radius: 25px

Layout:
- Left: Heading + description + CTA (40% width)
- Right: Hero image (60% width)

Decorative elements:
- Yellow highlight bars behind text
- Star decorations around image
- Gradient overlays

CTA Button:
- Background: Black
- Text: White, uppercase
- Border radius: 4.75px
- Padding: 9.1px 15px
```

### 5.3 Product Cards
```
Dimensions: 230px x 384px (desktop)
Border radius: 10px
Shadow: None (clean look)

Structure:
- Image: 230px x 334px (top)
- Content: 36px height (bottom)
  - Title: Medium weight
  - CTA: "Explore Now!" + Arrow
  - Price (if applicable)

Hover state:
- Slight scale (1.02)
- Shadow: 0px 4px 12px rgba(0,0,0,0.1)
- Arrow moves right 2px
```

### 5.4 Buttons

#### Primary Button (CTA)
```
Background: Black
Text: White, uppercase
Border radius: 4.75px
Padding: 9.1px 15.12px
Font: Poppins Medium, 14.25px
Letter spacing: -0.7125px

Hover:
- Background: #333
- Slight scale: 1.02
```

#### Secondary Button (Promotional)
```
Background: Brand Yellow (#EBD96B)
Text: Black, uppercase
Border radius: 2.2px - 3px
Padding: 7.55px 13.84px
Font: Poppins SemiBold, 7.55px

Hover:
- Background: Darken 10%
- Slight scale: 1.02
```

### 5.5 Input Fields
```
Height: 23.54px - 30px
Border radius: 4px
Background: White
Border: 1px solid #D9DDE9 (or transparent)
Padding: 6.5px 7.3px

Placeholder:
- Color: #767676
- Font: Poppins Regular, 6.5px

Focus state:
- Border: 2px solid Black
- Outline: None
```

### 5.6 Cards & Containers
```
Border radius: 10px - 25px
Background: White or Light Gray
Shadow: 0px 4px 50px rgba(0,0,0,0.25) (for elevated cards)
Padding: 13.3px - 30px

Image overlay:
- Dark overlay: rgba(0,0,0,0.07) - rgba(0,0,0,0.16)
- Used for product images to enhance text readability
```

## 6. Sections & Modules

### 6.1 Hero/Banner Section
```
Purpose: Grab attention, showcase main promotion
Height: 405px - 600px
Layout: Split 40/60 (text/image)

Key elements:
- Large heading (45.6px)
- Yellow highlight bars
- Hero image (fashion model)
- CTA button
- Decorative stars
```

### 6.2 Promotional Banner (Payday Sale)
```
Height: 261px
Layout: Split 50/50 (image/content)
Background: Yellow gradient

Left side:
- Product image
- Decorative stars

Right side:
- Large heading with white background highlight
- Description text
- Date range
- Terms & conditions
- CTA button (black)
```

### 6.3 Product Grid (New Arrivals)
```
Section title: "NEW ARRIVALS" (22.8px, Black)
Decorative underline: Yellow curved line

Grid:
- Desktop: 3 columns
- Tablet: 2 columns
- Mobile: 1 column
- Gap: 48px

Each card:
- Product image (rounded corners)
- Category name
- "Explore Now!" CTA + arrow
```

### 6.4 Featured Collections (Young's Favourite)
```
Section title: "Young's Favourite" (13px)
Decorative underline: Yellow curved line

Layout: 2 columns (desktop), 1 column (mobile)
Cards:
- Large product image
- Overlay text
- "Buy Now!" CTA + arrow
```

### 6.5 Brand Showcase
```
Height: 82px
Background: Brand Yellow (#EBD96B)
Layout: Horizontal scroll of brand logos

Logos:
- Mix blend mode: Multiply/Darken
- Grayscale or monochrome
- Even spacing (57px gap)
```

### 6.6 App Download Section
```
Height: 200px
Layout: Split 40/60 (content/mockup)

Left side:
- Heading: "DOWNLOAD APP & GET THE VOUCHER!"
- Description
- App store buttons (iOS + Android)

Right side:
- Mobile app mockup
- Floating phone illustration
```

### 6.7 Newsletter Signup
```
Height: 168px
Background: Yellow (#E5C643)
Layout: Centered content

Elements:
- Heading: "JOIN SHOPPING COMMUNITY..."
- Description text
- Email input + Send button (inline)
```

### 6.8 Footer
```
Height: 147px
Background: Black
Text color: White/Gray

Layout: 4 columns
- Brand info + social icons (left)
- Company links
- Quick links
- Legal links

Social icons:
- Size: 14px
- Background: Transparent (except LinkedIn - yellow)
- Border: 1px solid gray
```

## 7. Imagery Guidelines

### 7.1 Product Images
```
Aspect ratio: 1:1 or 3:4
Resolution: Minimum 800x800px
Format: WebP (with JPG fallback)
Optimization: Compress to <100KB

Style:
- Clean background (white or subtle)
- Good lighting
- Multiple angles available
- Zoom functionality
```

### 7.2 Hero/Banner Images
```
Aspect ratio: 16:9 or custom
Resolution: Minimum 1920x1080px
Format: WebP (with JPG fallback)

Style:
- Fashion models in action
- Vibrant colors
- Professional photography
- Lifestyle context
```

### 7.3 Image Treatments
```
Overlay: rgba(0,0,0,0.07) - rgba(0,0,0,0.16)
Border radius: 10px (standard), 25px (hero)
Object fit: Cover (maintain aspect ratio)
Loading: Lazy load below fold
Placeholder: Blur-up technique
```

## 8. Icons & Graphics

### 8.1 Icon Style
```
Style: Outline/Line icons
Stroke width: 1.5px - 2px
Size: 16px - 24px (standard)
Color: Inherit from parent or Black

Common icons needed:
- Search
- Shopping cart (with badge)
- User account
- Heart (wishlist)
- Menu (hamburger)
- Arrow (navigation)
- Social media icons
```

### 8.2 Decorative Elements
```
Stars:
- Size: 27.66px
- Rotation: 333deg
- Color: Yellow or outline
- Use: Accent elements around images

Curved underlines:
- Stroke width: 8.65px - 16.59px
- Color: Yellow
- Use: Under section headings

Gradient bars:
- Yellow gradient
- Rotation: ~358deg
- Use: Highlight text in hero
```

## 9. Animations & Interactions

### 9.1 Hover Effects
```
Buttons:
- Scale: 1.02
- Transition: 0.2s ease
- Background color change

Cards:
- Scale: 1.02
- Shadow: 0px 4px 12px rgba(0,0,0,0.1)
- Transition: 0.3s ease

Links:
- Underline slide-in
- Color change
- Transition: 0.2s ease
```

### 9.2 Page Transitions
```
Fade in: 0.3s ease
Slide up: 0.4s ease (for sections)
Stagger: 0.1s delay between items (for grids)
```

### 9.3 Micro-interactions
```
Add to cart:
- Button pulse
- Cart icon shake
- Success notification

Wishlist:
- Heart fill animation
- Scale pulse

Image zoom:
- Smooth scale on hover
- Cursor change to zoom-in
```

## 10. Responsive Design

### 10.1 Breakpoints
```
Mobile: 320px - 519px
Tablet: 520px - 911px
Desktop: 912px - 1599px
Large Desktop: 1600px+
```

### 10.2 Mobile Adaptations
```
Navigation:
- Hamburger menu
- Full-screen overlay
- Bottom navigation bar (optional)

Hero:
- Stack vertically (text top, image bottom)
- Reduce heading size to 28px - 32px
- Full-width CTA button

Product Grid:
- 1 column layout
- Horizontal scroll for categories
- Larger touch targets (min 44px)

Footer:
- Stack columns vertically
- Accordion for link groups
- Simplified social icons
```

### 10.3 Touch Interactions
```
Minimum touch target: 44x44px
Swipe gestures:
- Product image gallery
- Category navigation
- Mobile menu

Pull to refresh: Optional for product lists
```

## 11. Accessibility

### 11.1 Color Contrast
```
Text on white: Minimum 4.5:1 (WCAG AA)
Text on yellow: Use dark text (#000000)
Text on black: Use white (#FFFFFF)

Test all combinations:
- Body text: 4.5:1 minimum
- Large text (18px+): 3:1 minimum
- UI components: 3:1 minimum
```

### 11.2 Typography
```
Minimum font size: 14px (body text)
Line height: 1.5 minimum (body text)
Paragraph width: 60-70 characters maximum
```

### 11.3 Interactive Elements
```
Focus indicators:
- Visible outline: 2px solid
- Color: Black or Brand Yellow
- Offset: 2px

Keyboard navigation:
- Logical tab order
- Skip to content link
- Escape to close modals

Screen readers:
- Alt text for all images
- ARIA labels for icons
- Semantic HTML structure
```

## 12. Performance

### 12.1 Image Optimization
```
Format: WebP with JPG fallback
Compression: 80-85% quality
Lazy loading: Below fold images
Responsive images: srcset for different sizes
CDN: Use for all static assets
```

### 12.2 Loading Strategy
```
Critical CSS: Inline above-the-fold styles
Defer non-critical JS
Preload hero images
Font display: swap
```

### 12.3 Metrics Targets
```
First Contentful Paint: <1.5s
Largest Contentful Paint: <2.5s
Time to Interactive: <3.5s
Cumulative Layout Shift: <0.1
```

## 13. Brand Elements

### 13.1 Logo
```
Primary logo: Icon + "FASHION" text
Icon: F-Secure style icon (16.5px)
Text: Poppins Black, 19px, uppercase
Color: Black (on light), White (on dark)

Minimum size: 80px width
Clear space: Equal to height of logo
```

### 13.2 Voice & Tone
```
Voice: Young, energetic, confident
Tone: Friendly, encouraging, trendy

Writing style:
- Short, punchy sentences
- Active voice
- Conversational but professional
- Emoji usage: Minimal, only when appropriate
```

### 13.3 Messaging
```
Headlines: Action-oriented, benefit-focused
CTAs: Clear, urgent, value-driven
Product descriptions: Concise, feature-focused
Error messages: Helpful, solution-oriented
```

## 14. E-commerce Specific Elements

### 14.1 Product Page
```
Layout: 50/50 split (images/details)

Left side:
- Main image (large)
- Thumbnail gallery
- Zoom functionality
- 360° view (optional)

Right side:
- Product name (15.2px, Medium)
- Price (prominent, 18px+)
- Size selector
- Color selector
- Quantity selector
- Add to cart button (primary)
- Add to wishlist button (secondary)
- Product details accordion
- Size guide link
- Shipping info
```

### 14.2 Shopping Cart
```
Layout: List view

Each item:
- Product image (80x80px)
- Name + variant
- Price
- Quantity selector
- Remove button
- Subtotal

Summary:
- Subtotal
- Shipping
- Tax
- Total (prominent)
- Promo code input
- Checkout button (primary)
```

### 14.3 Checkout Flow
```
Steps:
1. Shipping information
2. Payment method
3. Review & confirm

Progress indicator:
- Step numbers
- Active/completed states
- Clickable to go back

Form fields:
- Clear labels
- Inline validation
- Error states
- Auto-complete support
```

### 14.4 Product Filters
```
Desktop: Sidebar (left)
Mobile: Bottom sheet or full-screen overlay

Filter types:
- Category (checkboxes)
- Price range (slider)
- Size (buttons)
- Color (color swatches)
- Brand (checkboxes)
- Rating (stars)

Active filters:
- Display as chips
- Clear all option
- Individual remove
```

## 15. Implementation Notes

### 15.1 CSS Architecture
```
Methodology: BEM or Utility-first (Tailwind)
Structure:
- Base styles
- Components
- Utilities
- Responsive overrides

Variables:
- Colors (CSS custom properties)
- Spacing scale
- Typography scale
- Breakpoints
```

### 15.2 Component Library
```
Build reusable components:
- Button (primary, secondary, text)
- Card (product, content)
- Input (text, email, password)
- Select (dropdown)
- Modal
- Toast notification
- Breadcrumb
- Pagination
```

### 15.3 State Management
```
Loading states:
- Skeleton screens
- Spinners
- Progress bars

Empty states:
- Friendly illustrations
- Clear messaging
- CTA to take action

Error states:
- Clear error message
- Suggested action
- Retry option
```

## 16. Testing Checklist

### 16.1 Visual Testing
- [ ] All breakpoints render correctly
- [ ] Images load and display properly
- [ ] Typography is consistent
- [ ] Colors match design
- [ ] Spacing is accurate
- [ ] Hover states work
- [ ] Animations are smooth

### 16.2 Functional Testing
- [ ] Navigation works on all devices
- [ ] Forms validate correctly
- [ ] Buttons trigger correct actions
- [ ] Links go to correct pages
- [ ] Search functionality works
- [ ] Filters apply correctly
- [ ] Cart updates properly

### 16.3 Accessibility Testing
- [ ] Keyboard navigation works
- [ ] Screen reader compatible
- [ ] Color contrast passes WCAG AA
- [ ] Focus indicators visible
- [ ] Alt text present
- [ ] ARIA labels correct
- [ ] Semantic HTML used

### 16.4 Performance Testing
- [ ] Page load time <3s
- [ ] Images optimized
- [ ] No layout shift
- [ ] Smooth scrolling
- [ ] No janky animations
- [ ] Mobile performance good

## 17. Future Enhancements

### 17.1 Advanced Features
- Virtual try-on (AR)
- Product recommendations (AI)
- Live chat support
- Social shopping integration
- User-generated content gallery
- Loyalty program dashboard

### 17.2 Personalization
- Saved preferences
- Recently viewed items
- Personalized recommendations
- Custom collections
- Size profile

### 17.3 Social Features
- Share products
- Wishlist sharing
- Style inspiration boards
- User reviews with photos
- Influencer collaborations

---

## Appendix A: Component Specifications

### Navigation Component
```jsx
<Header>
  <Logo />
  <Nav>
    <NavItem>CATALOGUE</NavItem>
    <NavItem>FASHION</NavItem>
    <NavItem>FAVOURITE</NavItem>
    <NavItem>LIFESTYLE</NavItem>
  </Nav>
  <Actions>
    <SearchButton />
    <CartButton badge={count} />
    <UserButton />
    <SignUpButton />
  </Actions>
</Header>
```

### Product Card Component
```jsx
<ProductCard>
  <ProductImage src={image} alt={name} />
  <ProductContent>
    <ProductTitle>{name}</ProductTitle>
    <ProductPrice>{price}</ProductPrice>
    <ProductCTA>
      <span>Explore Now!</span>
      <Arrow />
    </ProductCTA>
  </ProductContent>
</ProductCard>
```

### Hero Section Component
```jsx
<Hero>
  <HeroContent>
    <HeroHeading>
      LET'S EXPLORE UNIQUE CLOTHES.
    </HeroHeading>
    <HeroDescription>
      Live for Influential and Innovative fashion!
    </HeroDescription>
    <HeroCTA>SHOP NOW</HeroCTA>
  </HeroContent>
  <HeroImage src={heroImage} />
  <DecorativeStars />
</Hero>
```

---

## Appendix B: Design Tokens

```css
:root {
  /* Colors */
  --color-primary: #EBD96B;
  --color-black: #000000;
  --color-white: #FFFFFF;
  --color-gray-light: #F4F6F5;
  --color-gray-medium: #7F7F7F;
  --color-gray-dark: #191818;
  
  /* Typography */
  --font-primary: 'Poppins', sans-serif;
  --font-secondary: 'Roboto', sans-serif;
  
  --font-size-hero: 45.6px;
  --font-size-h1: 30px;
  --font-size-h2: 22.8px;
  --font-size-h3: 15.2px;
  --font-size-body: 11.4px;
  --font-size-small: 8.658px;
  
  /* Spacing */
  --space-xs: 5px;
  --space-sm: 11px;
  --space-md: 17px;
  --space-lg: 30px;
  --space-xl: 48px;
  
  /* Border Radius */
  --radius-sm: 4px;
  --radius-md: 10px;
  --radius-lg: 25px;
  
  /* Shadows */
  --shadow-sm: 0px 4px 12px rgba(0,0,0,0.1);
  --shadow-md: 0px 4px 50px rgba(0,0,0,0.25);
  
  /* Transitions */
  --transition-fast: 0.2s ease;
  --transition-normal: 0.3s ease;
  --transition-slow: 0.4s ease;
}
```

---

**Note**: Hướng dẫn này được tạo dựa trên phân tích thiết kế Figma Shopping Website Community. Các giá trị cụ thể có thể được điều chỉnh theo nhu cầu thực tế của dự án.
