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
require "test_helper"

class LocationTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
