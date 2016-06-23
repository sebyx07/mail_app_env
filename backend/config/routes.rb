Rails.application.routes.draw do
  get '/users/current_user', to: 'users#_session'
  post '/users/login', to: 'users#login'
  post 'users/logout', to: 'users#logout'

  jsonapi_resources :users
  jsonapi_resources :emails
end
