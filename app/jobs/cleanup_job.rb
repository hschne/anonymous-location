# frozen_string_literal: true

class CleanupJob < ApplicationJob
  queue_as :default

  def perform
    Location.where(expires_at: (..Time.zone.now)).destroy_all
  end
end
