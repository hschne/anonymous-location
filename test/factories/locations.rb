FactoryBot.define do
  factory :location do
    sequence(:key) { |i| "random-key-#{i}" }
    name { "MyString" }
    expiry { 60 }
    expires_at { 60.minutes.from_now }
    location { "000.000,000.000" }
    client_count { 0 }
  end
end
