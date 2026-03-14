'use client';

/**
 * ExhibitorServices — Unified Trader Services & Operations Hub
 * Categories: 14 categories covering everything a trader needs
 */
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Paintbrush, Zap, Truck, Megaphone, Coffee, Camera, Languages,
  Shield, Warehouse, Printer, Search, ShoppingCart, Plus, Minus,
  CheckCircle2, Star, Clock, Phone, Mail, ArrowRight, Package,
  Wifi, Monitor, Users, Sparkles, FileText, CreditCard, X,
  ChevronDown, ChevronUp, Building2, Globe, Headphones, Mic2,
  Lightbulb, Wrench, Flower2, BadgeCheck, Sofa, Tv,
  KeyRound, Car, DoorOpen, ClipboardList, ShieldCheck,
  Ticket, UserCheck, AlertTriangle, QrCode, IdCard,
  Fingerprint, ScanLine, Settings2
} from "lucide-react";
import { useLanguageStore } from "@/shared/store/useLanguageStore";
import { toast } from "sonner";

interface Service {
  id: string;
  icon: any;
  nameAr: string;
  nameEn: string;
  descAr: string;
  descEn: string;
  price: number;
  unit: string;
  unitAr: string;
  popular?: boolean;
  rating?: number;
  deliveryDays?: number;
}

interface ServiceCategory {
  id: string;
  icon: any;
  nameAr: string;
  nameEn: string;
  descAr: string;
  descEn: string;
  color: string;
  tab: "services" | "operations" | "permits";
  services: Service[];
}

