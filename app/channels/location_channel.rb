class LocationChannel < ApplicationCable::Channel
  def subscribed
    location = Location.find_by!(key: params[:key])
    ActionCable.server.broadcast(location, { event: "clientConnected", client: client, client_count: location.client_count })
    stream_for(location)
  end

  def addClient(data)
  end

  def receive(data)
    ActionCable.server.broadcast(location, data)
  end

  def unsubscribed
    client.destroy()
    location.decrement!(:client_count)
    ActionCable.server.broadcast(location, { event: "clientDisconnected", client: client, client_count: location.client_count })
  end

  private

  def location
    @location ||= Location.find_by!(key: params[:key])
  end

  def client
    @client ||= location.clients.find_by!(uuid: params[:uuid])
  end
end
