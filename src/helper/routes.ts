type api_routes = {
  login: string;
  login_phone: string;
  login_phone_otp: string;
  login_phone_otp_local: string;
  login_phone_otp_web: string;
  login_phone_otp_auto_read: string;
  login_phone_password: string;
  logout: string;
  register: string;
  forgot_password: string;
  global_search: string;
  reset_password: string;
  email_verify: string;
  enquiry: string;
  promotion: string;
  products: string;
  categories: string;
  sub_categories: string;
  home_page_banner: string;
  about_section: string;
  partner: string;
  testimonial: string;
  blog: string;
  profile: string;
  profile_update: string;
  password_update: string;
  website_detail: string;
  wishlist_paginate: string;
  wishlist_all: string;
  wishlist_create: string;
  wishlist_update: string;
  wishlist_delete: string;
  cart_paginate: string;
  cart_all: string;
  cart_create: string;
  cart_update: string;
  cart_delete: string;
  billing_address_list: string;
  billing_address_all: string;
  billing_address_create: string;
  billing_address_update: string;
  billing_address_delete: string;
  billing_information_all: string;
  billing_information_list: string;
  billing_information_create: string;
  billing_information_update: string;
  billing_information_delete: string;
  delivery_slot: string;
  cart: string;
  rating: string;
  coupon_apply: string;
  coupon_remove: string;
  place_order: string;
  place_order_paginate: string;
  place_order_paginate_success: string;
  latest_order_item: string;
  place_order_detail: string;
  place_order_detail_success: string;
  place_order_enquiry: string;
  legal: string;
  feature: string;
  counter: string;
  map_autocomplete: string;
  map_reverse: string;
};

export const api_routes: api_routes = {
  login: "/api/v1/auth/login",
  login_phone: "/api/v1/auth/login-phone",
  login_phone_otp: "/api/v1/auth/login-phone-otp",
  login_phone_otp_local: "/api/v1/auth/login-phone-otp-local",
  login_phone_otp_web: "/api/v1/auth/login-phone-otp-web",
  login_phone_otp_auto_read: "/api/v1/auth/login-phone-otp-auto-read",
  login_phone_password: "/api/v1/auth/login-phone-password",
  logout: "/api/v1/auth/logout",
  register: "/api/v1/auth/register",
  forgot_password: "/api/v1/auth/forgot-password",
  reset_password: "/api/v1/auth/reset-password",
  email_verify: "/api/v1/email/verify/resend-notification",
  enquiry: "/api/v1/contact-form",
  promotion: "/api/v1/promotion",
  products: "/api/v1/product",
  categories: "/api/v1/category",
  sub_categories: "/api/v1/sub-category",
  home_page_banner: "/api/v1/home-page-banner",
  about_section: "/api/v1/about-section",
  partner: "/api/v1/partner",
  testimonial: "/api/v1/testimonial",
  blog: "/api/v1/blog",
  profile: "/api/v1/profile",
  profile_update: "/api/v1/profile/update",
  password_update: "/api/v1/profile/update-password",
  website_detail: "/api/v1/website-detail",
  wishlist_paginate: "/api/v1/wishlist",
  wishlist_all: "/api/v1/wishlist/all",
  wishlist_create: "/api/v1/wishlist/create",
  wishlist_update: "/api/v1/wishlist/update",
  wishlist_delete: "/api/v1/wishlist/delete",
  cart_paginate: "/api/v1/cart",
  cart_all: "/api/v1/cart/all",
  cart_create: "/api/v1/cart/create",
  cart_update: "/api/v1/cart/update",
  cart_delete: "/api/v1/cart/delete",
  billing_address_list: "/api/v1/billing-address",
  billing_address_all: "/api/v1/billing-address/all",
  billing_address_create: "/api/v1/billing-address/create",
  billing_address_update: "/api/v1/billing-address/update",
  billing_address_delete: "/api/v1/billing-address/delete",
  billing_information_all: "/api/v1/billing-information/all",
  billing_information_list: "/api/v1/billing-information",
  billing_information_create: "/api/v1/billing-information/create",
  billing_information_update: "/api/v1/billing-information/update",
  billing_information_delete: "/api/v1/billing-information/delete",
  delivery_slot: "/api/v1/delivery-slot",
  cart: "/api/v1/cart",
  rating: "/api/v1/product/main/reviews",
  coupon_apply: "/api/v1/coupon/apply",
  coupon_remove: "/api/v1/coupon/remove",
  place_order: "/api/v1/order/place",
  place_order_paginate: "/api/v1/order",
  place_order_paginate_success: "/api/v1/order/placed-paginate",
  latest_order_item: "/api/v1/order/latest-product-item",
  place_order_detail: "/api/v1/order/detail",
  place_order_detail_success: "/api/v1/order/placed-detail",
  place_order_enquiry: "/api/v1/order/enquiry",
  legal: "/api/v1/legal",
  feature: "/api/v1/feature",
  counter: "/api/v1/counter",
  global_search: "/api/v1/search",
  map_autocomplete: "/api/v1/map/autocomplete",
  map_reverse: "/api/v1/map/reverse",
};
