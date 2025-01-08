import { ReactNode } from "react";

export interface BannerType<> {
  id: number;
  title: string;
  description: string;
  button_link: string;
  button_text: string;
  banner_image_alt: string;
  banner_image_title: string;
  banner_image: string;
  is_draft: boolean;
  created_at: string;
  updated_at: string;
}

export interface AboutSectionType<> {
  id: number;
  slug: string;
  description: string | TrustedHTML;
  heading: string;
  description_unfiltered: string;
  image: string;
  created_at: string;
  updated_at: string;
}

export interface PartnerType<> {
  id: number;
  image_alt: string;
  image_title: string;
  image: string;
  is_draft: boolean;
  created_at: string;
  updated_at: string;
}

export interface PartnerResponseType<> {
  message: string;
  partner: PartnerType[];
}

export interface TestimonialType<> {
  id: number;
  star: number;
  name: string;
  message: string;
  designation: string;
  image: string;
  is_draft: boolean;
  created_at: string;
  updated_at: string;
}

export interface TestimonialResponseType<> {
  message: string;
  testimonial: TestimonialType[];
}

export interface BlogType<> {
  id: number;
  slug: string;
  description: string | TrustedHTML;
  heading: string;
  name: string;
  description_unfiltered: string;
  image: string;
  meta_description: string;
  meta_keywords: string;
  meta_title: string;
  is_draft: boolean;
  is_popular: boolean;
  created_at: string;
  updated_at: string;
}

export interface MetaLinkType<> {
  active: boolean;
  url: string | null;
  label: string;
}

export interface MetaType<> {
  current_page: number | null;
  from: number | null;
  last_page: number | null;
  per_page: number | null;
  to: number | null;
  total: number | null;
  path: string | null;
  links: MetaLinkType[] | null;
}

export interface BlogResponseType<> {
  meta: MetaType;
  data: BlogType[];
}

export interface CategoryType<> {
  id: number;
  slug: string;
  description: string | TrustedHTML;
  heading: string;
  name: string;
  description_unfiltered: string;
  image: string;
  meta_description: string;
  meta_keywords: string;
  meta_title: string;
  is_draft: boolean;
  created_at: string;
  updated_at: string;
  sub_categories: SubCategoryType[];
}

export interface CategoryResponseType<> {
  meta: MetaType;
  data: CategoryType[];
}

export interface SubCategoryType<> {
  id: number;
  slug: string;
  description: string | TrustedHTML;
  heading: string;
  name: string;
  description_unfiltered: string;
  image: string;
  meta_description: string;
  meta_keywords: string;
  meta_title: string;
  is_draft: boolean;
  created_at: string;
  updated_at: string;
}

export interface SubCategoryResponseType<> {
  meta: MetaType;
  data: SubCategoryType[];
}

