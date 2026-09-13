export type EventCategory =
  | 'system'
  | 'auth'
  | 'arena'
  | 'bootcamp'
  | 'commerce'
  | 'engagement'
  | 'error';

export type EventName =
  | 'page_view'
  | 'session_start'
  | 'signup_started'
  | 'signup_completed'
  | 'login_started'
  | 'login_completed'
  | 'logout'
  | 'arena_prd_viewed'
  | 'daily_log_submitted'
  | 'roadmap_viewed'
  | 'bootcamp_viewed'
  | 'bootcamp_registered'
  | 'workshop_pass_purchased'
  | 'coupon_applied'
  | 'karma_earned'
  | 'newsletter_subscribed'
  | 'certificate_verified'
  | 'search_performed'
  | 'application_error'
  | 'api_error';

export interface BaseEventProperties {
  page_title?: string;
  page_location?: string;
  page_path?: string;
  referrer?: string;
  user_id?: string;
  anonymous_id?: string;
  user_role?: string;
  timestamp?: number;
  [key: string]: any;
}

export interface PageViewProperties extends BaseEventProperties {
  page_title: string;
  page_path: string;
}

export interface AuthEventProperties extends BaseEventProperties {
  method?: string;
  user_type?: string;
  success?: boolean;
}

export interface ArenaEventProperties extends BaseEventProperties {
  project_id?: string;
  project_title?: string;
  difficulty?: string;
  team_type?: string;
}

export interface BootcampEventProperties extends BaseEventProperties {
  bootcamp_id?: string;
  bootcamp_name?: string;
  amount_paid?: number;
  coupon_used?: string;
}

export interface SearchEventProperties extends BaseEventProperties {
  search_query: string;
  results_count?: number;
  category?: string;
}

export interface ErrorEventProperties extends BaseEventProperties {
  error_type: string;
  error_message: string;
  route?: string;
  stack?: string;
}
