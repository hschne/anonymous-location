class ClientsController < ApplicationController
  before_action :set_location

  def create
    @client = @location.clients.build(client_params)

    respond_to do |format|
      if @client.save
        LocationChannel.broadcast_to(@location, { event: 'clientConnected', **client_params })
        Turbo::StreamsChannel.broadcast_prepend_to(@location, partial: 'layouts/flash',
                                                              locals: { flash: { notice: "#{@client.name} joined this location" } }, target: 'flash')
        format.html { redirect_to location_url(@location), notice: 'You joined this location.' }
        format.turbo_stream { flash.now[:notice] = 'You joined this location.' }
      else
        flash.now[:alert] = @client.errors.full_messages.join(', ')
        format.html { render :new, status: :unprocessable_entity }
        format.turbo_stream
      end
    end
  end

  private

  def set_location
    @location = Location.find_by!(key: params[:location_id])
  end

  def client_params
    params.require(:client).permit(:name, :color, :coordinates, :uuid)
  end
end
