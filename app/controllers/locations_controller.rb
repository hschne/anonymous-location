# frozen_string_literal: true

class LocationsController < ApplicationController
  before_action :set_location, only: %i[show destroy]

  def show
    session[:uuid] ||= SecureRandom.uuid
    @client = Client.new(uuid: session[:uuid])
  end

  def new
    @location = Location.new(expiry: 60)
  end

  def create
    @location = Location.new(location_params)

    respond_to do |format|
      if @location.save
        format.all { redirect_to location_url(@location), notice: "Location #{@location.name} created." }
      else
        flash.now[:alert] = @location.errors.full_messages.join(', ')
        format.html { render :new, status: :unprocessable_entity }
        format.turbo_stream
      end
    end
  end

  def destroy
    @location.destroy!

    respond_to do |format|
      format.html { redirect_to new_location_url, notice: 'Location was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private

  def set_location
    @location = Location.find_by!(key: params[:id])
  end

  # Only allow a list of trusted parameters through.
  def location_params
    params.require(:location).permit(:name, :expiry, :location)
  end
end
