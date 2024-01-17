class LocationChannel < ApplicationCable::Channel
  def subscribed
    location = Location.find_by!(key: params[:key])
    location.increment!(:client_count)
    stream_for("location")
  end

  def unsubscribed
    location = Location.find_by!(key: params[:key])
    location.decrement!(:client_count)
  end

  def receive(data)
    location = Location.find_by!(key: params[:key])
    ActionCable.server.broadcast(location, data)
  end
end
