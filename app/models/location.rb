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
class Location < ApplicationRecord
  before_validation do |record|
    record.expires_at = record.expiry.minutes.from_now unless record.expires_at.present?
    record.key = Location.generate_key unless record.key.present?
  end

  has_many :clients, dependent: :destroy

  validates :key, presence: true
  validates :expiry, presence: true, numericality: { greater_than_or_equal_to: 0, less_than_or_equal_to: 180 }
  validates :expires_at, presence: true
  validates :location, presence: true

  def minutes_left
    ((expires_at - Time.zone.now) / 1.minute).to_i
  end

  def to_param
    key
  end

  def self.generate_key
    ids = (1..3).map { (1..5).map { rand(1..6) }.join.to_i }
    DiceWord
      .find(*ids)
      .map(&:words)
      .map(&:split)
      .map { |t| t[rand(0..t.length - 1)] }.flatten.join("-")
  end
end
