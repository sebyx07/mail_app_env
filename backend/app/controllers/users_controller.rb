class UsersController < JSONAPI::ResourceController
  def _session
    _render_user(current_user)
  end

  def login
    user = User.find_by(username: params[:username])
    if user && user.authenticate(params[:password])
      session[:user_id] = user.id
      _render_user(user)
    else
      render_error
    end
  end

  def logout
    session[:user_id] = nil
    render :nothing
  end


  def _render_user(user)
    render json: JSONAPI::ResourceSerializer
                    .new(UserResource)
                    .serialize_to_hash(UserResource.new(user, nil))
  end
end
