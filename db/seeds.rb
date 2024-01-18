# frozen_string_literal: true

# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end
def import_dicewords
  words = File.readlines('lib/assets/dice_words.txt', chomp: true).map do |line|
    /^(?<die_rolls>[123456]{5})\s+(?<words>.*)$/ =~ line
    { id: die_rolls, words: }
  end
  DiceWord.insert_all(words) # rubocop:disable Rails/SkipsModelValidations
end

import_dicewords unless DiceWord.any?

def create_dummy_location
  location = Location.create(
    key: 'dummy-dummy-dummy',
    name: 'Vienna',
    expiry: 60,
    expires_at: 10.years.from_now,
    location: '16.37252,48.20881',
    client_count: 0
  )
  location.clients.create(
    uuid: SecureRandom.uuid,
    name: 'Blue',
    color: '#1d4ed8',
    coordinates: '16.37146,48.20807'
  )
  location.clients.create(
    uuid: SecureRandom.uuid,
    name: 'Red',
    color: '#b91c1c',
    coordinates: '16.3705,48.2103'
  )
  location.clients.create(
    uuid: SecureRandom.uuid,
    name: 'Green',
    color: '#15803d',
    coordinates: '16.37398,48.20864'
  )
  location.clients.create(
    uuid: SecureRandom.uuid,
    name: 'Amber',
    color: '#b45309',
    coordinates: '16.37374,48.21034'
  )
  location.clients.create(
    uuid: SecureRandom.uuid,
    name: 'Purple',
    color: '#7e22ce',
    coordinates: '16.3773,48.20865'
  )
end

create_dummy_location unless Location.find_by(key: 'dummy-dummy-dummy')
