FactoryGirl.define do
  factory :email do
    user nil
    to "MyString"
    subject "MyString"
    payload "MyString"
  end
end
