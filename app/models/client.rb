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
class Client < ApplicationRecord
  COLORS = {
    stone: '#78716c',
    red: '#ef4444',
    orange: '#f97316',
    amber: '#f59e0b',
    yellow: '#eab308',
    green: '#15803d',
    lime: '#84cc16',
    emerald: '#22c55e',
    teal: '#10b981',
    cyan: '#14b8a6',
    sky: '#0ea5e9',
    blue: '#3b82f6',
    indigo: '#6366f1',
    violet: '#8b5cf6',
    purple: '#a855f7',
    fuchsia: '#d946ef',
    pink: '#ec4899',
    rose: '#f43f5e'
  }.freeze

  before_validation do |record|
    record.name = Client::COLORS.invert[record.color].to_s.capitalize if record.name.blank?
  end
  belongs_to :location, optional: true

  validates :name, :color, :uuid, presence: true

  validates :coordinates, presence: { message: 'could not be determined. Please enable location services.' }
end