const serviceCategories: ServiceCategory[] = [
  // TAB: Trader Services
  {
    id: "design", icon: Paintbrush, nameAr: "\u062A\u0635\u0645\u064A\u0645 \u0648\u0628\u0646\u0627\u0621 \u0627\u0644\u0628\u0648\u062B", nameEn: "Booth Design & Build", descAr: "\u062A\u0635\u0645\u064A\u0645 \u0648\u062A\u0646\u0641\u064A\u0630 \u0648\u062A\u062C\u0647\u064A\u0632 \u0627\u0644\u0628\u0648\u062B \u0628\u0627\u0644\u0643\u0627\u0645\u0644", descEn: "Complete booth design, construction and setup", color: "#C5A55A", tab: "services",
    services: [
      { id: "d1", icon: Paintbrush, nameAr: "\u062A\u0635\u0645\u064A\u0645 \u062B\u0644\u0627\u062B\u064A \u0627\u0644\u0623\u0628\u0639\u0627\u062F", nameEn: "3D Design", descAr: "\u062A\u0635\u0645\u064A\u0645 \u062B\u0644\u0627\u062B\u064A \u0627\u0644\u0623\u0628\u0639\u0627\u062F \u0627\u062D\u062A\u0631\u0627\u0641\u064A \u0644\u0644\u0628\u0648\u062B \u0645\u0639 \u0639\u0631\u0636 \u0648\u0627\u0642\u0639\u064A", descEn: "Professional 3D booth design with realistic rendering", price: 3500, unit: "per design", unitAr: "\u0644\u0643\u0644 \u062A\u0635\u0645\u064A\u0645", popular: true, rating: 4.9, deliveryDays: 3 },
      { id: "d2", icon: Wrench, nameAr: "\u0628\u0646\u0627\u0621 \u0628\u0648\u062B \u0645\u062E\u0635\u0635", nameEn: "Custom Build", descAr: "\u0628\u0646\u0627\u0621 \u0628\u0648\u062B \u0645\u062E\u0635\u0635 \u062D\u0633\u0628 \u0627\u0644\u062A\u0635\u0645\u064A\u0645 \u0627\u0644\u0645\u0639\u062A\u0645\u062F \u0628\u0645\u0648\u0627\u062F \u0639\u0627\u0644\u064A\u0629 \u0627\u0644\u062C\u0648\u062F\u0629", descEn: "Custom booth construction with premium materials", price: 15000, unit: "per booth", unitAr: "\u0644\u0643\u0644 \u0628\u0648\u062B", rating: 4.8, deliveryDays: 7 },
      { id: "d3", icon: Sofa, nameAr: "\u0623\u062B\u0627\u062B \u0648\u062A\u062C\u0647\u064A\u0632\u0627\u062A", nameEn: "Furniture & Fixtures", descAr: "\u0637\u0627\u0648\u0644\u0627\u062A\u060C \u0643\u0631\u0627\u0633\u064A\u060C \u0623\u0631\u0641\u0641 \u0639\u0631\u0636\u060C \u062E\u0632\u0627\u0626\u0646 \u0632\u062C\u0627\u062C\u064A\u0629", descEn: "Tables, chairs, display shelves, glass cabinets", price: 2500, unit: "per package", unitAr: "\u0644\u0643\u0644 \u0628\u0627\u0642\u0629", rating: 4.7, deliveryDays: 2 },
      { id: "d4", icon: Flower2, nameAr: "\u062F\u064A\u0643\u0648\u0631 \u0648\u062A\u0646\u0633\u064A\u0642", nameEn: "Decoration & Styling", descAr: "\u062A\u0646\u0633\u064A\u0642 \u0632\u0647\u0648\u0631\u060C \u0625\u0636\u0627\u0621\u0629 \u062F\u064A\u0643\u0648\u0631\u064A\u0629\u060C \u0633\u062C\u0627\u062F \u0648\u0623\u0631\u0636\u064A\u0627\u062A", descEn: "Floral arrangements, decorative lighting, carpets & flooring", price: 4000, unit: "per booth", unitAr: "\u0644\u0643\u0644 \u0628\u0648\u062B", rating: 4.6, deliveryDays: 2 },
      { id: "d5", icon: Lightbulb, nameAr: "\u0625\u0636\u0627\u0621\u0629 \u0627\u062D\u062A\u0631\u0627\u0641\u064A\u0629", nameEn: "Professional Lighting", descAr: "\u0625\u0636\u0627\u0621\u0629 LED\u060C \u0633\u0628\u0648\u062A \u0644\u0627\u064A\u062A\u060C \u0625\u0636\u0627\u0621\u0629 \u062E\u0644\u0641\u064A\u0629 \u0644\u0644\u0639\u0644\u0627\u0645\u0629 \u0627\u0644\u062A\u062C\u0627\u0631\u064A\u0629", descEn: "LED lighting, spotlights, brand backlit signage", price: 3000, unit: "per booth", unitAr: "\u0644\u0643\u0644 \u0628\u0648\u062B", popular: true, rating: 4.8, deliveryDays: 2 },
    ],
  },
  {
    id: "marketing", icon: Megaphone, nameAr: "\u0627\u0644\u062A\u0633\u0648\u064A\u0642 \u0648\u0627\u0644\u0625\u0639\u0644\u0627\u0646", nameEn: "Marketing & Advertising", descAr: "\u062D\u0645\u0644\u0627\u062A \u062A\u0633\u0648\u064A\u0642\u064A\u0629 \u0648\u0625\u0639\u0644\u0627\u0646\u0627\u062A \u062F\u0627\u062E\u0644 \u0627\u0644\u0645\u0639\u0631\u0636", descEn: "Marketing campaigns and in-expo advertising", color: "#EC4899", tab: "services",
    services: [
      { id: "m1", icon: Megaphone, nameAr: "\u0625\u0639\u0644\u0627\u0646 \u0641\u064A \u0643\u062A\u064A\u0628 \u0627\u0644\u0645\u0639\u0631\u0636", nameEn: "Expo Catalog Ad", descAr: "\u0635\u0641\u062D\u0629 \u0625\u0639\u0644\u0627\u0646\u064A\u0629 \u0643\u0627\u0645\u0644\u0629 \u0641\u064A \u0643\u062A\u064A\u0628 \u0627\u0644\u0645\u0639\u0631\u0636 \u0627\u0644\u0631\u0633\u0645\u064A", descEn: "Full page ad in official expo catalog", price: 5000, unit: "per page", unitAr: "\u0644\u0643\u0644 \u0635\u0641\u062D\u0629", rating: 4.5, deliveryDays: 5 },
      { id: "m2", icon: Monitor, nameAr: "\u0625\u0639\u0644\u0627\u0646 \u0639\u0644\u0649 \u0634\u0627\u0634\u0627\u062A \u0627\u0644\u0645\u0639\u0631\u0636", nameEn: "Digital Signage Ad", descAr: "\u0639\u0631\u0636 \u0625\u0639\u0644\u0627\u0646\u0643 \u0639\u0644\u0649 \u0627\u0644\u0634\u0627\u0634\u0627\u062A \u0627\u0644\u0631\u0642\u0645\u064A\u0629 \u0641\u064A \u0627\u0644\u0645\u0639\u0631\u0636", descEn: "Display your ad on expo digital screens", price: 8000, unit: "per event", unitAr: "\u0644\u0643\u0644 \u0641\u0639\u0627\u0644\u064A\u0629", popular: true, rating: 4.7, deliveryDays: 3 },
      { id: "m3", icon: Globe, nameAr: "\u062A\u0633\u0648\u064A\u0642 \u0631\u0642\u0645\u064A", nameEn: "Digital Marketing", descAr: "\u062D\u0645\u0644\u0629 \u0625\u0639\u0644\u0627\u0646\u064A\u0629 \u0639\u0644\u0649 \u0648\u0633\u0627\u0626\u0644 \u0627\u0644\u062A\u0648\u0627\u0635\u0644 + SEO", descEn: "Social media campaign + SEO optimization", price: 6000, unit: "per campaign", unitAr: "\u0644\u0643\u0644 \u062D\u0645\u0644\u0629", rating: 4.6, deliveryDays: 5 },
      { id: "m4", icon: Sparkles, nameAr: "\u0647\u062F\u0627\u064A\u0627 \u062A\u0631\u0648\u064A\u062C\u064A\u0629", nameEn: "Promotional Gifts", descAr: "\u062A\u0635\u0645\u064A\u0645 \u0648\u0625\u0646\u062A\u0627\u062C \u0647\u062F\u0627\u064A\u0627 \u062A\u0631\u0648\u064A\u062C\u064A\u0629 \u0628\u0634\u0639\u0627\u0631\u0643", descEn: "Design and produce branded promotional gifts", price: 3000, unit: "per 500 pcs", unitAr: "\u0644\u0643\u0644 500 \u0642\u0637\u0639\u0629", rating: 4.4, deliveryDays: 7 },
    ],
  },
  {
    id: "hospitality", icon: Coffee, nameAr: "\u0627\u0644\u0636\u064A\u0627\u0641\u0629 \u0648\u0627\u0644\u0643\u0627\u062A\u0631\u0646\u062C", nameEn: "Hospitality & Catering", descAr: "\u062E\u062F\u0645\u0627\u062A \u0636\u064A\u0627\u0641\u0629 \u0648\u0637\u0639\u0627\u0645 \u0648\u0634\u0631\u0627\u0628 \u0644\u0644\u0632\u0648\u0627\u0631", descEn: "Hospitality, food and beverage for visitors", color: "#10B981", tab: "services",
    services: [
      { id: "h1", icon: Coffee, nameAr: "\u0631\u0643\u0646 \u0642\u0647\u0648\u0629 \u0648\u0634\u0627\u064A", nameEn: "Coffee & Tea Corner", descAr: "\u0645\u0627\u0643\u064A\u0646\u0629 \u0642\u0647\u0648\u0629 \u0627\u062D\u062A\u0631\u0627\u0641\u064A\u0629 + \u0634\u0627\u064A + \u0645\u064A\u0627\u0647 \u0637\u0648\u0627\u0644 \u0627\u0644\u0641\u0639\u0627\u0644\u064A\u0629", descEn: "Professional coffee machine + tea + water throughout event", price: 4500, unit: "per event", unitAr: "\u0644\u0643\u0644 \u0641\u0639\u0627\u0644\u064A\u0629", popular: true, rating: 4.9, deliveryDays: 1 },
      { id: "h2", icon: Coffee, nameAr: "\u0628\u0648\u0641\u064A\u0647 \u062E\u0641\u064A\u0641", nameEn: "Light Buffet", descAr: "\u0628\u0648\u0641\u064A\u0647 \u0645\u0639\u062C\u0646\u0627\u062A \u0648\u062D\u0644\u0648\u064A\u0627\u062A \u0648\u0639\u0635\u0627\u0626\u0631 \u0637\u0628\u064A\u0639\u064A\u0629", descEn: "Pastries, sweets and fresh juices buffet", price: 3500, unit: "per day", unitAr: "\u0644\u0643\u0644 \u064A\u0648\u0645", rating: 4.7, deliveryDays: 1 },
      { id: "h3", icon: Users, nameAr: "\u0637\u0627\u0642\u0645 \u0636\u064A\u0627\u0641\u0629", nameEn: "Hospitality Staff", descAr: "\u0645\u0636\u064A\u0641\u064A\u0646/\u0645\u0636\u064A\u0641\u0627\u062A \u0645\u062D\u062A\u0631\u0641\u064A\u0646 \u0644\u0627\u0633\u062A\u0642\u0628\u0627\u0644 \u0627\u0644\u0632\u0648\u0627\u0631", descEn: "Professional hosts/hostesses for visitor reception", price: 1500, unit: "per person/day", unitAr: "\u0644\u0643\u0644 \u0634\u062E\u0635/\u064A\u0648\u0645", rating: 4.8, deliveryDays: 2 },
    ],
  },
  {
    id: "photography", icon: Camera, nameAr: "\u0627\u0644\u062A\u0635\u0648\u064A\u0631 \u0648\u0627\u0644\u0641\u064A\u062F\u064A\u0648", nameEn: "Photography & Video", descAr: "\u062A\u0635\u0648\u064A\u0631 \u0641\u0648\u062A\u0648\u063A\u0631\u0627\u0641\u064A \u0648\u0641\u064A\u062F\u064A\u0648 \u0627\u062D\u062A\u0631\u0627\u0641\u064A", descEn: "Professional photography and videography", color: "#8B5CF6", tab: "services",
    services: [
      { id: "p1", icon: Camera, nameAr: "\u062A\u0635\u0648\u064A\u0631 \u0641\u0648\u062A\u0648\u063A\u0631\u0627\u0641\u064A", nameEn: "Photography", descAr: "\u0645\u0635\u0648\u0631 \u0645\u062D\u062A\u0631\u0641 \u0644\u062A\u063A\u0637\u064A\u0629 \u064A\u0648\u0645 \u0643\u0627\u0645\u0644 + \u062A\u062D\u0631\u064A\u0631", descEn: "Professional photographer for full day + editing", price: 3500, unit: "per day", unitAr: "\u0644\u0643\u0644 \u064A\u0648\u0645", popular: true, rating: 4.9, deliveryDays: 3 },
      { id: "p2", icon: Camera, nameAr: "\u062A\u0635\u0648\u064A\u0631 \u0641\u064A\u062F\u064A\u0648", nameEn: "Videography", descAr: "\u0641\u0631\u064A\u0642 \u062A\u0635\u0648\u064A\u0631 \u0641\u064A\u062F\u064A\u0648 + \u0645\u0648\u0646\u062A\u0627\u062C \u0627\u062D\u062A\u0631\u0627\u0641\u064A", descEn: "Video crew + professional editing", price: 7000, unit: "per day", unitAr: "\u0644\u0643\u0644 \u064A\u0648\u0645", rating: 4.8, deliveryDays: 5 },
      { id: "p3", icon: Camera, nameAr: "\u0628\u062B \u0645\u0628\u0627\u0634\u0631", nameEn: "Live Streaming", descAr: "\u0628\u062B \u0645\u0628\u0627\u0634\u0631 \u0639\u0644\u0649 \u0645\u0646\u0635\u0627\u062A \u0627\u0644\u062A\u0648\u0627\u0635\u0644 \u0627\u0644\u0627\u062C\u062A\u0645\u0627\u0639\u064A", descEn: "Live streaming on social media platforms", price: 5000, unit: "per day", unitAr: "\u0644\u0643\u0644 \u064A\u0648\u0645", rating: 4.6, deliveryDays: 1 },
    ],
  },
  {
    id: "translation", icon: Languages, nameAr: "\u0627\u0644\u062A\u0631\u062C\u0645\u0629 \u0648\u0627\u0644\u0645\u0636\u064A\u0641\u064A\u0646", nameEn: "Translation & Hosts", descAr: "\u062E\u062F\u0645\u0627\u062A \u062A\u0631\u062C\u0645\u0629 \u0641\u0648\u0631\u064A\u0629 \u0648\u0645\u0636\u064A\u0641\u064A\u0646 \u0645\u062A\u0639\u062F\u062F\u064A \u0627\u0644\u0644\u063A\u0627\u062A", descEn: "Simultaneous translation and multilingual hosts", color: "#06B6D4", tab: "services",
    services: [
      { id: "t1", icon: Languages, nameAr: "\u0645\u062A\u0631\u062C\u0645 \u0641\u0648\u0631\u064A", nameEn: "Simultaneous Interpreter", descAr: "\u0645\u062A\u0631\u062C\u0645 \u0641\u0648\u0631\u064A \u0645\u062D\u062A\u0631\u0641 (\u0639\u0631\u0628\u064A/\u0625\u0646\u062C\u0644\u064A\u0632\u064A/\u0641\u0631\u0646\u0633\u064A/\u0635\u064A\u0646\u064A)", descEn: "Professional interpreter (AR/EN/FR/CN)", price: 2500, unit: "per day", unitAr: "\u0644\u0643\u0644 \u064A\u0648\u0645", popular: true, rating: 4.8, deliveryDays: 2 },
      { id: "t2", icon: Headphones, nameAr: "\u0623\u062C\u0647\u0632\u0629 \u062A\u0631\u062C\u0645\u0629 \u0641\u0648\u0631\u064A\u0629", nameEn: "Translation Equipment", descAr: "\u0633\u0645\u0627\u0639\u0627\u062A \u0648\u0623\u062C\u0647\u0632\u0629 \u0625\u0631\u0633\u0627\u0644 \u0648\u0627\u0633\u062A\u0642\u0628\u0627\u0644 \u0644\u0644\u062A\u0631\u062C\u0645\u0629 \u0627\u0644\u0641\u0648\u0631\u064A\u0629", descEn: "Headsets and transmitters for simultaneous translation", price: 1500, unit: "per 50 sets", unitAr: "\u0644\u0643\u0644 50 \u0637\u0642\u0645", rating: 4.7, deliveryDays: 1 },
      { id: "t3", icon: Mic2, nameAr: "\u0645\u0642\u062F\u0645 \u0641\u0639\u0627\u0644\u064A\u0627\u062A", nameEn: "Event MC", descAr: "\u0645\u0642\u062F\u0645 \u0641\u0639\u0627\u0644\u064A\u0627\u062A \u0645\u062D\u062A\u0631\u0641 \u062B\u0646\u0627\u0626\u064A \u0627\u0644\u0644\u063A\u0629", descEn: "Professional bilingual event MC", price: 5000, unit: "per day", unitAr: "\u0644\u0643\u0644 \u064A\u0648\u0645", rating: 4.9, deliveryDays: 3 },
    ],
  },
  {
    id: "printing", icon: Printer, nameAr: "\u0627\u0644\u0637\u0628\u0627\u0639\u0629 \u0648\u0627\u0644\u0625\u0646\u062A\u0627\u062C", nameEn: "Printing & Production", descAr: "\u0637\u0628\u0627\u0639\u0629 \u0648\u0625\u0646\u062A\u0627\u062C \u062C\u0645\u064A\u0639 \u0627\u0644\u0645\u0648\u0627\u062F \u0627\u0644\u062A\u0631\u0648\u064A\u062C\u064A\u0629", descEn: "Print and produce all promotional materials", color: "#F97316", tab: "services",
    services: [
      { id: "pr1", icon: Printer, nameAr: "\u0644\u0648\u062D\u0629 \u062E\u0644\u0641\u064A\u0629 (Backdrop)", nameEn: "Backdrop Banner", descAr: "\u0637\u0628\u0627\u0639\u0629 \u0644\u0648\u062D\u0629 \u062E\u0644\u0641\u064A\u0629 \u0639\u0627\u0644\u064A\u0629 \u0627\u0644\u062C\u0648\u062F\u0629 \u0628\u0627\u0644\u062D\u062C\u0645 \u0627\u0644\u0643\u0627\u0645\u0644", descEn: "Full-size high-quality backdrop printing", price: 2500, unit: "per banner", unitAr: "\u0644\u0643\u0644 \u0644\u0648\u062D\u0629", popular: true, rating: 4.8, deliveryDays: 3 },
      { id: "pr2", icon: Printer, nameAr: "\u0631\u0648\u0644 \u0623\u0628 (Roll-up)", nameEn: "Roll-up Banner", descAr: "\u0628\u0627\u0646\u0631 \u0631\u0648\u0644 \u0623\u0628 85\u00D7200 \u0633\u0645 \u0645\u0639 \u062D\u0627\u0645\u0644", descEn: "85\u00D7200cm roll-up banner with stand", price: 350, unit: "per piece", unitAr: "\u0644\u0643\u0644 \u0642\u0637\u0639\u0629", rating: 4.7, deliveryDays: 2 },
      { id: "pr3", icon: FileText, nameAr: "\u0628\u0631\u0648\u0634\u0648\u0631\u0627\u062A \u0648\u0643\u062A\u064A\u0628\u0627\u062A", nameEn: "Brochures & Catalogs", descAr: "\u062A\u0635\u0645\u064A\u0645 \u0648\u0637\u0628\u0627\u0639\u0629 \u0628\u0631\u0648\u0634\u0648\u0631\u0627\u062A \u0648\u0643\u062A\u064A\u0628\u0627\u062A \u0627\u062D\u062A\u0631\u0627\u0641\u064A\u0629", descEn: "Design and print professional brochures and catalogs", price: 3000, unit: "per 1000 pcs", unitAr: "\u0644\u0643\u0644 1000 \u0642\u0637\u0639\u0629", rating: 4.6, deliveryDays: 5 },
      { id: "pr4", icon: FileText, nameAr: "\u0628\u0637\u0627\u0642\u0627\u062A \u0623\u0639\u0645\u0627\u0644", nameEn: "Business Cards", descAr: "\u062A\u0635\u0645\u064A\u0645 \u0648\u0637\u0628\u0627\u0639\u0629 \u0628\u0637\u0627\u0642\u0627\u062A \u0623\u0639\u0645\u0627\u0644 \u0641\u0627\u062E\u0631\u0629", descEn: "Design and print premium business cards", price: 500, unit: "per 500 pcs", unitAr: "\u0644\u0643\u0644 500 \u0642\u0637\u0639\u0629", rating: 4.8, deliveryDays: 3 },
    ],
  },
  // TAB: Operations
  {
    id: "utilities", icon: Zap, nameAr: "\u0627\u0644\u0643\u0647\u0631\u0628\u0627\u0621 \u0648\u0627\u0644\u0645\u0631\u0627\u0641\u0642", nameEn: "Electricity & Utilities", descAr: "\u062C\u0645\u064A\u0639 \u062E\u062F\u0645\u0627\u062A \u0627\u0644\u0628\u0646\u064A\u0629 \u0627\u0644\u062A\u062D\u062A\u064A\u0629 \u0648\u0627\u0644\u0643\u0647\u0631\u0628\u0627\u0621 \u0648\u0627\u0644\u062A\u0643\u064A\u064A\u0641", descEn: "All infrastructure, power and HVAC services", color: "#60A5FA", tab: "operations",
    services: [
      { id: "u1", icon: Zap, nameAr: "\u0643\u0647\u0631\u0628\u0627\u0621 \u0623\u062D\u0627\u062F\u064A\u0629 \u0627\u0644\u0637\u0648\u0631 (13A)", nameEn: "Single Phase Power (13A)", descAr: "\u062A\u0648\u0635\u064A\u0644 \u0643\u0647\u0631\u0628\u0627\u0621 \u0623\u062D\u0627\u062F\u064A \u0645\u0639 \u0644\u0648\u062D\u0629 \u062A\u0648\u0632\u064A\u0639 \u0648\u0642\u0627\u0637\u0639 \u062D\u0645\u0627\u064A\u0629", descEn: "Single phase power with distribution board and circuit breaker", price: 800, unit: "per unit", unitAr: "\u0644\u0643\u0644 \u0648\u062D\u062F\u0629", rating: 4.9, deliveryDays: 1 },
      { id: "u2", icon: Zap, nameAr: "\u0643\u0647\u0631\u0628\u0627\u0621 \u062B\u0644\u0627\u062B\u064A\u0629 \u0627\u0644\u0623\u0637\u0648\u0627\u0631 (32A)", nameEn: "Three Phase Power (32A)", descAr: "\u0644\u0644\u0645\u0639\u062F\u0627\u062A \u0627\u0644\u062B\u0642\u064A\u0644\u0629 \u0648\u0627\u0644\u0634\u0627\u0634\u0627\u062A \u0627\u0644\u0643\u0628\u064A\u0631\u0629 \u2014 380V", descEn: "For heavy equipment and large displays \u2014 380V", price: 2500, unit: "per unit", unitAr: "\u0644\u0643\u0644 \u0648\u062D\u062F\u0629", rating: 4.8, deliveryDays: 1 },
      { id: "u3", icon: Wifi, nameAr: "\u0625\u0646\u062A\u0631\u0646\u062A \u0641\u0627\u0626\u0642 \u0627\u0644\u0633\u0631\u0639\u0629", nameEn: "High-Speed Internet", descAr: "\u0625\u0646\u062A\u0631\u0646\u062A \u0623\u0644\u064A\u0627\u0641 \u0628\u0635\u0631\u064A\u0629 \u0645\u062E\u0635\u0635 100Mbps \u0645\u0639 IP \u062B\u0627\u0628\u062A", descEn: "Dedicated fiber optic 100Mbps with static IP", price: 1500, unit: "per event", unitAr: "\u0644\u0643\u0644 \u0641\u0639\u0627\u0644\u064A\u0629", popular: true, rating: 4.7, deliveryDays: 1 },
      { id: "u4", icon: Monitor, nameAr: "\u0634\u0627\u0634\u0629 \u0639\u0631\u0636 LED 55\"", nameEn: "55\" LED Display", descAr: "\u0634\u0627\u0634\u0629 LED \u0639\u0627\u0644\u064A\u0629 \u0627\u0644\u062F\u0642\u0629 4K \u0645\u0639 \u062D\u0627\u0645\u0644 \u0623\u0631\u0636\u064A", descEn: "4K HD LED screen with floor stand", price: 3500, unit: "per screen", unitAr: "\u0644\u0643\u0644 \u0634\u0627\u0634\u0629", rating: 4.8, deliveryDays: 1 },
      { id: "u5", icon: Tv, nameAr: "\u0646\u0638\u0627\u0645 \u0635\u0648\u062A \u0627\u062D\u062A\u0631\u0627\u0641\u064A", nameEn: "Professional Sound System", descAr: "\u0645\u0643\u0628\u0631\u0627\u062A \u0635\u0648\u062A JBL\u060C \u0645\u064A\u0643\u0631\u0648\u0641\u0648\u0646\u0627\u062A \u0644\u0627\u0633\u0644\u0643\u064A\u0629\u060C \u0645\u064A\u0643\u0633\u0631 \u0631\u0642\u0645\u064A", descEn: "JBL speakers, wireless mics, digital mixer", price: 4000, unit: "per system", unitAr: "\u0644\u0643\u0644 \u0646\u0638\u0627\u0645", rating: 4.6, deliveryDays: 1 },
    ],
  },
  {
    id: "logistics", icon: Truck, nameAr: "\u0627\u0644\u0644\u0648\u062C\u0633\u062A\u064A\u0627\u062A \u0648\u0627\u0644\u0634\u062D\u0646", nameEn: "Logistics & Shipping", descAr: "\u0646\u0642\u0644 \u0648\u0634\u062D\u0646 \u0648\u062A\u0631\u0643\u064A\u0628 \u0627\u0644\u0645\u0639\u062F\u0627\u062A \u0648\u0627\u0644\u0645\u0648\u0627\u062F", descEn: "Transport, shipping and equipment installation", color: "#F59E0B", tab: "operations",
    services: [
      { id: "l1", icon: Truck, nameAr: "\u0646\u0642\u0644 \u062F\u0627\u062E\u0644\u064A (\u0627\u0644\u0631\u064A\u0627\u0636)", nameEn: "Local Transport (Riyadh)", descAr: "\u0646\u0642\u0644 \u0627\u0644\u0645\u0639\u062F\u0627\u062A \u0648\u0627\u0644\u0645\u0648\u0627\u062F \u062F\u0627\u062E\u0644 \u0627\u0644\u0631\u064A\u0627\u0636 \u0645\u0639 \u062A\u0623\u0645\u064A\u0646 \u0634\u0627\u0645\u0644", descEn: "Equipment transport within Riyadh with full insurance", price: 1200, unit: "per trip", unitAr: "\u0644\u0643\u0644 \u0631\u062D\u0644\u0629", rating: 4.7, deliveryDays: 1 },
      { id: "l2", icon: Package, nameAr: "\u0634\u062D\u0646 \u062F\u0648\u0644\u064A", nameEn: "International Shipping", descAr: "\u0634\u062D\u0646 \u062C\u0648\u064A \u0623\u0648 \u0628\u062D\u0631\u064A \u0645\u0646 \u0623\u064A \u062F\u0648\u0644\u0629 \u0645\u0639 \u062A\u062E\u0644\u064A\u0635 \u062C\u0645\u0631\u0643\u064A", descEn: "Air or sea freight from any country with customs clearance", price: 5000, unit: "per shipment", unitAr: "\u0644\u0643\u0644 \u0634\u062D\u0646\u0629", rating: 4.5, deliveryDays: 7 },
      { id: "l3", icon: Wrench, nameAr: "\u062A\u0631\u0643\u064A\u0628 \u0648\u062A\u0641\u0643\u064A\u0643", nameEn: "Setup & Dismantling", descAr: "\u0641\u0631\u064A\u0642 \u0645\u062A\u062E\u0635\u0635 \u0644\u062A\u0631\u0643\u064A\u0628 \u0648\u062A\u0641\u0643\u064A\u0643 \u0627\u0644\u0628\u0648\u062B \u0628\u0627\u0644\u0643\u0627\u0645\u0644", descEn: "Specialized team for complete booth setup and dismantling", price: 3000, unit: "per booth", unitAr: "\u0644\u0643\u0644 \u0628\u0648\u062B", popular: true, rating: 4.8, deliveryDays: 1 },
      { id: "l4", icon: Users, nameAr: "\u0639\u0645\u0627\u0644 \u0645\u0633\u0627\u0639\u062F\u0629", nameEn: "Labor Support", descAr: "\u0639\u0645\u0627\u0644 \u0644\u0646\u0642\u0644 \u0648\u062A\u0631\u062A\u064A\u0628 \u0627\u0644\u0645\u0639\u0631\u0648\u0636\u0627\u062A \u0648\u0627\u0644\u0628\u0636\u0627\u0626\u0639", descEn: "Workers for moving and arranging exhibits and goods", price: 500, unit: "per worker/day", unitAr: "\u0644\u0643\u0644 \u0639\u0627\u0645\u0644/\u064A\u0648\u0645", rating: 4.6, deliveryDays: 1 },
    ],
  },
  {
    id: "storage", icon: Warehouse, nameAr: "\u0627\u0644\u062A\u062E\u0632\u064A\u0646 \u0648\u0627\u0644\u0645\u0633\u062A\u0648\u062F\u0639\u0627\u062A", nameEn: "Storage & Warehousing", descAr: "\u062A\u062E\u0632\u064A\u0646 \u0622\u0645\u0646 \u0648\u0645\u0643\u064A\u0641 \u0644\u0644\u0645\u0648\u0627\u062F \u0648\u0627\u0644\u0645\u0639\u062F\u0627\u062A", descEn: "Secure climate-controlled storage for materials", color: "#78716C", tab: "operations",
    services: [
      { id: "s1", icon: Warehouse, nameAr: "\u062A\u062E\u0632\u064A\u0646 \u0642\u0628\u0644 \u0627\u0644\u0645\u0639\u0631\u0636", nameEn: "Pre-Event Storage", descAr: "\u0645\u0633\u062A\u0648\u062F\u0639 \u0645\u0643\u064A\u0641 \u0644\u062A\u062E\u0632\u064A\u0646 \u0627\u0644\u0645\u0648\u0627\u062F \u0642\u0628\u0644 \u0627\u0644\u0645\u0639\u0631\u0636 \u0645\u0639 \u062D\u0631\u0627\u0633\u0629 24/7", descEn: "Climate-controlled warehouse with 24/7 security", price: 1500, unit: "per week", unitAr: "\u0644\u0643\u0644 \u0623\u0633\u0628\u0648\u0639", rating: 4.6, deliveryDays: 1 },
      { id: "s2", icon: Warehouse, nameAr: "\u062A\u062E\u0632\u064A\u0646 \u0628\u0639\u062F \u0627\u0644\u0645\u0639\u0631\u0636", nameEn: "Post-Event Storage", descAr: "\u062A\u062E\u0632\u064A\u0646 \u0627\u0644\u0645\u0639\u062F\u0627\u062A \u0648\u0627\u0644\u0645\u0648\u0627\u062F \u0628\u0639\u062F \u0627\u0646\u062A\u0647\u0627\u0621 \u0627\u0644\u0645\u0639\u0631\u0636", descEn: "Storage for equipment and materials after event", price: 1200, unit: "per week", unitAr: "\u0644\u0643\u0644 \u0623\u0633\u0628\u0648\u0639", rating: 4.5, deliveryDays: 1 },
    ],
  },
  {
    id: "cleaning", icon: Wrench, nameAr: "\u0627\u0644\u062A\u0646\u0638\u064A\u0641 \u0648\u0627\u0644\u0635\u064A\u0627\u0646\u0629", nameEn: "Cleaning & Maintenance", descAr: "\u062E\u062F\u0645\u0627\u062A \u062A\u0646\u0638\u064A\u0641 \u064A\u0648\u0645\u064A\u0629 \u0648\u0635\u064A\u0627\u0646\u0629 \u0641\u0646\u064A\u0629", descEn: "Daily cleaning and technical maintenance", color: "#22D3EE", tab: "operations",
    services: [
      { id: "cl1", icon: Wrench, nameAr: "\u062A\u0646\u0638\u064A\u0641 \u064A\u0648\u0645\u064A \u0644\u0644\u0628\u0648\u062B", nameEn: "Daily Booth Cleaning", descAr: "\u062E\u062F\u0645\u0629 \u062A\u0646\u0638\u064A\u0641 \u064A\u0648\u0645\u064A\u0629 \u0634\u0627\u0645\u0644\u0629 \u0645\u0639 \u062A\u0639\u0642\u064A\u0645 \u0648\u0645\u0648\u0627\u062F \u062A\u0646\u0638\u064A\u0641", descEn: "Comprehensive daily cleaning with sanitization", price: 350, unit: "per day", unitAr: "\u0644\u0643\u0644 \u064A\u0648\u0645", rating: 4.6, deliveryDays: 1 },
      { id: "cl2", icon: Settings2, nameAr: "\u0635\u064A\u0627\u0646\u0629 \u0641\u0646\u064A\u0629 \u0637\u0627\u0631\u0626\u0629", nameEn: "Emergency Technical Maintenance", descAr: "\u0641\u0646\u064A \u0645\u062A\u062E\u0635\u0635 \u0644\u0625\u0635\u0644\u0627\u062D \u0623\u064A \u0623\u0639\u0637\u0627\u0644 \u0643\u0647\u0631\u0628\u0627\u0626\u064A\u0629 \u0623\u0648 \u0645\u064A\u0643\u0627\u0646\u064A\u0643\u064A\u0629", descEn: "Specialist technician for electrical or mechanical repairs", price: 500, unit: "per visit", unitAr: "\u0644\u0643\u0644 \u0632\u064A\u0627\u0631\u0629", popular: true, rating: 4.8, deliveryDays: 0 },
    ],
  },
  {
    id: "insurance", icon: Shield, nameAr: "\u0627\u0644\u062A\u0623\u0645\u064A\u0646 \u0648\u0627\u0644\u0633\u0644\u0627\u0645\u0629", nameEn: "Insurance & Safety", descAr: "\u062A\u0623\u0645\u064A\u0646 \u0634\u0627\u0645\u0644 \u0648\u0634\u0647\u0627\u062F\u0627\u062A \u0633\u0644\u0627\u0645\u0629 \u0648\u0645\u0639\u062F\u0627\u062A \u0625\u0637\u0641\u0627\u0621", descEn: "Comprehensive insurance, safety certificates & fire equipment", color: "#EF4444", tab: "operations",
    services: [
      { id: "i1", icon: Shield, nameAr: "\u062A\u0623\u0645\u064A\u0646 \u0634\u0627\u0645\u0644 \u0639\u0644\u0649 \u0627\u0644\u0628\u0648\u062B", nameEn: "Booth Insurance", descAr: "\u062A\u0623\u0645\u064A\u0646 \u0636\u062F \u0627\u0644\u062D\u0631\u064A\u0642 \u0648\u0627\u0644\u0633\u0631\u0642\u0629 \u0648\u0627\u0644\u0623\u0636\u0631\u0627\u0631 \u0637\u0648\u0627\u0644 \u0627\u0644\u0641\u0639\u0627\u0644\u064A\u0629", descEn: "Insurance against fire, theft and damage", price: 2000, unit: "per event", unitAr: "\u0644\u0643\u0644 \u0641\u0639\u0627\u0644\u064A\u0629", popular: true, rating: 4.7, deliveryDays: 2 },
      { id: "i2", icon: ShieldCheck, nameAr: "\u062D\u0627\u0631\u0633 \u0623\u0645\u0646", nameEn: "Security Guard", descAr: "\u062D\u0627\u0631\u0633 \u0623\u0645\u0646 \u0645\u0631\u062E\u0635 \u0648\u0645\u062F\u0631\u0628 \u2014 \u0648\u0631\u062F\u064A\u0629 8 \u0633\u0627\u0639\u0627\u062A", descEn: "Licensed trained security guard \u2014 8-hour shift", price: 600, unit: "per shift", unitAr: "\u0644\u0643\u0644 \u0648\u0631\u062F\u064A\u0629", rating: 4.5, deliveryDays: 1 },
      { id: "i3", icon: BadgeCheck, nameAr: "\u0634\u0647\u0627\u062F\u0629 \u0633\u0644\u0627\u0645\u0629", nameEn: "Safety Certificate", descAr: "\u0641\u062D\u0635 \u0648\u0634\u0647\u0627\u062F\u0629 \u0633\u0644\u0627\u0645\u0629 \u0644\u0644\u0628\u0648\u062B \u0648\u0627\u0644\u0645\u0639\u062F\u0627\u062A \u0645\u0646 \u0627\u0644\u062F\u0641\u0627\u0639 \u0627\u0644\u0645\u062F\u0646\u064A", descEn: "Safety inspection certificate from Civil Defense", price: 1000, unit: "per certificate", unitAr: "\u0644\u0643\u0644 \u0634\u0647\u0627\u062F\u0629", rating: 4.6, deliveryDays: 3 },
    ],
  },
  // TAB: Permits & Badges
  {
    id: "badges", icon: IdCard, nameAr: "\u0627\u0644\u0628\u0627\u062C\u0627\u062A \u0648\u0628\u0637\u0627\u0642\u0627\u062A \u0627\u0644\u062F\u062E\u0648\u0644", nameEn: "Badges & Access Cards", descAr: "\u0628\u0627\u062C\u0627\u062A \u0627\u0644\u0645\u0648\u0638\u0641\u064A\u0646 \u0648\u0627\u0644\u0632\u0648\u0627\u0631 \u0648\u0628\u0637\u0627\u0642\u0627\u062A VIP", descEn: "Staff badges, visitor passes and VIP cards", color: "#C5A55A", tab: "permits",
    services: [
      { id: "bg1", icon: IdCard, nameAr: "\u0628\u0627\u062C \u0645\u0648\u0638\u0641 / \u0639\u0627\u0645\u0644", nameEn: "Staff Badge", descAr: "\u0628\u0637\u0627\u0642\u0629 \u062F\u062E\u0648\u0644 \u0644\u0644\u0645\u0648\u0638\u0641\u064A\u0646 \u0648\u0627\u0644\u0639\u0645\u0627\u0644 \u0645\u0639 \u0635\u0648\u0631\u0629 \u0648\u0628\u0627\u0631\u0643\u0648\u062F \u2014 \u0635\u0627\u0644\u062D\u0629 \u0637\u0648\u0627\u0644 \u0627\u0644\u0641\u0639\u0627\u0644\u064A\u0629", descEn: "Staff entry badge with photo and barcode \u2014 valid for entire event", price: 50, unit: "per badge", unitAr: "\u0644\u0643\u0644 \u0628\u0627\u062C", popular: true, rating: 4.9, deliveryDays: 1 },
      { id: "bg2", icon: Ticket, nameAr: "\u0628\u0627\u062C \u0632\u0627\u0626\u0631 VIP", nameEn: "VIP Visitor Badge", descAr: "\u0628\u0637\u0627\u0642\u0629 \u062F\u062E\u0648\u0644 VIP \u0644\u0644\u0639\u0645\u0644\u0627\u0621 \u0648\u0627\u0644\u0636\u064A\u0648\u0641 \u0627\u0644\u0645\u0645\u064A\u0632\u064A\u0646 \u0645\u0639 \u0635\u0644\u0627\u062D\u064A\u0627\u062A \u062E\u0627\u0635\u0629", descEn: "VIP entry badge for special guests with premium access", price: 100, unit: "per badge", unitAr: "\u0644\u0643\u0644 \u0628\u0627\u062C", rating: 4.8, deliveryDays: 1 },
      { id: "bg3", icon: QrCode, nameAr: "\u0628\u0627\u062C \u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A (QR)", nameEn: "Digital Badge (QR)", descAr: "\u0628\u0627\u062C \u0631\u0642\u0645\u064A \u0628\u0643\u0648\u062F QR \u064A\u064F\u0631\u0633\u0644 \u0639\u0628\u0631 SMS/WhatsApp \u2014 \u0628\u062F\u0648\u0646 \u0637\u0628\u0627\u0639\u0629", descEn: "Digital QR badge sent via SMS/WhatsApp \u2014 no printing needed", price: 25, unit: "per badge", unitAr: "\u0644\u0643\u0644 \u0628\u0627\u062C", popular: true, rating: 4.7, deliveryDays: 0 },
      { id: "bg4", icon: Fingerprint, nameAr: "\u0628\u0627\u062C \u0628\u0635\u0645\u0629 (Biometric)", nameEn: "Biometric Badge", descAr: "\u0628\u0637\u0627\u0642\u0629 \u062F\u062E\u0648\u0644 \u0628\u0628\u0635\u0645\u0629 \u0627\u0644\u0625\u0635\u0628\u0639 \u0644\u0644\u0645\u0646\u0627\u0637\u0642 \u0639\u0627\u0644\u064A\u0629 \u0627\u0644\u0623\u0645\u0627\u0646", descEn: "Fingerprint entry card for high-security zones", price: 200, unit: "per badge", unitAr: "\u0644\u0643\u0644 \u0628\u0627\u062C", rating: 4.6, deliveryDays: 2 },
    ],
  },
  {
    id: "vehicle-permits", icon: Car, nameAr: "\u062A\u0635\u0627\u0631\u064A\u062D \u0627\u0644\u0633\u064A\u0627\u0631\u0627\u062A \u0648\u0627\u0644\u0628\u0636\u0627\u0626\u0639", nameEn: "Vehicle & Cargo Permits", descAr: "\u062A\u0635\u0627\u0631\u064A\u062D \u062F\u062E\u0648\u0644 \u0627\u0644\u0633\u064A\u0627\u0631\u0627\u062A \u0648\u0627\u0644\u0634\u0627\u062D\u0646\u0627\u062A \u0648\u0627\u0644\u0628\u0636\u0627\u0626\u0639 \u0644\u0644\u0645\u0648\u0642\u0639", descEn: "Vehicle, truck and cargo entry permits to venue", color: "#3B82F6", tab: "permits",
    services: [
      { id: "vp1", icon: Car, nameAr: "\u062A\u0635\u0631\u064A\u062D \u0633\u064A\u0627\u0631\u0629 \u0631\u0643\u0627\u0628", nameEn: "Passenger Vehicle Permit", descAr: "\u062A\u0635\u0631\u064A\u062D \u062F\u062E\u0648\u0644 \u0633\u064A\u0627\u0631\u0629 \u0631\u0643\u0627\u0628 \u0648\u0627\u062D\u062F\u0629 \u0644\u0645\u0648\u0642\u0639 \u0627\u0644\u0641\u0639\u0627\u0644\u064A\u0629 \u0645\u0639 \u0645\u0648\u0642\u0641 \u0645\u062E\u0635\u0635", descEn: "Single passenger vehicle entry permit with designated parking", price: 200, unit: "per vehicle", unitAr: "\u0644\u0643\u0644 \u0633\u064A\u0627\u0631\u0629", popular: true, rating: 4.8, deliveryDays: 1 },
      { id: "vp2", icon: Truck, nameAr: "\u062A\u0635\u0631\u064A\u062D \u0634\u0627\u062D\u0646\u0629 / \u0641\u0627\u0646", nameEn: "Truck / Van Permit", descAr: "\u062A\u0635\u0631\u064A\u062D \u062F\u062E\u0648\u0644 \u0634\u0627\u062D\u0646\u0629 \u0623\u0648 \u0641\u0627\u0646 \u0644\u062A\u062D\u0645\u064A\u0644/\u062A\u0641\u0631\u064A\u063A \u0627\u0644\u0628\u0636\u0627\u0626\u0639 \u2014 \u0633\u0627\u0639\u0627\u062A \u0645\u062D\u062F\u062F\u0629", descEn: "Truck/van entry permit for loading/unloading \u2014 scheduled hours", price: 500, unit: "per vehicle", unitAr: "\u0644\u0643\u0644 \u0645\u0631\u0643\u0628\u0629", rating: 4.7, deliveryDays: 1 },
      { id: "vp3", icon: Package, nameAr: "\u062A\u0635\u0631\u064A\u062D \u0625\u062F\u062E\u0627\u0644 \u0628\u0636\u0627\u0639\u0629", nameEn: "Cargo Entry Permit", descAr: "\u062A\u0635\u0631\u064A\u062D \u0625\u062F\u062E\u0627\u0644 \u0628\u0636\u0627\u0626\u0639 \u0648\u0645\u0648\u0627\u062F \u0644\u0644\u0645\u0648\u0642\u0639 \u0645\u0639 \u0642\u0627\u0626\u0645\u0629 \u0645\u062D\u062A\u0648\u064A\u0627\u062A \u0645\u0639\u062A\u0645\u062F\u0629", descEn: "Cargo entry permit with approved contents manifest", price: 150, unit: "per shipment", unitAr: "\u0644\u0643\u0644 \u0634\u062D\u0646\u0629", popular: true, rating: 4.9, deliveryDays: 0 },
      { id: "vp4", icon: AlertTriangle, nameAr: "\u062A\u0635\u0631\u064A\u062D \u0645\u0648\u0627\u062F \u062E\u0627\u0635\u0629", nameEn: "Special Materials Permit", descAr: "\u062A\u0635\u0631\u064A\u062D \u0625\u062F\u062E\u0627\u0644 \u0645\u0648\u0627\u062F \u0643\u064A\u0645\u064A\u0627\u0626\u064A\u0629 \u0623\u0648 \u0642\u0627\u0628\u0644\u0629 \u0644\u0644\u0627\u0634\u062A\u0639\u0627\u0644 \u0623\u0648 \u0645\u0639\u062F\u0627\u062A \u062B\u0642\u064A\u0644\u0629", descEn: "Permit for chemicals, flammables or heavy equipment entry", price: 800, unit: "per permit", unitAr: "\u0644\u0643\u0644 \u062A\u0635\u0631\u064A\u062D", rating: 4.5, deliveryDays: 3 },
    ],
  },
  {
    id: "access-control", icon: DoorOpen, nameAr: "\u0627\u0644\u062F\u062E\u0648\u0644 \u0648\u0627\u0644\u062E\u0631\u0648\u062C \u0648\u0627\u0644\u062A\u0639\u0645\u064A\u0645", nameEn: "Access Control & Circulation", descAr: "\u0625\u062F\u0627\u0631\u0629 \u0627\u0644\u062F\u062E\u0648\u0644 \u0648\u0627\u0644\u062E\u0631\u0648\u062C \u0648\u0627\u0644\u062A\u0639\u0645\u064A\u0645 \u0644\u0644\u0623\u0634\u062E\u0627\u0635 \u0648\u0627\u0644\u0645\u0631\u0643\u0628\u0627\u062A", descEn: "Entry/exit management and circulation for people and vehicles", color: "#10B981", tab: "permits",
    services: [
      { id: "ac1", icon: DoorOpen, nameAr: "\u062A\u0639\u0645\u064A\u0645 \u062F\u062E\u0648\u0644 \u0645\u0648\u0638\u0641\u064A\u0646", nameEn: "Staff Access Circulation", descAr: "\u062A\u0639\u0645\u064A\u0645 \u0631\u0633\u0645\u064A \u0644\u0625\u062F\u0627\u0631\u0629 \u0627\u0644\u0645\u0648\u0642\u0639 \u0628\u0623\u0633\u0645\u0627\u0621 \u0627\u0644\u0645\u0648\u0638\u0641\u064A\u0646 \u0627\u0644\u0645\u0635\u0631\u062D \u0644\u0647\u0645 \u0628\u0627\u0644\u062F\u062E\u0648\u0644", descEn: "Official circulation to venue management with authorized staff names", price: 100, unit: "per list", unitAr: "\u0644\u0643\u0644 \u0642\u0627\u0626\u0645\u0629", popular: true, rating: 4.8, deliveryDays: 0 },
      { id: "ac2", icon: UserCheck, nameAr: "\u0645\u0648\u0627\u0641\u0642\u0629 \u062F\u062E\u0648\u0644 \u0645\u0633\u0628\u0642\u0629", nameEn: "Pre-Approved Entry", descAr: "\u062A\u0633\u062C\u064A\u0644 \u0645\u0633\u0628\u0642 \u0644\u0644\u0623\u0634\u062E\u0627\u0635 \u0627\u0644\u0645\u0635\u0631\u062D \u0644\u0647\u0645 \u2014 \u064A\u0643\u0641\u064A \u0625\u0628\u0631\u0627\u0632 \u0627\u0644\u0647\u0648\u064A\u0629 \u0639\u0646\u062F \u0627\u0644\u0628\u0648\u0627\u0628\u0629", descEn: "Pre-registration for authorized persons \u2014 ID verification at gate", price: 0, unit: "free", unitAr: "\u0645\u062C\u0627\u0646\u064A", rating: 5.0, deliveryDays: 0 },
      { id: "ac3", icon: ScanLine, nameAr: "\u0646\u0638\u0627\u0645 \u0645\u0633\u062D QR \u0644\u0644\u062F\u062E\u0648\u0644", nameEn: "QR Scan Entry System", descAr: "\u0646\u0638\u0627\u0645 \u0645\u0633\u062D \u0643\u0648\u062F QR \u0639\u0646\u062F \u0627\u0644\u0628\u0648\u0627\u0628\u0629 \u0644\u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062F\u062E\u0648\u0644 \u0648\u0627\u0644\u062E\u0631\u0648\u062C \u062A\u0644\u0642\u0627\u0626\u064A\u0627\u064B", descEn: "QR code scanning system at gates for automatic check-in/out", price: 1500, unit: "per event", unitAr: "\u0644\u0643\u0644 \u0641\u0639\u0627\u0644\u064A\u0629", rating: 4.7, deliveryDays: 2 },
      { id: "ac4", icon: ClipboardList, nameAr: "\u0633\u062C\u0644 \u062F\u062E\u0648\u0644/\u062E\u0631\u0648\u062C \u064A\u0648\u0645\u064A", nameEn: "Daily Entry/Exit Log", descAr: "\u062A\u0642\u0631\u064A\u0631 \u064A\u0648\u0645\u064A \u0628\u0623\u0633\u0645\u0627\u0621 \u0648\u0623\u0648\u0642\u0627\u062A \u062F\u062E\u0648\u0644 \u0648\u062E\u0631\u0648\u062C \u062C\u0645\u064A\u0639 \u0627\u0644\u0623\u0634\u062E\u0627\u0635 \u0648\u0627\u0644\u0645\u0631\u0643\u0628\u0627\u062A", descEn: "Daily report with names and times of all person/vehicle entries and exits", price: 300, unit: "per day", unitAr: "\u0644\u0643\u0644 \u064A\u0648\u0645", rating: 4.6, deliveryDays: 0 },
      { id: "ac5", icon: KeyRound, nameAr: "\u0645\u0641\u062A\u0627\u062D / \u0643\u0648\u062F \u0648\u062D\u062F\u0629", nameEn: "Unit Key / Access Code", descAr: "\u062A\u0633\u0644\u064A\u0645 \u0645\u0641\u062A\u0627\u062D \u0623\u0648 \u0643\u0648\u062F \u062F\u062E\u0648\u0644 \u0644\u0644\u0648\u062D\u062F\u0629 \u0627\u0644\u0645\u0633\u062A\u0623\u062C\u0631\u0629 \u0645\u0639 \u0645\u062D\u0636\u0631 \u0627\u0633\u062A\u0644\u0627\u0645", descEn: "Unit key or access code delivery with handover protocol", price: 0, unit: "free", unitAr: "\u0645\u062C\u0627\u0646\u064A", rating: 5.0, deliveryDays: 0 },
    ],
  },
];

