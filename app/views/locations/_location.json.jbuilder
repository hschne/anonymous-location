# frozen_string_literal: true

json.extract! location, :id, :key, :name, :expiry, :expires_at, :location, :client_count, :created_at, :updated_at
json.url location_url(location, format: :json)
