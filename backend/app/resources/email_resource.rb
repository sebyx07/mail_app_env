class EmailResource < JSONAPI::Resource
  attributes :subject, :created_at, :payload
end
