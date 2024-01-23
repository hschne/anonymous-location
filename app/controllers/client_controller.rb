class ClientController < ApplicationController
  def create
    @client = location.clients.build(client_params)

    respond_to do |format|
      if @client.save
        LocationChannel.broadcast_to(location, { event: 'clientConnected', **client_params })
        head(:ok)
      else
        format.html { render :new, status: :unprocessable_entity }
      end
    end
  end

  private

  def set_location
    @location = Location.find_by!(key: params[:id])
  end

  def client_params
    params.require(:client).permit(:name, :color, :coordinates, :uuid)
  end
end
