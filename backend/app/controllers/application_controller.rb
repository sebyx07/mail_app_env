class ApplicationController < JSONAPI::ResourceController
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  #protect_from_forgery with: :exception

  def current_user
    User.find_by(id: session[:user_id])
  end

  def render_error
    render nothing: true, status: 422
  end

  def render_nothing
    render nothing: true
  end

  def render_not_found
    render nothing: true, status: 404
  end

  protected :current_user, :render_error, :render_nothing
end
