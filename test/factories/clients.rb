# frozen_string_literal: true

# == Schema Information
#
# Table name: clients
#
#  id          :integer          not null, primary key
#  color       :string           not null
#  coordinates :string           not null
#  name        :string           not null
#  uuid        :string           not null
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  location_id :integer          not null
#
# Indexes
#
#  index_clients_on_location_id  (location_id)
#
# Foreign Keys
#
#  location_id  (location_id => locations.id)
#
FactoryBot.define do
  factory :client do
    name { 'MyString' }
    color { 'MyString' }
    coordinates { 'MyString' }
    location { nil }
  end
end
