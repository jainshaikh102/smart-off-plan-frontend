// Basic Property types
export interface Property {
  id: string;
  name: string;
  area: string;
  area_unit: string;
  cover_image_url: string;
  developer: string;
  is_partner_project: boolean;
  min_price: number;
  max_price: number;
  price_currency: string;
  sale_status: string;
  status: string;
}

// Basic Developer type
export interface Developer {
  id: string;
  name: string;
  description?: string;
  logo?: string;
}

// Basic Contact form type
export interface ContactForm {
  name: string;
  email: string;
  phone: string;
  message: string;
}
