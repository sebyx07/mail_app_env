class UsersController < ApplicationController
  def _session
    if current_user
      _render_user(current_user)
    else
      render_not_found
    end
  end

  def login
    user = User.find_by(email_address: params[:email])
    if user && user.authenticate(params[:password])
      session[:user_id] = user.id
      _render_user(user)
    else
      render_error
    end
  end

  def logout
    session[:user_id] = nil
    render_nothing
  end


  def _render_user(user)
    render json: JSONAPI::ResourceSerializer
                    .new(UserResource)
                    .serialize_to_hash(UserResource.new(user, nil))
  end
end
