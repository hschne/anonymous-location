# frozen_string_literal: true

class LocationChannel < ApplicationCable::Channel
  def subscribed
    stream_for(location)
  end

  def receive(data)
    broadcast_to(location, { event: 'clientMoved', uuid:, coordinates: data['coordinates'] })
  end

  def unsubscribed
    client = location.clients.find_by(uuid:)
    if client
      client.destroy
      location.decrement(:client_count)
    end
    broadcast_to(location, { event: 'clientDisconnected', uuid: })
    Turbo::StreamsChannel
      .broadcast_prepend_to(
        location,
        partial: 'layouts/flash',
        locals: { flash: { notice: "#{client.name} disconnected" } },
        target: 'flash'
      )
  end

  private

  def channel_name
    "location_#{location.key}"
  end

  def location
    @location ||= Location.find_by!(key: params[:key])
  end
end
