# frozen_string_literal: true

# == Schema Information
#
# Table name: locations
#
#  id           :integer          not null, primary key
#  client_count :integer          default(0), not null
#  expires_at   :datetime         not null
#  expiry       :integer          not null
#  key          :string           not null
#  location     :string           not null
#  name         :string           not null
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#
# Indexes
#
#  index_locations_on_key  (key) UNIQUE
#
FactoryBot.define do
  factory :location do
    sequence(:key) { |i| "random-key-#{i}" }
    name { 'MyString' }
    expiry { 60 }
    expires_at { 60.minutes.from_now }
    location { '000.000,000.000' }
    client_count { 0 }
  end
end
