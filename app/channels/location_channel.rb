# frozen_string_literal: true

class LocationChannel < ApplicationCable::Channel
  def subscribed
    stream_from(channel_name)
  end

  # Data is a hash with the following keys:
  #  - uuid
  #  - name
  #  - coordinates
  #  - color
  def appear(data)
    data.except!('action')
    location.clients.create!(**data)
    location.increment(:client_count)
    ActionCable.server.broadcast(channel_name, { event: 'clientConnected', **data })
  end

  def receive(data)
    ActionCable.server.broadcast(channel_name, { event: 'clientMoved', uuid:, coordinates: data['coordinates'] })
  end

  def unsubscribed
    client = location.clients.find_by(uuid:)
    if client
      client.destroy
      location.decrement(:client_count)
    end
    ActionCable.server.broadcast(channel_name, { event: 'clientDisconnected', uuid: })
  end

  private

  def channel_name
    "location_#{location.key}"
  end

  def location
    @location ||= Location.find_by!(key: params[:key])
  end
end
