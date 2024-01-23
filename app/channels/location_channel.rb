# frozen_string_literal: true

class LocationChannel < ApplicationCable::Channel
  def subscribed
    stream_for(location)
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
    broadcast_to(location, { event: 'clientConnected', **data })
    Turbo::StreamsChannel.broadcast_prepend_to('flash', partial: 'layouts/flash',
                                                        locals: { flash: { notice: 'JOINED' } }, target: 'quotes')
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
  end

  private

  def channel_name
    "location_#{location.key}"
  end

  def location
    @location ||= Location.find_by!(key: params[:key])
  end
end