interface CartItem {
  service: Service;
  category: ServiceCategory;
  quantity: number;
}

type TabKey = "services" | "operations" | "permits";

export default function ExhibitorServices() {
  const { language, isRtl } = useLanguageStore();
  const isAr = language === 'ar';
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<TabKey>("services");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const tabs: { key: TabKey; labelAr: string; labelEn: string; icon: any; count: number }[] = [
    { key: "services", labelAr: "\u062E\u062F\u0645\u0627\u062A \u0627\u0644\u062A\u0627\u062C\u0631", labelEn: "Trader Services", icon: Package, count: serviceCategories.filter(c => c.tab === "services").reduce((s, c) => s + c.services.length, 0) },
    { key: "operations", labelAr: "\u0627\u0644\u0639\u0645\u0644\u064A\u0627\u062A \u0627\u0644\u062A\u0634\u063A\u064A\u0644\u064A\u0629", labelEn: "Operations", icon: Settings2, count: serviceCategories.filter(c => c.tab === "operations").reduce((s, c) => s + c.services.length, 0) },
    { key: "permits", labelAr: "\u0627\u0644\u062A\u0635\u0627\u0631\u064A\u062D \u0648\u0627\u0644\u0628\u0627\u062C\u0627\u062A", labelEn: "Permits & Badges", icon: KeyRound, count: serviceCategories.filter(c => c.tab === "permits").reduce((s, c) => s + c.services.length, 0) },
  ];

  const filteredCategories = useMemo(() => {
    let cats = serviceCategories.filter(c => c.tab === activeTab);
    if (selectedCategory !== "all") cats = cats.filter(c => c.id === selectedCategory);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      cats = cats.map(cat => ({ ...cat, services: cat.services.filter(s => s.nameAr.includes(q) || s.nameEn.toLowerCase().includes(q) || s.descAr.includes(q) || s.descEn.toLowerCase().includes(q)) })).filter(cat => cat.services.length > 0);
    }
    return cats;
  }, [activeTab, selectedCategory, searchQuery]);

  const tabCategories = useMemo(() => serviceCategories.filter(c => c.tab === activeTab), [activeTab]);

  const addToCart = (service: Service, category: ServiceCategory) => {
    setCart(prev => {
      const existing = prev.find(item => item.service.id === service.id);
      if (existing) return prev.map(item => item.service.id === service.id ? { ...item, quantity: item.quantity + 1 } : item);
      return [...prev, { service, category, quantity: 1 }];
    });
    toast.success(isAr ? `\u062A\u0645\u062A \u0625\u0636\u0627\u0641\u0629 "${service.nameAr}" \u0644\u0644\u0633\u0644\u0629` : `"${service.nameEn}" added to cart`);
  };

  const removeFromCart = (serviceId: string) => setCart(prev => prev.filter(item => item.service.id !== serviceId));

  const updateQuantity = (serviceId: string, delta: number) => {
    setCart(prev => prev.map(item => item.service.id === serviceId ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item));
  };

  const cartTotal = useMemo(() => cart.reduce((sum, item) => sum + item.service.price * item.quantity, 0), [cart]);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    toast.success(isAr ? `\u062A\u0645 \u0625\u0631\u0633\u0627\u0644 \u0637\u0644\u0628 \u0627\u0644\u062E\u062F\u0645\u0627\u062A (${cart.length} \u062E\u062F\u0645\u0629) \u0628\u0642\u064A\u0645\u0629 ${cartTotal.toLocaleString()} \u0631.\u0633 \u2014 \u0633\u064A\u062A\u0645 \u0627\u0644\u062A\u0648\u0627\u0635\u0644 \u0645\u0639\u0643 \u062E\u0644\u0627\u0644 24 \u0633\u0627\u0639\u0629` : `Service request sent (${cart.length} services) for ${cartTotal.toLocaleString()} SAR \u2014 we'll contact you within 24 hours`);
    setCart([]);
    setShowCart(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-gold-gradient" style={{ fontFamily: "'IBM Plex Sans Arabic', serif" }}>{isAr ? "\u062E\u062F\u0645\u0627\u062A \u0648\u0639\u0645\u0644\u064A\u0627\u062A \u0627\u0644\u062A\u0627\u062C\u0631" : "Trader Services & Operations"}</h1>
          <p className="text-xs t-tertiary mt-1">{isAr ? "\u0643\u0644 \u0645\u0627 \u062A\u062D\u062A\u0627\u062C\u0647 \u0644\u0646\u062C\u0627\u062D \u0645\u0634\u0627\u0631\u0643\u062A\u0643 \u2014 \u062E\u062F\u0645\u0627\u062A\u060C \u0639\u0645\u0644\u064A\u0627\u062A\u060C \u062A\u0635\u0627\u0631\u064A\u062D \u0648\u0628\u0627\u062C\u0627\u062A" : "Everything you need \u2014 services, operations, permits & badges"}</p>
        </div>
        <button onClick={() => setShowCart(true)} className="relative btn-gold px-4 py-2.5 rounded-xl text-sm flex items-center gap-2">
          <ShoppingCart size={16} />
          {isAr ? "\u0627\u0644\u0633\u0644\u0629" : "Cart"}
          {cart.length > 0 && <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white text-[11px] flex items-center justify-center font-bold font-['Inter']">{cart.length}</span>}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {tabs.map(tab => {
          const TabIcon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button key={tab.key} onClick={() => { setActiveTab(tab.key); setSelectedCategory("all"); setExpandedCategory(null); }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all shrink-0 ${isActive ? "btn-gold" : "glass-card hover:bg-[var(--glass-bg)] t-tertiary"}`}>
              <TabIcon size={14} />
              {isAr ? tab.labelAr : tab.labelEn}
              <span className={`text-[11px] px-1.5 py-0.5 rounded-full font-['Inter'] ${isActive ? "bg-black/20 text-white" : "bg-[var(--glass-bg)] t-muted"}`}>{tab.count}</span>
            </button>
          );
        })}
      </div>

      {/* Search & Category Filter */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute top-1/2 -translate-y-1/2 start-3 t-muted" />
          <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder={isAr ? "\u0627\u0628\u062D\u062B \u0639\u0646 \u062E\u062F\u0645\u0629..." : "Search services..."} className="w-full ps-9 pe-3 py-2.5 rounded-xl text-xs t-secondary bg-[var(--glass-bg)] border border-[var(--glass-border)] focus:outline-none gold-focus" />
        </div>
        <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)} className="bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-xl px-3 py-2.5 text-xs t-secondary focus:outline-none gold-focus">
          <option value="all" className="bg-[var(--bg-primary)] text-[var(--text-primary)]">{isAr ? "\u062C\u0645\u064A\u0639 \u0627\u0644\u0641\u0626\u0627\u062A" : "All Categories"}</option>
          {tabCategories.map(cat => <option key={cat.id} value={cat.id} className="bg-[var(--bg-primary)] text-[var(--text-primary)]">{isAr ? cat.nameAr : cat.nameEn}</option>)}
        </select>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: isAr ? "\u0641\u0626\u0627\u062A" : "Categories", value: tabCategories.length, icon: Building2 },
          { label: isAr ? "\u062E\u062F\u0645\u0627\u062A" : "Services", value: tabCategories.reduce((s, c) => s + c.services.length, 0), icon: Package },
          { label: isAr ? "\u0627\u0644\u0623\u0643\u062B\u0631 \u0637\u0644\u0628\u0627\u064B" : "Popular", value: tabCategories.reduce((s, c) => s + c.services.filter(sv => sv.popular).length, 0), icon: Star },
          { label: isAr ? "\u0641\u064A \u0627\u0644\u0633\u0644\u0629" : "In Cart", value: cart.length, icon: ShoppingCart },
        ].map((stat, i) => (
          <div key={i} className="glass-card rounded-xl p-3 text-center">
            <stat.icon size={16} className="mx-auto t-gold mb-1.5" />
            <p className="text-lg font-bold t-primary font-['Inter']">{stat.value}</p>
            <p className="text-[11px] t-tertiary">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Service Categories */}
      <div className="space-y-4">
        {filteredCategories.map(cat => {
          const CatIcon = cat.icon;
          const isExpanded = expandedCategory === cat.id || selectedCategory !== "all" || searchQuery.trim() !== "";
          return (
            <motion.div key={cat.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl overflow-hidden">
              <button onClick={() => setExpandedCategory(expandedCategory === cat.id ? null : cat.id)} className="w-full flex items-center gap-3 p-4 hover:bg-[var(--glass-bg)] transition-colors">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${cat.color}15`, border: `1px solid ${cat.color}30` }}><CatIcon size={18} style={{ color: cat.color }} /></div>
                <div className="flex-1 text-start min-w-0">
                  <h3 className="text-sm font-bold t-primary">{isAr ? cat.nameAr : cat.nameEn}</h3>
                  <p className="text-[12px] t-tertiary truncate">{isAr ? cat.descAr : cat.descEn}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[12px] t-muted font-['Inter']">{cat.services.length} {isAr ? "\u062E\u062F\u0645\u0629" : "services"}</span>
                  {isExpanded ? <ChevronUp size={14} className="t-tertiary" /> : <ChevronDown size={14} className="t-tertiary" />}
                </div>
              </button>
              <AnimatePresence>
                {isExpanded && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 pt-0">
                      {cat.services.map(service => {
                        const SvcIcon = service.icon;
                        const inCart = cart.find(item => item.service.id === service.id);
                        const isFree = service.price === 0;
                        return (
                          <div key={service.id} className="relative p-4 rounded-xl transition-all hover:bg-[var(--glass-bg)]" style={{ backgroundColor: "rgba(255,255,255,0.01)", border: "1px solid var(--glass-border)" }}>
                            {service.popular && <span className="absolute top-2 end-2 px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#C5A55A]/15 text-[#C5A55A] border border-[#C5A55A]/20">{isAr ? "\u0627\u0644\u0623\u0643\u062B\u0631 \u0637\u0644\u0628\u0627\u064B" : "Popular"}</span>}
                            <div className="flex items-start gap-3 mb-3">
                              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${cat.color}10` }}><SvcIcon size={14} style={{ color: cat.color }} /></div>
                              <div className="flex-1 min-w-0">
                                <h4 className="text-xs font-bold t-secondary">{isAr ? service.nameAr : service.nameEn}</h4>
                                <p className="text-[12px] t-tertiary mt-0.5 leading-relaxed">{isAr ? service.descAr : service.descEn}</p>
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <div>
                                {isFree ? <span className="text-sm font-bold text-green-400">{isAr ? "\u0645\u062C\u0627\u0646\u064A" : "Free"}</span> : <><span className="text-sm font-bold text-[#C5A55A] font-['Inter']">{service.price.toLocaleString()}</span><span className="text-[11px] t-tertiary ms-1">{isAr ? "\u0631.\u0633" : "SAR"} / {isAr ? service.unitAr : service.unit}</span></>}
                              </div>
                              <div className="flex items-center gap-2">
                                {service.rating && <div className="flex items-center gap-0.5"><Star size={10} className="text-[#FBBF24] fill-[#FBBF24]" /><span className="text-[11px] t-muted font-['Inter']">{service.rating}</span></div>}
                                {service.deliveryDays !== undefined && <div className="flex items-center gap-0.5"><Clock size={10} className="t-muted" /><span className="text-[11px] t-muted font-['Inter']">{service.deliveryDays === 0 ? (isAr ? "\u0641\u0648\u0631\u064A" : "Instant") : `${service.deliveryDays}d`}</span></div>}
                              </div>
                            </div>
                            <div className="mt-3 pt-3 border-t border-[var(--glass-border)]">
                              {inCart ? (
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <button onClick={() => updateQuantity(service.id, -1)} className="w-7 h-7 rounded-lg glass-card flex items-center justify-center hover:bg-[var(--glass-bg)]"><Minus size={12} className="t-secondary" /></button>
                                    <span className="text-sm font-bold t-primary font-['Inter'] w-6 text-center">{inCart.quantity}</span>
                                    <button onClick={() => updateQuantity(service.id, 1)} className="w-7 h-7 rounded-lg glass-card flex items-center justify-center hover:bg-[var(--glass-bg)]"><Plus size={12} className="t-secondary" /></button>
                                  </div>
                                  <button onClick={() => removeFromCart(service.id)} className="text-[12px] text-red-400 hover:text-red-300">{isAr ? "\u0625\u0632\u0627\u0644\u0629" : "Remove"}</button>
                                </div>
                              ) : (
                                <button onClick={() => addToCart(service, cat)} className="w-full py-2 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all hover:bg-[#C5A55A]/10 text-[#C5A55A] border border-[#C5A55A]/20">
                                  <Plus size={12} />
                                  {isFree ? (isAr ? "\u0637\u0644\u0628 \u0645\u062C\u0627\u0646\u064A" : "Request Free") : (isAr ? "\u0623\u0636\u0641 \u0644\u0644\u0633\u0644\u0629" : "Add to Cart")}
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Contact Banner */}
      <div className="glass-card rounded-2xl p-5">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="w-12 h-12 rounded-xl bg-[#C5A55A]/10 flex items-center justify-center shrink-0"><Headphones size={22} className="text-[#C5A55A]" /></div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold t-primary">{isAr ? "\u062A\u062D\u062A\u0627\u062C \u062E\u062F\u0645\u0629 \u0645\u062E\u0635\u0635\u0629\u061F" : "Need a Custom Service?"}</h3>
            <p className="text-[12px] t-tertiary mt-0.5">{isAr ? "\u062A\u0648\u0627\u0635\u0644 \u0645\u0639\u0646\u0627 \u0648\u0633\u0646\u0648\u0641\u0631 \u0644\u0643 \u0643\u0644 \u0645\u0627 \u062A\u062D\u062A\u0627\u062C\u0647" : "Contact us and we'll provide everything you need"}</p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <a href="tel:00966535555900" className="flex items-center gap-1.5 px-3 py-2 rounded-lg glass-card text-[12px] t-secondary hover:text-[#C5A55A] transition-colors"><Phone size={12} /><span className="font-['Inter']">00966535555900</span></a>
            <a href="mailto:rent@mahamexpo.sa" className="flex items-center gap-1.5 px-3 py-2 rounded-lg glass-card text-[12px] t-secondary hover:text-[#C5A55A] transition-colors"><Mail size={12} /><span>rent@mahamexpo.sa</span></a>
          </div>
        </div>
      </div>

      {/* Cart Drawer */}
      <AnimatePresence>
        {showCart && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" style={{ backgroundColor: "var(--modal-overlay)" }} onClick={() => setShowCart(false)}>
            <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="glass-card rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="sticky top-0 z-10 p-4 border-b border-[var(--glass-border)]" style={{ backgroundColor: "var(--bg-primary)" }}>
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold t-primary flex items-center gap-2"><ShoppingCart size={16} className="t-gold" />{isAr ? "\u0633\u0644\u0629 \u0627\u0644\u062E\u062F\u0645\u0627\u062A" : "Service Cart"}<span className="text-[12px] t-muted font-['Inter']">({cart.length})</span></h3>
                  <button onClick={() => setShowCart(false)} className="glass-card p-1.5 rounded-full"><X size={14} className="t-secondary" /></button>
                </div>
              </div>
              {cart.length === 0 ? (
                <div className="p-8 text-center">
                  <ShoppingCart size={40} className="mx-auto t-muted mb-3" />
                  <p className="text-sm t-tertiary">{isAr ? "\u0627\u0644\u0633\u0644\u0629 \u0641\u0627\u0631\u063A\u0629" : "Cart is empty"}</p>
                  <p className="text-[12px] t-muted mt-1">{isAr ? "\u0623\u0636\u0641 \u062E\u062F\u0645\u0627\u062A \u0645\u0646 \u0627\u0644\u0642\u0627\u0626\u0645\u0629 \u0623\u0639\u0644\u0627\u0647" : "Add services from the list above"}</p>
                </div>
              ) : (
                <>
                  <div className="p-4 space-y-3">
                    {cart.map(item => (
                      <div key={item.service.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: "var(--glass-bg)", border: "1px solid var(--glass-border)" }}>
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${item.category.color}10` }}><item.service.icon size={14} style={{ color: item.category.color }} /></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold t-secondary truncate">{isAr ? item.service.nameAr : item.service.nameEn}</p>
                          <p className="text-[11px] t-muted font-['Inter']">{item.service.price === 0 ? (isAr ? "\u0645\u062C\u0627\u0646\u064A" : "Free") : `${item.service.price.toLocaleString()} ${isAr ? "\u0631.\u0633" : "SAR"} \u00D7 ${item.quantity}`}</p>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button onClick={() => updateQuantity(item.service.id, -1)} className="w-6 h-6 rounded glass-card flex items-center justify-center"><Minus size={10} className="t-secondary" /></button>
                          <span className="text-xs font-bold t-primary font-['Inter'] w-4 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.service.id, 1)} className="w-6 h-6 rounded glass-card flex items-center justify-center"><Plus size={10} className="t-secondary" /></button>
                          <button onClick={() => removeFromCart(item.service.id)} className="ms-1 w-6 h-6 rounded flex items-center justify-center text-red-400/60 hover:text-red-400"><X size={12} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="sticky bottom-0 p-4 border-t border-[var(--glass-border)]" style={{ backgroundColor: "var(--bg-primary)" }}>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-bold t-primary">{isAr ? "\u0627\u0644\u0625\u062C\u0645\u0627\u0644\u064A" : "Total"}</span>
                      <span className="text-lg font-bold text-[#C5A55A] font-['Inter']">{cartTotal.toLocaleString()} <span className="text-xs">{isAr ? "\u0631.\u0633" : "SAR"}</span></span>
                    </div>
                    <button onClick={handleCheckout} className="w-full btn-gold py-3 rounded-xl text-sm flex items-center justify-center gap-2 font-bold"><CreditCard size={14} />{isAr ? "\u0625\u0631\u0633\u0627\u0644 \u0637\u0644\u0628 \u0627\u0644\u062E\u062F\u0645\u0627\u062A" : "Submit Service Request"}</button>
                    <p className="text-[11px] t-muted text-center mt-2">{isAr ? "\u0633\u064A\u062A\u0645 \u0627\u0644\u062A\u0648\u0627\u0635\u0644 \u0645\u0639\u0643 \u062E\u0644\u0627\u0644 24 \u0633\u0627\u0639\u0629 \u0644\u062A\u0623\u0643\u064A\u062F \u0627\u0644\u0637\u0644\u0628 \u0648\u0627\u0644\u062F\u0641\u0639" : "We'll contact you within 24 hours to confirm and process payment"}</p>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
