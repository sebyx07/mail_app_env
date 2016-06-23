class EmailResource < JSONAPI::Resource
  attributes :subject, :created_at, :payload, :to

  def self.records(options = {})
    context = options[:context]
    context[:current_user].emails
  end

  before_save do
    @model.user_id = context[:current_user].id if @model.new_record?
  end

  has_one :user
end
