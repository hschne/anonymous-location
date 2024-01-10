# frozen_string_literal: true

Rails.application.routes.draw do
  resources :locations
  root "application#home"

  resources :locations, except: %i[index]

  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Preview error pages
  get "/errors/404", to: "errors#not_found"
  get "/errors/500", to: "errors#internal_server_error"

  match "/404", to: "errors#not_found", via: :all
  match "/500", to: "errors#internal_server_error", via: :all

  # Defines the root path route ("/")
  # root "posts#index"
end
