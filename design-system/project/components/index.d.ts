import * as React from 'react';

/** "glossbeau" in Inter 600 with the accent dot. Placeholder until the logo exists. */
export interface WordmarkProps { size?: number; className?: string; }
/** 48px black band above the header with one notice and an arrow. */
export interface AnnouncementBarProps { children: React.ReactNode; sub?: string; href?: string; className?: string; }
export interface NavLink { label: string; href?: string; current?: boolean; }
/** White sticky header: wordmark, sentence-case links, search / account / bag. */
export interface HeaderProps { links?: NavLink[]; cartCount?: number; homeHref?: string; className?: string; }
/** Pill button. primary = accent fill with tinted shadow; secondary = white with hairline; light = white on photos; dark = ink-deep. */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> { variant?: 'primary' | 'secondary' | 'light' | 'dark'; size?: 'md' | 'sm'; href?: string; iconAfter?: 'arrow' | 'arrowUpRight' | 'bag' | 'plus'; }
/** White pill with a soft shadow; sale = accent fill, soldout = faint. */
export interface BadgeProps { tone?: 'new' | 'sale' | 'soldout'; children: React.ReactNode; className?: string; }
/** Pill search bar with the round accent submit. */
export interface SearchFieldProps { id?: string; label?: string; placeholder?: string; onSubmit?: (query: string) => void; className?: string; }
/** White pill chip with an optional coloured category dot; pressed = ink fill. */
export interface CategoryChipProps { active?: boolean; color?: string; onClick?: () => void; children: React.ReactNode; className?: string; }
/** 28px card, dual shadow, photo in a 20px frame 8px in, vendor / name / price. Data from the Storefront API. */
export interface ProductCardProps { title: string; image?: string; imageAlt?: string; vendor?: string; price: number | string; compareAtPrice?: number | string; featured?: boolean; soldOut?: boolean; href?: string; className?: string; }
/** Optional eyebrow in muted, then a 20px semibold title with a chevron when it links. */
export interface SectionHeaderProps { title: string; eyebrow?: string; href?: string; className?: string; }
/** 4:5 rounded tile; the image is the card; translucent label chip bottom-left. */
export interface CategoryTileProps { name: string; count?: number; image?: string; href?: string; className?: string; }
/** 3:2 white logo tile from the Diamond Pro brands wall; warm light rises on hover. */
export interface BrandCardProps { name: string; logo?: string; href?: string; className?: string; }
export interface HeroSlide { title?: string; image?: string; href?: string; }
/** The hero slideshow stage: one product at a time, arrows, dots, accent link button. The site version plays a clip per slide. */
export interface HeroStageProps { slides: HeroSlide[]; className?: string; }
/** Newsletter sign-up as a white card with a pill form and round accent submit. */
export interface EmailCaptureProps { id?: string; eyebrow?: string; title?: string; thanks?: string; onSubmit?: (email: string) => void; className?: string; }

export declare const Wordmark: React.FC<WordmarkProps>;
export declare const AnnouncementBar: React.FC<AnnouncementBarProps>;
export declare const Header: React.FC<HeaderProps>;
export declare const Button: React.FC<ButtonProps>;
export declare const Badge: React.FC<BadgeProps>;
export declare const SearchField: React.FC<SearchFieldProps>;
export declare const CategoryChip: React.FC<CategoryChipProps>;
export declare const ProductCard: React.FC<ProductCardProps>;
export declare const SectionHeader: React.FC<SectionHeaderProps>;
export declare const CategoryTile: React.FC<CategoryTileProps>;
export declare const BrandCard: React.FC<BrandCardProps>;
export declare const HeroStage: React.FC<HeroStageProps>;
export declare const EmailCapture: React.FC<EmailCaptureProps>;
