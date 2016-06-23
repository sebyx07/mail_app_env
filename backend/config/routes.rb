Rails.application.routes.draw do
  get '/users/current_user', to: 'users#_session'

  jsonapi_resources :users
end
