/* @ds-bundle: {"format":4,"namespace":"GlossBeau","components":[{"name":"Wordmark"},{"name":"AnnouncementBar"},{"name":"Header"},{"name":"Button"},{"name":"Badge"},{"name":"SearchField"},{"name":"CategoryChip"},{"name":"ProductCard"},{"name":"SectionHeader"},{"name":"CategoryTile"},{"name":"BrandCard"},{"name":"HeroStage"},{"name":"EmailCapture"}]} */
(function () {
  var React = window.React;
  var h = React.createElement;

  function cx() { var o = []; for (var i = 0; i < arguments.length; i++) if (arguments[i]) o.push(arguments[i]); return o.join(' '); }
  function omit(p, keys) { var o = {}; for (var k in p) if (Object.prototype.hasOwnProperty.call(p, k) && keys.indexOf(k) < 0) o[k] = p[k]; return o; }
  function money(v) { return typeof v === 'number' ? '$' + v.toFixed(2) : v; }

  var PATHS = {
    search: 'M10.5 4a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13zM20 20l-4.8-4.8',
    user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4.5 20c1.4-3.3 4.2-5 7.5-5s6.1 1.7 7.5 5',
    bag: 'M5 8h14l-1 12H6L5 8zM9 8V6.5a3 3 0 0 1 6 0V8',
    arrow: 'M5 12h14M13 6l6 6-6 6',
    arrowUpRight: 'M7 17L17 7M8 7h9v9',
    caret: 'M6 9l6 6 6-6',
    plus: 'M12 5v14M5 12h14',
    star: 'M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z',
    menu: 'M4 7h16M4 12h16M4 17h16'
  };
  function Icon(p) {
    var s = p.size || 20;
    return h('svg', { className: cx('gb-icon', p.className), width: s, height: s, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': 'true', focusable: 'false', style: p.style }, h('path', { d: PATHS[p.name] || '' }));
  }
  function PhotoSlot(p) { return h('div', { className: 'gb-photo-slot' }, p.label || 'Product photo from Shopify'); }

  function Wordmark(p) {
    return h('span', { className: cx('gb-wordmark', p.className), style: { fontSize: p.size || 22 } }, 'glossbeau', h('i', { 'aria-hidden': 'true' }));
  }
  function AnnouncementBar(p) {
    return h('a', { className: cx('gb-announce', p.className), href: p.href || '#' }, h('span', null, p.children), p.sub ? h('small', null, p.sub) : null, h(Icon, { name: 'arrow', size: 16 }));
  }
  function Header(p) {
    var links = p.links || [];
    return h('header', { className: cx('gb-header', p.className) },
      h('a', { href: p.homeHref || '/', 'aria-label': 'GlossBeau home', style: { textDecoration: 'none' } }, h(Wordmark, { size: 22 })),
      h('nav', { className: 'gb-nav', 'aria-label': 'Main' }, links.map(function (l, i) { return h('a', { key: i, href: l.href || '#', 'aria-current': l.current ? 'page' : undefined }, l.label); })),
      h('div', { className: 'gb-utils' },
        h('button', { type: 'button', className: 'gb-iconbtn', 'aria-label': 'Search' }, h(Icon, { name: 'search', size: 24 })),
        h('button', { type: 'button', className: 'gb-iconbtn', 'aria-label': 'Account' }, h(Icon, { name: 'user', size: 24 })),
        h('button', { type: 'button', className: 'gb-iconbtn', 'aria-label': 'Cart, ' + (p.cartCount || 0) + ' items' }, h(Icon, { name: 'bag', size: 24 }))));
  }
  function Button(p) {
    var cls = cx('gb-btn', 'gb-btn-' + (p.variant || 'primary'), p.size === 'sm' && 'gb-btn-sm', p.className);
    var rest = omit(p, ['variant', 'size', 'className', 'children', 'iconAfter', 'href']);
    var icon = p.iconAfter ? h(Icon, { name: p.iconAfter, size: 16 }) : null;
    if (p.href) return h('a', Object.assign({}, rest, { className: cls, href: p.href }), p.children, icon);
    return h('button', Object.assign({ type: 'button' }, rest, { className: cls }), p.children, icon);
  }
  function Badge(p) { return h('span', { className: cx('gb-badge', p.tone && p.tone !== 'new' && 'gb-badge-' + p.tone, p.className) }, p.children); }
  function SearchField(p) {
    var id = p.id || 'gb-q';
    return h('form', { className: cx('gb-search', p.className), role: 'search', onSubmit: function (e) { e.preventDefault(); if (p.onSubmit) p.onSubmit(e.currentTarget.elements.q.value); } },
      h('label', { className: 'gb-sr', htmlFor: id }, p.label || 'Search products'),
      h('input', { id: id, name: 'q', type: 'search', autoComplete: 'off', placeholder: p.placeholder || 'What are you looking for today?' }),
      h('button', { type: 'submit', className: 'gb-roundbtn', 'aria-label': 'Search' }, h(Icon, { name: 'arrow', size: 20 })));
  }
  function CategoryChip(p) {
    return h('button', { type: 'button', className: cx('gb-chip', p.className), 'aria-pressed': p.active ? 'true' : 'false', onClick: p.onClick },
      p.color ? h('i', { 'aria-hidden': 'true', style: { background: p.color } }) : null, p.children);
  }
  function ProductCard(p) {
    var sold = !!p.soldOut; var onSale = p.compareAtPrice != null && !sold;
    var badge = sold ? h(Badge, { tone: 'soldout' }, 'Sold out') : onSale ? h(Badge, { tone: 'sale' }, 'Sale') : p.featured ? h(Badge, null, 'Best seller') : null;
    return h('a', { className: cx('gb-card', p.className), href: p.href || '#' },
      h('div', { className: 'gb-frame' }, p.image ? h('img', { src: p.image, alt: p.imageAlt || p.title, loading: 'lazy', style: sold ? { opacity: .45 } : null }) : h(PhotoSlot, null), badge,
        h('span', { className: 'gb-roundbtn gb-add', 'aria-hidden': 'true' }, h(Icon, { name: 'plus', size: 18 }))),
      h('div', { className: 'gb-card-body' },
        p.vendor ? h('p', { className: 'gb-vendor' }, p.vendor) : null,
        h('h3', { className: 'gb-title' }, p.title),
        h('p', { className: 'gb-price' }, h('span', null, money(p.price)), onSale ? h('s', null, money(p.compareAtPrice)) : null)));
  }
  function SectionHeader(p) {
    var title = h('h2', null, p.title, p.href ? h(Icon, { name: 'caret', size: 16, style: { transform: 'rotate(-90deg)' } }) : null);
    return h('div', { className: cx('gb-sechead', p.className) }, p.eyebrow ? h('p', { className: 'gb-eyebrow' }, p.eyebrow) : null, p.href ? h('a', { href: p.href }, title) : title);
  }
  function CategoryTile(p) {
    return h('a', { className: cx('gb-tile', p.className), href: p.href || '#' },
      p.image ? h('img', { src: p.image, alt: '' }) : h(PhotoSlot, { label: 'Category photo from Shopify' }),
      h('span', { className: 'gb-tile-label' }, h('b', null, p.name), p.count != null ? h('span', null, p.count + ' products') : null));
  }
  function BrandCard(p) {
    return h('a', { className: cx('gb-brand', p.className), href: p.href || '#', 'aria-label': p.name }, p.logo ? h('img', { src: p.logo, alt: p.name }) : h('b', null, p.name));
  }
  function HeroStage(p) {
    var slides = p.slides || []; var st = React.useState(0), i = st[0], set = st[1]; var n = slides.length; var cur = slides[i] || {};
    return h('div', { className: cx('gb-hero', p.className), 'aria-roledescription': 'carousel', 'aria-label': 'Featured products' },
      h('div', { className: 'gb-frame' }, cur.image ? h('img', { src: cur.image, alt: cur.title || '' }) : h(PhotoSlot, { label: 'Hero clip poster from Shopify' })),
      n > 1 ? h('button', { type: 'button', className: 'gb-hero-arrow prev', 'aria-label': 'Previous product', onClick: function () { set((i - 1 + n) % n); } }, h(Icon, { name: 'caret', size: 18, style: { transform: 'rotate(90deg)' } })) : null,
      n > 1 ? h('button', { type: 'button', className: 'gb-hero-arrow next', 'aria-label': 'Next product', onClick: function () { set((i + 1) % n); } }, h(Icon, { name: 'caret', size: 18, style: { transform: 'rotate(-90deg)' } })) : null,
      h('a', { className: 'gb-roundbtn', href: cur.href || '#', 'aria-label': 'View ' + (cur.title || 'product') }, h(Icon, { name: 'arrowUpRight', size: 20 })),
      n > 1 ? h('div', { className: 'gb-dots', role: 'tablist' }, slides.map(function (s, k) { return h('button', { key: k, type: 'button', role: 'tab', 'aria-selected': k === i, 'aria-label': 'Slide ' + (k + 1), onClick: function () { set(k); } }); })) : null);
  }
  function EmailCapture(p) {
    var st = React.useState(false), done = st[0], setDone = st[1]; var id = p.id || 'gb-email';
    return h('section', { className: cx('gb-capture', p.className) },
      h('div', null, h('p', { className: 'gb-eyebrow' }, p.eyebrow || 'The GlossBeau list'), h('h2', null, p.title || 'New arrivals and stylist tips, about twice a month.')),
      done ? h('p', { role: 'status' }, p.thanks || 'You are on the list. Check your inbox to confirm.')
        : h('form', { onSubmit: function (e) { e.preventDefault(); if (p.onSubmit) p.onSubmit(e.currentTarget.elements.email.value); setDone(true); } },
            h('label', { className: 'gb-sr', htmlFor: id }, 'Email address'),
            h('input', { id: id, name: 'email', type: 'email', required: true, autoComplete: 'email', placeholder: 'Your email address' }),
            h('button', { type: 'submit', className: 'gb-roundbtn', 'aria-label': 'Sign up' }, h(Icon, { name: 'arrow', size: 20 }))));
  }

  window.GlossBeau = Object.assign(window.GlossBeau || {}, {
    Wordmark: Wordmark, AnnouncementBar: AnnouncementBar, Header: Header, Button: Button, Badge: Badge, SearchField: SearchField,
    CategoryChip: CategoryChip, ProductCard: ProductCard, SectionHeader: SectionHeader, CategoryTile: CategoryTile, BrandCard: BrandCard,
    HeroStage: HeroStage, EmailCapture: EmailCapture, Icon: Icon
  });
})();
