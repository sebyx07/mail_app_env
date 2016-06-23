class UserResource < JSONAPI::Resource
  attributes :email_address, :name

  has_many :emails
end