export interface ProductSpecificationType<> {
  id: number;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface ProductColorType<> {
  id: number;
  name: string;
  code: string|null;
  created_at: string;
  updated_at: string;
}

export interface ProductImageType<> {
  id: number;
  image: string;
  image_title: string;
  image_alt: string;
  created_at: string;
  updated_at: string;
}

export interface ProductPriceType<> {
  id: number;
  discount: number;
  discount_in_price: number;
  min_quantity: number;
  price: number;
  created_at: string;
  updated_at: string;
}

export interface ProductType<> {
  id: number;
  slug: string;
  description: string | TrustedHTML;
  short_description: string;
  brief_description: string;
  name: string;
  description_unfiltered: string;
  image: string;
  meta_description: string;
  meta_keywords: string;
  meta_title: string;
  is_draft: boolean;
  is_new: boolean;
  is_on_sale: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
  cart_quantity_specification: string;
  cart_quantity_interval: number;
  min_cart_quantity: number;
  sub_categories: SubCategoryType[];
  categories: CategoryType[];
  product_specifications: ProductSpecificationType[];
  product_colors: ProductColorType[];
  product_prices: ProductPriceType[];
  product_images: ProductImageType[];
}

export interface ProductResponseType<> {
  meta: MetaType;
  data: ProductType[];
}

export type ProductReviewType = {
  id: number;
  rating: number;
  user_name: string;
  comment: string|null;
  created_at: string;
}

export interface ProductReviewResponseType<> {
  meta: MetaType;
  data: ProductReviewType[];
}

export interface ChildrenType<> {
  children: ReactNode;
}

export interface WishlistType<> {
  product: ProductType;
  created_at: string;
  updated_at: string;
  id: number;
}

export interface CartType<> {
  product: ProductType;
  product_price: ProductPriceType;
  created_at: string;
  updated_at: string;
  id: number;
  quantity: number;
  amount: number;
  color: string|null;
}

export interface CartChargeType<> {
  created_at: string;
  updated_at: string;
  charges_slug: string;
  charges_name: string;
  id: number;
  charges_in_amount: number;
  include_charges_for_cart_price_below: number;
  total_charge_in_amount: number;
  is_active: boolean;
  is_percentage: boolean;
}

export interface CartTaxType<> {
  created_at: string;
  updated_at: string;
  tax_name: string;
  tax_slug: string;
  id: number;
  tax_in_percentage: number;
}

export interface CartCouponType<> {
  created_at: string;
  updated_at: string;
  code: string;
  description: string;
  name: string;
  id: number;
  discount: number;
  maximum_discount_in_price: number | null;
  maximum_number_of_use: number | null;
  minimum_cart_value: number | null;
}

export interface LegalType<> {
  id: number;
  heading: string;
  description: string | TrustedHTML;
  description_unfiltered: string;
  page_name: string;
  slug: string;
  is_draft: boolean;
  created_at: string;
  updated_at: string;
  meta_description: string;
  meta_keywords: string;
  meta_title: string;
}

export interface LegalResponseType<> {
  message: string;
  legal: LegalType[];
}

export interface FeatureType<> {
  id: number;
  title: string;
  description: string;
  image: string;
  is_draft: boolean;
  created_at: string;
  updated_at: string;
}

export interface FeatureResponseType<> {
  message: string;
  feature: FeatureType[];
}

export interface CounterType<> {
  id: number;
  title: string;
  counter: number;
  is_draft: boolean;
  created_at: string;
  updated_at: string;
}

export interface CounterResponseType<> {
  message: string;
  counter: CounterType[];
}

export interface WebsiteSettingType<> {
  id: number;
  email: string;
  facebook: string;
  address: string;
  instagram: string;
  linkedin: string;
  youtube: string;
  website_favicon: string;
  website_footer_logo: string;
  website_logo: string;
  website_logo_alt: string;
  website_logo_title: string;
  website_name: string;
  phone: number;
  created_at: string;
  updated_at: string;
}
export interface BillingAddressType<> {
  id: number;
  city: string;
  state: string;
  address: string;
  country: string;
  pin: number;
  map_information: OlaAddres | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DeliverySlotNewType<> {
  id: number;
  name: string;
  is_cod_allowed: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface BillingInformationType<> {
  id: number;
  name: string;
  email: string;
  phone: number;
  gst: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface OrderChargeType<> {
  created_at: string;
  updated_at: string;
  charges_slug: string;
  charges_name: string;
  id: number;
  charges_in_amount: number;
  include_charges_for_cart_price_below: number;
  total_charge_in_amount: number;
  is_percentage: boolean;
}

export interface OrderStatusType<> {
  created_at: string;
  updated_at: string;
  status: string;
  id: number;
}

export interface OrderProductType<> {
  id: number;
  amount: number;
  discount: number;
  discount_in_price: number;
  min_quantity: number;
  price: number;
  quantity: number;
  slug: string;
  brief_description: string;
  name: string;
  image: string;
  unit: string;
  created_at: string;
  updated_at: string;
}

export interface OrderType<> {
  id: number;
  name: string;
  email: string;
  phone: number;
  city: string;
  state: string;
  address: string;
  country: string;
  pin: number;
  coupon_code: string;
  coupon_description: string;
  coupon_name: string;
  coupon_discount: number;
  coupon_maximum_discount_in_price: number | null;
  coupon_maximum_number_of_use: number | null;
  coupon_minimum_cart_value: number | null;
  discount_price: number;
  subtotal: number;
  tax_in_percentage: number;
  tax_name: string;
  tax_slug: string;
  total_charges: number;
  total_price: number;
  total_tax: number;
  created_at: string;
  updated_at: string;
  charges: OrderChargeType[];
  statuses: OrderStatusType[];
  products: OrderProductType[];
  payment: {
    mode: string;
    status: string;
    created_at: string;
    updated_at: string;
    id: number;
  };
}

export interface GlobalSearchType<> {
  id: number;
  slug: string;
  name: string;
  search_type: string;
  image: string;
}

export interface GlobalSearchResponseType<> {
  meta: MetaType;
  data: GlobalSearchType[];
}
export interface OrderResponseType<> {
  meta: MetaType;
  data: OrderType[];
}

export interface WebsiteSettingResponseType<> {
  general: WebsiteSettingType;
  message: string;
}

export interface BillingInformationResponseType<> {
  data: BillingInformationType[];
  message: string;
}

export interface DeliverySlotNewResponseType<> {
  delivery_slot: DeliverySlotNewType[];
  message: string;
}

export interface BillingAddressResponseType<> {
  data: BillingAddressType[];
  message: string;
}

export interface AuthType<> {
  authenticated: boolean;
  token: string;
  token_type: string;
  user?: UserType;
}

export interface UserType<> {
  id: number;
  email: string;
  name: string;
  phone: string;
  verified: string;
  roles: RoleType[];
}

export interface RoleType<> {
  id: number;
  name: string;
  permissions: string[];
  created_at: string;
  updated_at: string;
}

export type OlaAddres = {
  description: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
};

export interface MapAddressResponse<> {
  address: {
    label: string;
    countryCode: string;
    countryName: string;
    county: string;
    district: string;
    postalCode: string;
    stateCode: string;
    state: string;
    city: string;
    street: string;
    subdistrict: string;
  };
  distance: number;
  id: string;
  mapView: {
    west: number;
    south: number;
    east: number;
    north: number;
  };
  position: {
    lat: number;
    lng: number;
  };
  resultType: string;
  title: string;
}
